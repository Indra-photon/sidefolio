import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogModel from '../../models/Blog';
import BlogCategoryModel from '../../models/BlogCategory';

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        // Get total blogs count
        const totalBlogs = await BlogModel.countDocuments();
        
        // Get published blogs count
        const publishedBlogs = await BlogModel.countDocuments({ isPublished: true });
        
        // Get draft blogs count
        const draftBlogs = await BlogModel.countDocuments({ isPublished: false });
        
        // Get featured blogs count
        const featuredBlogs = await BlogModel.countDocuments({ isFeatured: true });
        
        // Get total categories
        const totalCategories = await BlogCategoryModel.countDocuments({ isActive: true });
        
        // Get total views across all blogs
        const viewsAggregate = await BlogModel.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const totalViews = viewsAggregate.length > 0 ? viewsAggregate[0].totalViews : 0;
        
        // Get recent blogs (last 5)
        const recentBlogs = await BlogModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title slug isPublished createdAt')
            .lean();

        return Response.json(
            {
                success: true,
                stats: {
                    totalBlogs,
                    publishedBlogs,
                    draftBlogs,
                    featuredBlogs,
                    totalCategories,
                    totalViews
                },
                recentBlogs
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}