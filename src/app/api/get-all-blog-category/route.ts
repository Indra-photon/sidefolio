import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogCategoryModel from '../models/BlogCategory';

// GET - Fetch all categories
export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('activeOnly') === 'true';

        const query = activeOnly ? { isActive: true } : {};
        
        const categories = await BlogCategoryModel.find(query)
            .sort({ displayOrder: 1, createdAt: -1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                categories
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}