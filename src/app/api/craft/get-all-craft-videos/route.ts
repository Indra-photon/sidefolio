import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CraftVideoModel from '@/app/api/models/CraftVideo';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
    } catch (err) {
        console.error('Database connection failed:', err);
        return NextResponse.json(
            { success: false, message: 'Database connection failed' },
            { status: 500 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        
        // Query parameters
        const isPublished = searchParams.get('isPublished');
        const isFeatured = searchParams.get('isFeatured');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');
        const sortBy = searchParams.get('sortBy') || 'displayOrder'; // displayOrder, creationDate, views
        const sortOrder = searchParams.get('sortOrder') || 'asc'; // asc or desc
        const tags = searchParams.get('tags'); // comma-separated tags

        // Build query
        const query: any = {};
        
        if (isPublished !== null && isPublished !== undefined) {
            query.isPublished = isPublished === 'true';
        }
        
        if (isFeatured !== null && isFeatured !== undefined) {
            query.isFeatured = isFeatured === 'true';
        }

        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tagArray };
        }

        // Build sort object
        const sort: any = {};
        if (sortBy === 'displayOrder') {
            sort.displayOrder = sortOrder === 'desc' ? -1 : 1;
            sort.creationDate = -1; // Secondary sort by date
        } else if (sortBy === 'creationDate') {
            sort.creationDate = sortOrder === 'desc' ? -1 : 1;
        } else if (sortBy === 'views') {
            sort.views = sortOrder === 'desc' ? -1 : 1;
        }

        // Fetch videos
        const videos = await CraftVideoModel.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const totalCount = await CraftVideoModel.countDocuments(query);
        console.log(`Fetched ${videos.length} craft videos (Total: ${totalCount})`);
        console.log("Videos:", videos);
        
        

        return NextResponse.json(
            {
                success: true,
                videos,
                pagination: {
                    total: totalCount,
                    limit,
                    skip,
                    hasMore: skip + videos.length < totalCount
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching craft videos:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}