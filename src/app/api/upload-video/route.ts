import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/imagekit';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const videoFile = formData.get('file') as File;

        // Validate file exists
        if (!videoFile) {
            return NextResponse.json(
                { success: false, message: 'No video file provided' },
                { status: 400 }
            );
        }

        // Validate file type (MP4 or GIF only)
        const allowedTypes = ['video/mp4', 'image/gif'];
        if (!allowedTypes.includes(videoFile.type)) {
            return NextResponse.json(
                { success: false, message: 'Only MP4 and GIF files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 30MB)
        const maxSize = 30 * 1024 * 1024; // 30MB in bytes
        if (videoFile.size > maxSize) {
            return NextResponse.json(
                { success: false, message: 'Video file must be under 30MB' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = videoFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
        const extension = videoFile.name.split('.').pop();
        const fileName = `${originalName}-${timestamp}.${extension}`;

        // Upload to ImageKit
        const uploadResult = await uploadImage(
            videoBuffer,
            fileName,
            'blog-videos',
            ['blog', 'video'],
            'video'
        );

        // Return the video URL
        return NextResponse.json({
            success: true,
            location: uploadResult.url,
            fileId: uploadResult.fileId
        });

    } catch (error) {
        console.error('Video upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to upload video' },
            { status: 500 }
        );
    }
}