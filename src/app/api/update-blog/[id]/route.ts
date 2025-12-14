import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogModel from '../../models/Blog';
import BlogCategoryModel from '../../models/BlogCategory';
import { calculateReadingTime, sanitizeSlug, formatTags, findRemovedUrls, cleanupRemovedFiles, extractImageKitUrls, extractFileIdFromUrl } from '@/lib/blogHelpers';
import { uploadImage, deleteImage } from '@/lib/imagekit';
import mongoose, { Document, Schema } from 'mongoose';


export async function PUT(request: NextRequest) {
    await dbConnect();

    try {
        const formData = await request.formData();        
        const blogId = formData.get('blogId') as string;
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const thumbnailFile = formData.get('thumbnail') as File | null;
        const tagsString = formData.get('tags') as string;
        const isPublished = formData.get('isPublished') === 'true';
        const isFeatured = formData.get('isFeatured') === 'true';
        const newCategory = formData.get('categoryId') as string;
        // SEO fields
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const metaKeywords = formData.get('metaKeywords') as string;
        const canonicalUrl = formData.get('canonicalUrl') as string;
        const ogTitle = formData.get('ogTitle') as string;
        const ogDescription = formData.get('ogDescription') as string;
        const twitterTitle = formData.get('twitterTitle') as string;
        const twitterDescription = formData.get('twitterDescription') as string;
        const twitterCreator = formData.get('twitterCreator') as string;

        if (!blogId) {
            return NextResponse.json(
                { success: false, message: 'Blog ID is required' },
                { status: 400 }
            );
        }

        // Find existing blog
        const existingBlog = await BlogModel.findById(blogId);
        if (!existingBlog) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        let thumbnailUrl = existingBlog.thumbnail;
        let thumbnailFileId = existingBlog.thumbnailFileId;
        
        if (thumbnailFile) {
            // Delete old thumbnail
            await deleteImage(existingBlog.thumbnailFileId);
            
            // Upload new thumbnail
            const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
            const thumbnailUpload = await uploadImage(
                thumbnailBuffer,
                `${sanitizeSlug(slug)}-thumbnail`,
                'blog-thumbnails',
                [sanitizeSlug(slug), 'thumbnail']
            );
            
            thumbnailUrl = thumbnailUpload.url;
            thumbnailFileId = thumbnailUpload.fileId;
        }
        const removedUrls = findRemovedUrls(existingBlog.content, content);
        await cleanupRemovedFiles(removedUrls);
        const contentUrls = extractImageKitUrls(content);
        const contentFileIds = contentUrls.map(url => extractFileIdFromUrl(url)).filter(id => id !== null) as string[];
        const readingTime = calculateReadingTime(content);

        // Update blog
        existingBlog.title = title;
        // convert categoryId to ObjectId if valid; cast to any to satisfy TS typing
        if (newCategory && mongoose.Types.ObjectId.isValid(newCategory)) {
            existingBlog.categoryId = new mongoose.Types.ObjectId(newCategory) as any;
        } else {
            // keep existing category if newCategory is not provided or invalid
            existingBlog.categoryId = existingBlog.categoryId;
            console.log('Invalid or missing categoryId, keeping existing category.');
            
        }
        existingBlog.slug = sanitizeSlug(slug);
        existingBlog.content = content;
        existingBlog.thumbnail = thumbnailUrl;
        existingBlog.thumbnailFileId = thumbnailFileId;
        existingBlog.contentFileIds = contentFileIds;
        existingBlog.readingTime = readingTime;
        existingBlog.updatedAt = new Date();
        existingBlog.isPublished = isPublished;
        existingBlog.isFeatured = isFeatured;
        existingBlog.tags = formatTags(tagsString ? tagsString.split(',') : []);
        existingBlog.seo = {
            metaTitle: metaTitle || title,
            metaDescription: metaDescription,
            metaKeywords: metaKeywords 
                ? metaKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
                : [],
            canonicalUrl: canonicalUrl,
            author: "Indranil Maiti",
            publisher: process.env.NEXT_PUBLIC_SITE_NAME || 'Indranil Maiti',
            robots: {
                index: true,
                follow: true,
                maxImagePreview: 'large',
                maxSnippet: -1,
                maxVideoPreview: -1
            },
            
            openGraph: {
                type: 'article',
                locale: 'en_US',
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${sanitizeSlug(slug)}`,
                title: ogTitle,
                description: ogDescription,
                siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Indranil Maiti',
                images: [{
                    url: thumbnailUrl,
                    width: 1200,
                    height: 630,
                    alt: title
                }]
            },
            twitter: {
                card: 'summary_large_image',
                title: twitterTitle,
                description: twitterDescription,
                images: [thumbnailUrl],
                creator: twitterCreator,
                site: '@your_twitter'
            },
            structuredData: {
                type: 'Article',
                headline: title,
                description: ogDescription,
                image: [thumbnailUrl],
                datePublished: new Date(),
                dateModified: new Date(),
                author: {
                    type: 'Person',
                    name: 'Indranil Maiti',
                    url: process.env.NEXT_PUBLIC_SITE_URL
                },
                publisher: {
                    type: 'Organization',
                    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Indranil Maiti',
                    logo: {
                        type: 'ImageObject',
                        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
                    }
                }
            }
        };

        await existingBlog.save();

        return NextResponse.json(
            { success: true, message: 'Blog updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.log('Error updating blog:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}