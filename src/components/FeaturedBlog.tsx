'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Paragraph } from './Paragraph';
import { Container } from './Container';
import { BlogLink } from './BlogLink';

export default function FeaturedBlog() {
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    async function loadBlog() {
      try {
        const res = await fetch('/api/get-all-blogs?isFeatured=true&isPublished=true&limit=1');
        const data = await res.json();
        console.log('Featured blog fetch response:', data);
        
        if (data.success && data.blogs.length > 0) {
          setBlog(data.blogs[0]);
        }
      } catch (error) {
        console.error('Error loading blog:', error);
      }
    }
    loadBlog();
  }, []);

  if (!blog) return null;

  const blogUrl = `/blog/${blog.categoryId.slug}/${blog.slug}`;
  const date = new Date(blog.publishedAt || blog.createdAt);
  const displayDate = `${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${date.getDate()}, ${date.getFullYear().toString().slice(-2)}`;

  return (
      <Container className="py-4 px-0 sm:px-8">
        <div className="flex items-center justify-between mb-4 relative">
          <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-neutral-100 via-neutral-700 to-transparent"></div>
          <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-neutral-100 via-neutral-700 to-transparent"></div>
          <Paragraph className="text-2xl md:text-3xl font-bold mb-2">Blog</Paragraph>
          <Link href="/blog" className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors">
            (view all)
          </Link>
        </div>

        <BlogLink href={blogUrl} articleTitle={blog.title} className="group block py-10">
          <div className="flex items-center justify-between py-4 border-b border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="flex items-center flex-1 min-w-0">
              <Paragraph className="text-sm sm:text-md lg:text-[18px] font-extralight text-neutral-400 group-hover:text-neutral-300 transition-colors truncate pr-4">
                {blog.title}
              </Paragraph>
              <div className="hidden md:flex flex-1 mx-4 border-b border-dotted border-neutral-800" />
            </div>
            <time className="text-sm md:text-base text-neutral-500 whitespace-nowrap">
              {displayDate}
            </time>
          </div>
        </BlogLink>
      </Container>
  );
}