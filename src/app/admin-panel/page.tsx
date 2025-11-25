import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, FolderOpen, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/dashboard-stats`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardStats();
  
  const stats = data?.stats || {
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalCategories: 0,
    totalViews: 0,
    featuredBlogs: 0
  };
  
  const recentBlogs = data?.recentBlogs || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of your blog management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Blogs
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.publishedBlogs} published, {stats.draftBlogs} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Categories
            </CardTitle>
            <FolderOpen className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-gray-500 mt-2">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Views
            </CardTitle>
            <Eye className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-2">Across all blogs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Featured Blogs
            </CardTitle>
            <FileText className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.featuredBlogs}</div>
            <p className="text-xs text-gray-500 mt-2">Highlighted content</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Blogs</CardTitle>
          <CardDescription>Your latest blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBlogs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No blogs yet. Start by creating your first blog post!
            </p>
          ) : (
            <div className="space-y-3">
              {recentBlogs.map((blog: any) => (
                <Link
                  key={blog._id}
                  href={`/admin-panel/blogs/${blog._id}`}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{blog.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={blog.isPublished ? "default" : "secondary"}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            href="/admin-panel/create-blog"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Create New Blog</p>
              <p className="text-sm text-gray-500">Write and publish a new blog post</p>
            </div>
          </Link>
          
          <Link
            href="/admin-panel/categories"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderOpen className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Manage Categories</p>
              <p className="text-sm text-gray-500">Organize your blog content</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}