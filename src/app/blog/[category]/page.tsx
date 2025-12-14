import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/Container';
import { Heading } from '@/components/Heading';
import { Paragraph } from '@/components/Paragraph';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogLink } from '@/components/BlogLink';

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

// Helper to get optimized ImageKit URL
function getOptimizedImageUrl(url: string, width: number) {
  if (!url) return '';
  if (url.includes('ik.imagekit.io')) {
    const urlParts = url.split('/');
    const filename = urlParts.pop();
    const basePath = urlParts.join('/');
    return `${basePath}/tr:w-${width},q-80,f-auto/${filename}`;
  }
  return url;
}

async function getCategoryBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-all-blog-category`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) {
      return data.categories.find((cat: any) => cat.slug === slug);
    }
    return null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getBlogsByCategory(categoryId: string, page: number = 1) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-all-blogs?categoryId=${categoryId}&page=${page}&limit=5&isPublished=true`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return data.success ? data : { blogs: [], pagination: { currentPage: 1, totalPages: 1, totalBlogs: 0 } };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], pagination: { currentPage: 1, totalPages: 1, totalBlogs: 0 } };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);
  
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${category}`;

  return {
    title: `${categoryData.name} | Blog | Indranil Maiti`,
    description: categoryData.description,
    keywords: [categoryData.name, 'blog', 'articles', 'tutorials', 'Indranil Maiti'],
    authors: [{ name: 'Indranil Maiti' }],
    creator: 'Indranil Maiti',
    publisher: 'Indranil Maiti',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: categoryUrl,
      title: `${categoryData.name} Articles`,
      description: categoryData.description,
      siteName: 'Indranil Maiti',
      images: categoryData.thumbnail ? [
        {
          url: categoryData.thumbnail,
          width: 1200,
          height: 630,
          alt: categoryData.name,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.name} Articles`,
      description: categoryData.description,
      images: categoryData.thumbnail ? [categoryData.thumbnail] : [],
      creator: '@your_twitter',
    },
  };
}

export default async function CategoryBlogsPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1');

  const categoryData = await getCategoryBySlug(category);
  
  if (!categoryData) {
    notFound();
  }

  const { blogs, pagination } = await getBlogsByCategory(categoryData._id, currentPage);

  return (
    <Container className="max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Categories
        </Link>
      </div>

      {/* Category Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          {categoryData.icon && <span className="text-4xl">{categoryData.icon}</span>}
          <Heading className="font-black">{categoryData.name}</Heading>
        </div>
        <Paragraph className="text-gray-600">{categoryData.description}</Paragraph>
        <div className="mt-4">
          <Badge variant="secondary">{pagination.totalBlogs} articles</Badge>
        </div>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <Paragraph className="text-gray-500">I am writing articles. Please check back later.</Paragraph>
        </div>
      ) : (
        <>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {blogs.map((blog: any) => (
              <Link 
                key={blog._id} 
                href={`/blog/${categoryData.slug}/${blog.slug}`}
                
                className="group"
              >
                <Card 
                 className="h-full transition-shadow hover:shadow-lg overflow-hidden">
                
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={getOptimizedImageUrl(blog.thumbnail, 800)}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {blog.isFeatured && (
                      <Badge className="absolute top-4 right-4 bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-2">
                      {blog.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                   
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blog.readingTime} min read
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views} views
                      </div>
                    </div>

                   
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {blog.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {blogs.map((blog: any) => (
              <BlogLink 
                key={blog._id} 
                href={`/blog/${categoryData.slug}/${blog.slug}`}
                articleTitle={blog.title}
                className="group"
              >
                <Card className="h-full transition-shadow hover:shadow-lg overflow-hidden">
                  {/* Blog Thumbnail */}
                  <div className="relative w-full h-48 sm:h-56 md:h-80 overflow-hidden rounded-t-lg">
                    <Image
                      src={getOptimizedImageUrl(blog.thumbnail, 800)}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                      className="object-contain sm:object-cover"
                    />
                    {blog.isFeatured && (
                      <Badge className="absolute top-4 right-4 bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-2">
                      {blog.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blog.readingTime} min read
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views} views
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {blog.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </BlogLink>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Link
                href={`/blog/${category}?page=${currentPage - 1}`}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
              >
                <Button
                  variant="outline"
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>

              <Link
                href={`/blog/${category}?page=${currentPage + 1}`}
                className={currentPage >= pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
              >
                <Button
                  variant="outline"
                  disabled={currentPage >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </Container>
  );
}