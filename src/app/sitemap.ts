import type { MetadataRoute } from 'next'
import { products } from '@/constants/products'

const BASE_URL = 'https://www.indrabuildswebsites.com'

// Fetch ALL published blogs (no pagination limit)
async function getAllBlogs() {
  try {
    // Fetch with a very high limit to get all blogs
    // Alternatively, you could fetch in batches if you have 1000+ blogs
    const response = await fetch(
      `${BASE_URL}/api/get-all-blogs?isPublished=true&limit=100`,
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    )
    
    if (!response.ok) {
      console.error('Failed to fetch blogs for sitemap')
      return []
    }
    
    const data = await response.json()
    return data.blogs || []
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
    return []
  }
}

// Fetch all active categories
async function getAllCategories() {
  try {
    const response = await fetch(
      `${BASE_URL}/api/get-all-blog-category?activeOnly=true`,
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    )
    
    if (!response.ok) {
      console.error('Failed to fetch categories for sitemap')
      return []
    }
    
    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content
  const blogs = await getAllBlogs()
  const categories = await getAllCategories()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Project pages (from constants)
  const projectPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/projects/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Blog category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${BASE_URL}/blog/${category.slug}`,
    lastModified: new Date(category.updatedAt || category.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Individual blog post pages - THIS IS THE KEY FIX
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
    url: `${BASE_URL}/blog/${blog.categoryId.slug}/${blog.slug}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Combine all pages
  return [...staticPages, ...projectPages, ...categoryPages, ...blogPages]
}