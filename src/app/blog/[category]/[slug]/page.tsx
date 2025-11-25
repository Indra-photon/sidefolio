import { Container } from '@/components/Container';
import { Heading } from '@/components/Heading';
import { Paragraph } from '@/components/Paragraph';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, Eye, Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { twMerge } from "tailwind-merge";
import localFont from "next/font/local";


const CalSans = localFont({
  src: [{ path: "../../../../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});

type Props = {
  params: Promise<{ category: string; slug: string }>;
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

async function getBlogBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-one-blog/${slug}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.success ? data.blog : null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function incrementBlogViews(blogId: string) {
  try {
    // TODO: Create API endpoint to increment views
    // await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/increment-blog-views`, {
    //   method: 'POST',
    //   body: JSON.stringify({ blogId })
    // });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.categoryId.slug}/${blog.slug}`;

  return {
    title: blog.seo.metaTitle,
    description: blog.seo.metaDescription,
    keywords: blog.seo.metaKeywords,
    authors: [{ name: blog.seo.author }],
    creator: blog.seo.author,
    publisher: blog.seo.publisher,
    robots: {
      index: blog.seo.robots.index,
      follow: blog.seo.robots.follow,
      googleBot: {
        index: blog.seo.robots.index,
        follow: blog.seo.robots.follow,
        'max-video-preview': blog.seo.robots.maxVideoPreview,
        'max-image-preview': blog.seo.robots.maxImagePreview,
        'max-snippet': blog.seo.robots.maxSnippet,
      },
    },
    alternates: {
      canonical: blog.seo.canonicalUrl || blogUrl,
    },
    openGraph: {
      type: blog.seo.openGraph.type as any,
      locale: blog.seo.openGraph.locale,
      url: blog.seo.openGraph.url,
      title: blog.seo.openGraph.title,
      description: blog.seo.openGraph.description,
      siteName: blog.seo.openGraph.siteName,
      images: blog.seo.openGraph.images.map((img: any) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
    },
    twitter: {
      card: blog.seo.twitter.card as any,
      title: blog.seo.twitter.title,
      description: blog.seo.twitter.description,
      images: blog.seo.twitter.images,
      creator: blog.seo.twitter.creator,
      site: blog.seo.twitter.site,
    },
  };
}

// Generate JSON-LD structured data
function generateStructuredData(blog: any) {
  return {
    '@context': 'https://schema.org',
    '@type': blog.seo.structuredData.type,
    headline: blog.seo.structuredData.headline,
    description: blog.seo.structuredData.description,
    image: blog.seo.structuredData.image,
    datePublished: blog.seo.structuredData.datePublished,
    dateModified: blog.seo.structuredData.dateModified,
    author: {
      '@type': blog.seo.structuredData.author.type,
      name: blog.seo.structuredData.author.name,
      url: blog.seo.structuredData.author.url,
    },
    publisher: {
      '@type': blog.seo.structuredData.publisher.type,
      name: blog.seo.structuredData.publisher.name,
      logo: {
        '@type': blog.seo.structuredData.publisher.logo.type,
        url: blog.seo.structuredData.publisher.logo.url,
      },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { category, slug } = await params;
  const blog = await getBlogBySlug(slug);
  
  
  
  if (!blog) {
    notFound();
  }

  // Increment views (fire and forget)
  incrementBlogViews(blog._id);

  const structuredData = generateStructuredData(blog);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Container className={twMerge(CalSans.className,"max-w-7xl")}>
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700">
            Blog
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/blog/${category}`} className="text-sm text-gray-500 hover:text-gray-700">
            {blog.categoryId.name}
          </Link>
        </div>

        {/* Blog Header */}
        <article>
          <header className="mb-8">
            {/* Category Badge */}
            <Link href={`/blog/${category}`}>
              <Badge className="mb-4" variant="secondary">
                {blog.categoryId.icon} {blog.categoryId.name}
              </Badge>
            </Link>

            {/* Title */}
            <Heading className="font-black text-4xl mb-6 leading-tight">
              {blog.title}
            </Heading>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={blog.publishedAt || blog.createdAt}>
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blog.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {/* <span>{blog.views} views</span> */}
                <span>33 views</span>
              </div>
            </div>

            {/* Description */}
            <Paragraph className="text-xl text-gray-400 leading-relaxed">
              {blog.description}
            </Paragraph>
          </header>

          {/* Featured Image */}
          <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
            <Image
              src={getOptimizedImageUrl(blog.thumbnail, 1200)}
              alt={blog.title}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>

          <Separator className="my-8" />

          {/* Blog Content */}
        {blog.content && (
            <div
                className={twMerge(
                    CalSans.className,
                    `prose prose-lg prose-gray max-w-none
                    prose-headings:font-bold prose-headings:text-white
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-white prose-p:leading-relaxed
                    prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-300 prose-strong:font-semibold
                    prose-code:text-neutral-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-neutral-600 prose-pre:text-gray-100
                    prose-img:rounded-lg prose-img:shadow-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-4 prose-blockquote:italic
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:text-gray-700`
                )}
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
        )}

          <Separator className="my-12" />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-600" />
                <Heading className="text-xl font-semibold">Tags</Heading>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    <span className="text-white">{tag}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Back to Category */}
          <Link 
            href={`/blog/${category}`}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {blog.categoryId.name}
          </Link>
        </article>
      </Container>
    </>
  );
}