import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogModel from '../models/Blog';
import { deleteImage } from '@/lib/imagekit';

export async function DELETE(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('blogId');

        if (!blogId) {
            return Response.json(
                { success: false, message: 'Blog ID is required' },
                { status: 400 }
            );
        }

        // Find blog
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return Response.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        // NEW: Delete thumbnail from ImageKit
        try {
            await deleteImage(blog.thumbnailFileId);
        } catch (error) {
            console.error('Failed to delete thumbnail:', error);
        }

        // NEW: Delete all content images/videos from ImageKit
        for (const fileId of blog.contentFileIds) {
            try {
                await deleteImage(fileId);
            } catch (error) {
                console.error(`Failed to delete content file ${fileId}:`, error);
            }
        }

        // Delete blog from database
        await BlogModel.findByIdAndDelete(blogId);

        return Response.json(
            { success: true, message: 'Blog and all associated files deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting blog:', error);
        return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}