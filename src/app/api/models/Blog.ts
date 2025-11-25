import mongoose, { Document, Schema } from 'mongoose';

export interface BlogSEO {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    canonicalUrl?: string;
    author: string;
    publisher: string;
    robots: {
        index: boolean;
        follow: boolean;
        maxImagePreview: string;
        maxSnippet: number;
        maxVideoPreview: number;
    };
    openGraph: {
        type: string;
        locale: string;
        url: string;
        title: string;
        description: string;
        siteName: string;
        images: {
            url: string;
            width: number;
            height: number;
            alt: string;
        }[];
    };
    twitter: {
        card: string;
        title: string;
        description: string;
        images: string[];
        creator: string;
        site?: string;
    };
    structuredData: {
        type: string;
        headline: string;
        description: string;
        image: string[];
        datePublished: Date;
        dateModified: Date;
        author: {
            type: string;
            name: string;
            url?: string;
        };
        publisher: {
            type: string;
            name: string;
            logo: {
                type: string;
                url: string;
            };
        };
    };
}

export interface Blog extends Document {
    title: string;
    slug: string;
    description: string;
    content: string;
    categoryId: mongoose.Schema.Types.ObjectId;
    author: string;
    thumbnail: string;
    thumbnailFileId: string;
    images: string[];
    contentFileIds: string[];
    tags: string[];
    readingTime: number;
    views: number;
    isPublished: boolean;
    isFeatured: boolean;
    seo: BlogSEO;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

const BlogSEOSchema = new Schema({
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: [{ type: String }],
    canonicalUrl: { type: String },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    robots: {
        index: { type: Boolean, required: true, default: true },
        follow: { type: Boolean, required: true, default: true },
        maxImagePreview: { type: String, required: true, default: 'large' },
        maxSnippet: { type: Number, required: true, default: -1 },
        maxVideoPreview: { type: Number, required: true, default: -1 }
    },
    openGraph: {
        type: { type: String, required: true, default: 'article' },
        locale: { type: String, required: true, default: 'en_US' },
        url: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        siteName: { type: String, required: true },
        images: [{
            url: { type: String, required: true },
            width: { type: Number, required: true, default: 1200 },
            height: { type: Number, required: true, default: 630 },
            alt: { type: String, required: true }
        }]
    },
    twitter: {
        card: { type: String, required: true, default: 'summary_large_image' },
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: [{ type: String }],
        creator: { type: String, required: true },
        site: { type: String }
    },
    structuredData: {
        type: { type: String, required: true, default: 'Article' },
        headline: { type: String, required: true },
        description: { type: String, required: true },
        image: [{ type: String }],
        datePublished: { type: Date, required: true },
        dateModified: { type: Date, required: true },
        author: {
            type: { type: String, required: true, default: 'Person' },
            name: { type: String, required: true },
            url: { type: String }
        },
        publisher: {
            type: { type: String, required: true, default: 'Organization' },
            name: { type: String, required: true },
            logo: {
                type: { type: String, required: true, default: 'ImageObject' },
                url: { type: String, required: true }
            }
        }
    }
}, { _id: false });

const BlogSchema: Schema<Blog> = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
    author: { type: String, required: true },
    thumbnail: { type: String, required: true },
    thumbnailFileId: { type: String, required: true },
    images: [{ type: String }],
    contentFileIds: [{ type: String }],
    tags: [{ type: String }],
    readingTime: { type: Number, required: true, default: 0 },
    views: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, required: true, default: false },
    isFeatured: { type: Boolean, required: true, default: false },
    seo: { type: BlogSEOSchema, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    publishedAt: { type: Date }
});

const BlogModel = mongoose.models.Blog as mongoose.Model<Blog> || mongoose.model<Blog>('Blog', BlogSchema);

export default BlogModel;