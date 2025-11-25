import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogCategoryModel from '../models/BlogCategory';
import { uploadImage } from '@/lib/imagekit';

// POST - Create new category
export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const icon = formData.get('icon') as string;
        const isActive = formData.get('isActive') === 'true';
        const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;

        // Validate required fields
        if (!name || !slug || !description) {
            return NextResponse.json(
                { success: false, message: 'Name, slug, and description are required' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existingCategory = await BlogCategoryModel.findOne({ slug });
        if (existingCategory) {
            return NextResponse.json(
                { success: false, message: 'Slug already exists' },
                { status: 409 }
            );
        }

        const thumbnailFile = formData.get('thumbnail') as File | null;
        console.log('📁 Thumbnail file received:', thumbnailFile ? 'YES' : 'NO');
if (thumbnailFile) {
    console.log('📁 File name:', thumbnailFile.name);
    console.log('📁 File size:', thumbnailFile.size);
    console.log('📁 File type:', thumbnailFile.type);
}

        let thumbnailUrl = '';
        let thumbnailFileId = '';

        // Upload thumbnail if provided
        if (thumbnailFile) {
    console.log('🔄 Starting ImageKit upload...');
    const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    console.log('📦 Buffer size:', thumbnailBuffer.length);
    
    const thumbnailUpload = await uploadImage(
        thumbnailBuffer,
        `${slug}-category-thumbnail`,
        'category-thumbnails',
        [slug, 'category']
    );
    
    console.log('✅ ImageKit upload success!');
    console.log('🔗 URL:', thumbnailUpload.url);
    console.log('🆔 File ID:', thumbnailUpload.fileId);
    
    thumbnailUrl = thumbnailUpload.url;
    thumbnailFileId = thumbnailUpload.fileId;
}

console.log('💾 Saving to DB - thumbnailUrl:', thumbnailUrl);
console.log('💾 Saving to DB - thumbnailFileId:', thumbnailFileId);
        

        // Create new category
        const newCategory = new BlogCategoryModel({
            name,
            slug,
            description,
            icon: icon || '',
            thumbnail: thumbnailUrl,
            thumbnailFileId: thumbnailFile ? thumbnailFileId : '',
            isActive: isActive !== undefined ? isActive : true,
            displayOrder: displayOrder || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newCategory.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Category created successfully',
                category: newCategory
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}