import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CraftVideoModel from '../../../models/CraftVideo';
import { deleteImage } from '@/lib/imagekit';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Video ID is required' },
                { status: 400 }
            );
        }

        // Find video
        const video = await CraftVideoModel.findById(id);
        if (!video) {
            return NextResponse.json(
                { success: false, message: 'Craft video not found' },
                { status: 404 }
            );
        }

        // Delete video file from ImageKit
        try {
            await deleteImage(video.videoFileId);
            console.log(`Deleted video file: ${video.videoFileId}`);
        } catch (error) {
            console.error('Failed to delete video file:', error);
        }

        // Delete thumbnail from ImageKit if exists
        if (video.thumbnailFileId) {
            try {
                await deleteImage(video.thumbnailFileId);
                console.log(`Deleted thumbnail: ${video.thumbnailFileId}`);
            } catch (error) {
                console.error('Failed to delete thumbnail:', error);
            }
        }

        // Delete video from database
        await CraftVideoModel.findByIdAndDelete(id);

        return NextResponse.json(
            { 
                success: true, 
                message: 'Craft video and associated files deleted successfully' 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting craft video:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}