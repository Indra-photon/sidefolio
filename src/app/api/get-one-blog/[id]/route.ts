import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogModel from '../../models/Blog';
import mongoose from 'mongoose';

// GET - Fetch single blog by ID or slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Blog ID or slug is required' },
                { status: 400 }
            );
        }

        // Check if id is a valid MongoDB ObjectId
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
        
        let blog;
        
        if (isValidObjectId) {
            // Search by ID
            blog = await BlogModel.findById(id)
                .populate('categoryId', 'name slug icon')
                .lean();
        } else {
            // Search by slug
            blog = await BlogModel.findOne({ slug: id })
                .populate('categoryId', 'name slug icon')
                .lean();
        }

        if (!blog) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                blog
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}