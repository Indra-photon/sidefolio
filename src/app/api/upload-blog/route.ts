import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogModel from '../models/Blog';
import { calculateReadingTime, sanitizeSlug, formatTags } from '@/lib/blogHelpers';
import { uploadImage } from '@/lib/imagekit';
import { extractImageKitUrls, extractFileIdFromUrl } from '@/lib/blogHelpers';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const formData = await request.formData();
        
        // Extract form fields
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const content = formData.get('content') as string; // TinyMCE HTML content with code snippets
        const categoryId = formData.get('categoryId') as string;
        const author = formData.get('author') as string;
        const thumbnailFile = formData.get('thumbnail') as File;
        const tagsString = formData.get('tags') as string;
        const isPublished = formData.get('isPublished') === 'true';
        const isFeatured = formData.get('isFeatured') === 'true';

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

        // Validate required fields
        if (!title || !slug || !description || !content || !categoryId || !author || !thumbnailFile) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Sanitize slug
        const sanitizedSlug = sanitizeSlug(slug);

        // Check if slug already exists
        const existingBlog = await BlogModel.findOne({ slug: sanitizedSlug });
        if (existingBlog) {
            return NextResponse.json(
                { success: false, message: 'Slug already exists' },
                { status: 409 }
            );
        }

        // Upload thumbnail to ImageKit
        const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
        const thumbnailUpload = await uploadImage(
            thumbnailBuffer,
            `${sanitizedSlug}-thumbnail`,
            'blog-thumbnails',
            [sanitizedSlug, 'thumbnail']
        );

        // NEW: Extract all ImageKit file URLs from content for tracking
        const contentUrls = extractImageKitUrls(content);
        const contentFileIds = contentUrls.map(url => extractFileIdFromUrl(url)).filter(id => id !== null) as string[];

        // Upload additional images from content if needed
        // (This part can be expanded to parse content and upload images accordingly)

        

        // Calculate reading time
        const readingTime = calculateReadingTime(content);

        // Format tags
        const tags = formatTags(tagsString ? tagsString.split(',') : []);

        // Parse meta keywords
        const metaKeywordsArray = metaKeywords 
            ? metaKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
            : [];

        // Create blog post URL for SEO
        const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${sanitizedSlug}`;

        // Create new blog post
        const newBlog = new BlogModel({
            title,
            slug: sanitizedSlug,
            description,
            content, // Contains HTML with code snippets from TinyMCE
            categoryId,
            author,
            thumbnail: thumbnailUpload.url,
            thumbnailFileId: thumbnailUpload.fileId,
            images: [thumbnailUpload.url],
            contentFileIds: contentFileIds,
            tags,
            readingTime,
            views: 0,
            isPublished,
            isFeatured,
            seo: {
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || description,
                metaKeywords: metaKeywordsArray,
                canonicalUrl: canonicalUrl || blogUrl,
                author,
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
                    url: blogUrl,
                    title: ogTitle || title,
                    description: ogDescription || description,
                    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Indranil Maiti',
                    images: [{
                        url: thumbnailUpload.url,
                        width: 1200,
                        height: 630,
                        alt: title
                    }]
                },
                twitter: {
                    card: 'summary_large_image',
                    title: twitterTitle || title,
                    description: twitterDescription || description,
                    images: [thumbnailUpload.url],
                    creator: twitterCreator || '@your_twitter',
                    site: '@your_twitter'
                },
                structuredData: {
                    type: 'Article',
                    headline: title,
                    description,
                    image: [thumbnailUpload.url],
                    datePublished: new Date(),
                    dateModified: new Date(),
                    author: {
                        type: 'Person',
                        name: author,
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
            },
            publishedAt: isPublished ? new Date() : undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newBlog.save();

        return NextResponse.json(
            { 
                success: true, 
                message: 'Blog created successfully',
                blog: {
                    id: newBlog._id,
                    slug: newBlog.slug,
                    title: newBlog.title
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
