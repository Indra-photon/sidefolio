import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogCategoryModel from '../../models/BlogCategory';

// DELETE - Delete category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Category ID is required' },
                { status: 400 }
            );
        }

        // Find and delete category
        const category = await BlogCategoryModel.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json(
                { success: false, message: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Category deleted successfully'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}