import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CraftVideoModel from '../../models/CraftVideo';
import { uploadImage } from '@/lib/imagekit';
import { sanitizeSlug, formatTags, generateUniqueFilename } from '@/lib/craftHelpers';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const formData = await request.formData();
        
        const videoTitle = formData.get('videoTitle') as string;
        const slug = formData.get('slug') as string;
        const creationDate = formData.get('creationDate') as string;
        const videoFile = formData.get('video') as File | null;
        const thumbnailFile = formData.get('thumbnail') as File | null;
        const productionLink = formData.get('productionLink') as string;
        const blogLink = formData.get('blogLink') as string;
        const codeblock = formData.get('codeblock') as string;
        const designDetails = formData.get('designDetails') as string;
        const tagsString = formData.get('tags') as string;
        const isFeatured = formData.get('isFeatured') === 'true';
        const isPublished = formData.get('isPublished') === 'true';
        const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;

        // Validation
        if (!videoTitle || !slug || !videoFile || !designDetails) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate video file type
        if (videoFile.type !== 'video/mp4') {
            return NextResponse.json(
                { success: false, message: 'Only MP4 video files are allowed' },
                { status: 400 }
            );
        }

        // Validate video file size (12MB max)
        const maxSize = 15 * 1024 * 1024;
        if (videoFile.size > maxSize) {
            return NextResponse.json(
                { success: false, message: 'Video file must be under 15MB' },
                { status: 400 }
            );
        }

        // Sanitize slug
        const sanitizedSlug = sanitizeSlug(slug);

        // Check if slug already exists
        const existingVideo = await CraftVideoModel.findOne({ slug: sanitizedSlug });
        if (existingVideo) {
            return NextResponse.json(
                { success: false, message: 'Slug already exists' },
                { status: 409 }
            );
        }

        // Upload video to ImageKit
        const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
        const videoFileName = generateUniqueFilename(videoFile.name);
        const videoUpload = await uploadImage(
            videoBuffer,
            videoFileName,
            'craft',
            [sanitizedSlug, 'craft-video'],
            'video'
        );

        // Upload thumbnail if provided
        let thumbnailUrl = '';
        let thumbnailFileId = '';
        
        
        if (thumbnailFile) {
            const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
            const thumbnailUpload = await uploadImage(
                thumbnailBuffer,
                `${sanitizedSlug}-thumbnail`,
                'craft-thumbnails',
                [sanitizedSlug, 'thumbnail']
            );
            thumbnailUrl = thumbnailUpload.url;
            thumbnailFileId = thumbnailUpload.fileId;
        }

        // Format tags
        const tags = formatTags(tagsString ? tagsString.split(',') : []);

        // Create new craft video
        const newCraftVideo = new CraftVideoModel({
            videoTitle,
            slug: sanitizedSlug,
            creationDate: creationDate ? new Date(creationDate) : new Date(),
            videoLink: videoUpload.url,
            videoFileId: videoUpload.fileId,
            productionLink: productionLink || undefined,
            blogLink: blogLink || undefined,
            codeblock: codeblock || undefined,
            designDetails,
            thumbnail: thumbnailUrl || undefined,
            thumbnailFileId: thumbnailFileId || undefined,
            tags,
            views: 0,
            isFeatured,
            isPublished,
            displayOrder,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newCraftVideo.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Craft video uploaded successfully',
                video: newCraftVideo
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error uploading craft video:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}