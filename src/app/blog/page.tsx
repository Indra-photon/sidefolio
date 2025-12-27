import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/Container';
import { Heading } from '@/components/Heading';
import { Paragraph } from '@/components/Paragraph';
import Link from 'next/link';
import Image from 'next/image';
import { BlogCategoryLink } from '@/components/BlogCategoryLink';
import dbConnect from '@/lib/dbConnect';
import BlogCategoryModel from '@/app/api/models/BlogCategory';

// async function getAllCategories() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-all-blog-category?activeOnly=true`, {
//       cache: 'no-store'
//     });
    
//     if (!res.ok) {
//       throw new Error('Failed to fetch categories');
//     }
    
//     const data = await res.json();
//     return data.success ? data.categories : [];
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return [];
//   }
// }

// Helper to get optimized ImageKit URL

async function getAllCategories() {
  try {
    await dbConnect();
    
    const categories = await BlogCategoryModel.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    
    console.log(`✅ Fetched ${categories.length} categories (direct DB)`);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}









function getOptimizedImageUrl(url: string, width: number) {
  if (!url) return '';
  
  // If it's an ImageKit URL, add transformation parameters
  if (url.includes('ik.imagekit.io')) {
    const urlParts = url.split('/');
    const filename = urlParts.pop();
    const basePath = urlParts.join('/');
    return `${basePath}/tr:w-${width},q-80,f-auto/${filename}`;
  }
  
  return url;
}

export default async function BlogPage() {
  const categories = await getAllCategories();

  return (
    <Container className="max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-4xl">📝</span>
        <Heading className="font-black pb-4">I write about...</Heading>
        <Paragraph className="text-gray-600">
          Explore different topics and find articles that interest you
        </Paragraph>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Paragraph className="text-gray-500">No categories available yet.</Paragraph>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <BlogCategoryLink 
              key={category._id} 
              href={`/blog/${category.slug}`}
              categoryName={category.name}
              className="group"
            >
              <Card className="h-full transition-shadow hover:shadow-lg">
                {category.thumbnail && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={getOptimizedImageUrl(category.thumbnail, 600)}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {category.icon && (
                      <span className="text-2xl">{category.icon}</span>
                    )}
                    <CardTitle className="group-hover:text-emerald-600 transition-colors">
                      {category.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </BlogCategoryLink>
          ))}
        </div>
      )}
    </Container>
  );
}