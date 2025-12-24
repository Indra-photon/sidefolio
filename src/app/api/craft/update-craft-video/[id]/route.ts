import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CraftVideoModel from '../../../models/CraftVideo';
import { uploadImage, deleteImage } from '@/lib/imagekit';
import { sanitizeSlug, formatTags, generateUniqueFilename } from '@/lib/craftHelpers';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    try {
        const { id } = await params;
        const formData = await request.formData();
        
        const videoTitle = formData.get('videoTitle') as string;
        const slug = formData.get('slug') as string;
        const creationDate = formData.get('creationDate') as string;
        const videoFile = formData.get('video') as File | null;
        const thumbnailFile = formData.get('thumbnail') as File | null;
        const productionLink = formData.get('productionLink') as string;
        const blogLink = formData.get('blogLink') as string;
        const designDetails = formData.get('designDetails') as string;
        const tagsString = formData.get('tags') as string;
        const isFeatured = formData.get('isFeatured') === 'true';
        const isPublished = formData.get('isPublished') === 'true';
        const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Video ID is required' },
                { status: 400 }
            );
        }

        // Find existing video
        const existingVideo = await CraftVideoModel.findById(id);
        if (!existingVideo) {
            return NextResponse.json(
                { success: false, message: 'Craft video not found' },
                { status: 404 }
            );
        }

        // Check if new slug already exists (excluding current video)
        if (slug && slug !== existingVideo.slug) {
            const sanitizedSlug = sanitizeSlug(slug);
            const duplicateSlug = await CraftVideoModel.findOne({ 
                slug: sanitizedSlug, 
                _id: { $ne: id } 
            });
            
            if (duplicateSlug) {
                return NextResponse.json(
                    { success: false, message: 'Slug already exists' },
                    { status: 409 }
                );
            }
            existingVideo.slug = sanitizedSlug;
        }

        let videoLink = existingVideo.videoLink;
        let videoFileId = existingVideo.videoFileId;
        
        // Handle video file replacement
        if (videoFile) {
            // Validate new video
            if (videoFile.type !== 'video/mp4') {
                return NextResponse.json(
                    { success: false, message: 'Only MP4 video files are allowed' },
                    { status: 400 }
                );
            }

            const maxSize = 12 * 1024 * 1024;
            if (videoFile.size > maxSize) {
                return NextResponse.json(
                    { success: false, message: 'Video file must be under 12MB' },
                    { status: 400 }
                );
            }

            // Delete old video from ImageKit
            try {
                await deleteImage(existingVideo.videoFileId);
            } catch (error) {
                console.error('Failed to delete old video:', error);
            }
            
            // Upload new video
            const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
            const videoFileName = generateUniqueFilename(videoFile.name);
            const videoUpload = await uploadImage(
                videoBuffer,
                videoFileName,
                'craft',
                [existingVideo.slug, 'craft-video'],
                'video'
            );
            
            videoLink = videoUpload.url;
            videoFileId = videoUpload.fileId;
        }

        let thumbnailUrl = existingVideo.thumbnail;
        let thumbnailFileId = existingVideo.thumbnailFileId;

        // Handle thumbnail replacement
        if (thumbnailFile) {
            // Delete old thumbnail if exists
            if (existingVideo.thumbnailFileId) {
                try {
                    await deleteImage(existingVideo.thumbnailFileId);
                } catch (error) {
                    console.error('Failed to delete old thumbnail:', error);
                }
            }
            
            // Upload new thumbnail
            const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
            const thumbnailUpload = await uploadImage(
                thumbnailBuffer,
                `${existingVideo.slug}-thumbnail`,
                'craft-thumbnails',
                [existingVideo.slug, 'thumbnail']
            );
            
            thumbnailUrl = thumbnailUpload.url;
            thumbnailFileId = thumbnailUpload.fileId;
        }

        // Update video fields
        existingVideo.videoTitle = videoTitle || existingVideo.videoTitle;
        existingVideo.creationDate = creationDate ? new Date(creationDate) : existingVideo.creationDate;
        existingVideo.videoLink = videoLink;
        existingVideo.videoFileId = videoFileId;
        existingVideo.productionLink = productionLink || undefined;
        existingVideo.blogLink = blogLink || undefined;
        existingVideo.designDetails = designDetails || existingVideo.designDetails;
        existingVideo.thumbnail = thumbnailUrl || undefined;
        existingVideo.thumbnailFileId = thumbnailFileId || undefined;
        existingVideo.tags = formatTags(tagsString ? tagsString.split(',') : []);
        existingVideo.isFeatured = isFeatured;
        existingVideo.isPublished = isPublished;
        existingVideo.displayOrder = displayOrder;
        existingVideo.updatedAt = new Date();

        await existingVideo.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Craft video updated successfully',
                video: existingVideo
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating craft video:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}