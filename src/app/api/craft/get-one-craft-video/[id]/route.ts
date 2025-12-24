import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CraftVideoModel from '@/app/api/models/CraftVideo';
import mongoose from 'mongoose';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
    } catch (dbError) {
        console.error('Database connection failed:', dbError);
        return NextResponse.json(
            { success: false, message: 'Database connection failed' },
            { status: 503 }
        );
    }

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Video ID or slug is required' },
                { status: 400 }
            );
        }

        console.log(`Fetching craft video with identifier: ${id}`);

        // Check if id is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        
        let video;
        
        if (isValidObjectId) {
            // Search by ID
            console.log('Searching by MongoDB ID');
            video = await CraftVideoModel.findById(id).lean();
        } else {
            // Search by slug
            console.log('Searching by slug');
            video = await CraftVideoModel.findOne({ slug: id }).lean();
        }

        if (!video) {
            console.log(`Craft video not found: ${id}`);
            return NextResponse.json(
                { success: false, message: 'Craft video not found' },
                { status: 404 }
            );
        }

        console.log(`Craft video found: ${video.videoTitle}`);

        return NextResponse.json(
            {
                success: true,
                video
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching craft video:', error);
        
        if (error instanceof mongoose.Error) {
            return NextResponse.json(
                { success: false, message: 'Database query error' },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}