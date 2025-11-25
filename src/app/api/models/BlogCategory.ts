import mongoose, { Document, Schema } from 'mongoose';

export interface BlogCategory extends Document {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    thumbnail?: string;
    thumbnailFileId?: string; 
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const BlogCategorySchema: Schema<BlogCategory> = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String },
    thumbnail: { type: String },
    thumbnailFileId: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    displayOrder: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

const BlogCategoryModel = mongoose.models.BlogCategory as mongoose.Model<BlogCategory> || mongoose.model<BlogCategory>('BlogCategory', BlogCategorySchema);

export default BlogCategoryModel;