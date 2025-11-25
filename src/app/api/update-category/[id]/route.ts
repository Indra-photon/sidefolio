import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogCategoryModel from '../../models/BlogCategory';
import { uploadImage, deleteImage } from '@/lib/imagekit';

// PUT - Update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();

    try {
        const { id } = await params;
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const icon = formData.get('icon') as string;
        const isActive = formData.get('isActive') === 'true';
        const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
        const thumbnailFile = formData.get('thumbnail') as File | null;
        

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Category ID is required' },
                { status: 400 }
            );
        }

        // Find category
        const category = await BlogCategoryModel.findById(id);
        if (!category) {
            return NextResponse.json(
                { success: false, message: 'Category not found' },
                { status: 404 }
            );
        }

        // Check if new slug already exists (excluding current category)
        if (slug && slug !== category.slug) {
            const existingCategory = await BlogCategoryModel.findOne({ slug, _id: { $ne: id } });
            if (existingCategory) {
                return NextResponse.json(
                    { success: false, message: 'Slug already exists' },
                    { status: 409 }
                );
            }
        }

        let thumbnailUrl = category.thumbnail;

        // If new thumbnail uploaded, replace old one
        if (thumbnailFile) {
            // Delete old thumbnail if exists
            if (category.thumbnailFileId) {
                try {
                    await deleteImage(category.thumbnailFileId);
                } catch (error) {
                    console.error('Failed to delete old thumbnail:', error);
                }
            }
            
            // Upload new thumbnail
            const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
            const thumbnailUpload = await uploadImage(
                thumbnailBuffer,
                `${slug}-category-thumbnail`,
                'category-thumbnails',
                [slug, 'category']
            );
            thumbnailUrl = thumbnailUpload.url;
            category.thumbnailFileId = thumbnailUpload.fileId;
        }

        // Update category
        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.description = description || category.description;
        category.icon = icon !== undefined ? icon : category.icon;
        category.thumbnail = category.thumbnail = thumbnailUrl;
        category.isActive = isActive !== undefined ? isActive : category.isActive;
        category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;
        category.updatedAt = new Date();

        await category.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Category updated successfully',
                category
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}