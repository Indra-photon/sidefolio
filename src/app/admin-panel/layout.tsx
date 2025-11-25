import Link from 'next/link';
import { LayoutDashboard, FileText, FolderOpen, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        
        <Separator />
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin-panel"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/admin-panel/blogs"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Blogs</span>
          </Link>
          
          <Link
            href="/admin-panel/create-blog"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Create Blog</span>
          </Link>
          
          <Link
            href="/admin-panel/categories"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FolderOpen className="w-5 h-5" />
            <span>Categories</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Logged in as Admin</p>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}