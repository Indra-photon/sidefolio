import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogModel from '../models/Blog';

// GET - Fetch all blogs with filters
export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const isPublished = searchParams.get('isPublished');
        const isFeatured = searchParams.get('isFeatured');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Build query
        const query: any = {};
        if (categoryId) query.categoryId = categoryId;
        if (isPublished !== null && isPublished !== undefined) {
            query.isPublished = isPublished === 'true';
        }
        if (isFeatured !== null && isFeatured !== undefined) {
            query.isFeatured = isFeatured === 'true';
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Fetch blogs with pagination
        const blogs = await BlogModel.find(query)
            .populate('categoryId', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-content -contentFileIds') // Exclude heavy fields
            .lean();

        // Get total count for pagination
        const totalBlogs = await BlogModel.countDocuments(query);
        const totalPages = Math.ceil(totalBlogs / limit);

        return Response.json(
            {
                success: true,
                blogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBlogs,
                    hasMore: page < totalPages
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching blogs:', error);
        return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}