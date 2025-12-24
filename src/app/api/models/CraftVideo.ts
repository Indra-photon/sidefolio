import mongoose, { Document, Schema } from 'mongoose';

export interface CraftVideo extends Document {
    videoTitle: string;
    creationDate: Date;
    videoLink: string;
    videoFileId: string;
    productionLink?: string;
    blogLink?: string;
    designDetails: string;
    slug: string;
    thumbnail?: string;
    thumbnailFileId?: string;
    tags: string[];
    views: number;
    isFeatured: boolean;
    isPublished: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const CraftVideoSchema: Schema<CraftVideo> = new Schema({
    videoTitle: { type: String, required: true },
    creationDate: { type: Date, required: true, default: Date.now },
    videoLink: { type: String, required: true },
    videoFileId: { type: String, required: true },
    productionLink: { type: String },
    blogLink: { type: String },
    designDetails: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    thumbnailFileId: { type: String },
    tags: [{ type: String }],
    views: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, required: true, default: false },
    isPublished: { type: Boolean, required: true, default: false },
    displayOrder: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

const CraftVideoModel = mongoose.models.CraftVideo as mongoose.Model<CraftVideo> || mongoose.model<CraftVideo>('CraftVideo', CraftVideoSchema);

export default CraftVideoModel;