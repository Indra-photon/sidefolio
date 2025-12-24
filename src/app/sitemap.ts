// // import type { MetadataRoute } from 'next'
// // import { products } from '@/constants/products'

// // const BASE_URL = 'https://www.indrabuildswebsites.com'

// // // Fetch ALL published blogs (no pagination limit)
// // async function getAllBlogs() {
// //   try {
// //     // Fetch with a very high limit to get all blogs
// //     // Alternatively, you could fetch in batches if you have 1000+ blogs
// //     const response = await fetch(
// //       `${BASE_URL}/api/get-all-blogs?isPublished=true&limit=100`,
// //       { 
// //         cache: 'no-store',
// //         next: { revalidate: 0 }
// //       }
// //     )
    
// //     if (!response.ok) {
// //       console.error('Failed to fetch blogs for sitemap')
// //       return []
// //     }
    
// //     const data = await response.json()
// //     return data.blogs || []
// //   } catch (error) {
// //     console.error('Error fetching blogs for sitemap:', error)
// //     return []
// //   }
// // }

// // // Fetch all active categories
// // async function getAllCategories() {
// //   try {
// //     const response = await fetch(
// //       `${BASE_URL}/api/get-all-blog-category?activeOnly=true`,
// //       { 
// //         cache: 'no-store',
// //         next: { revalidate: 0 }
// //       }
// //     )
    
// //     if (!response.ok) {
// //       console.error('Failed to fetch categories for sitemap')
// //       return []
// //     }
    
// //     const data = await response.json()
// //     return data.categories || []
// //   } catch (error) {
// //     console.error('Error fetching categories for sitemap:', error)
// //     return []
// //   }
// // }

// // export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
// //   // Fetch dynamic content
// //   const blogs = await getAllBlogs()
// //   const categories = await getAllCategories()

// //   // Static pages
// //   const staticPages: MetadataRoute.Sitemap = [
// //     {
// //       url: BASE_URL,
// //       lastModified: new Date(),
// //       changeFrequency: 'weekly',
// //       priority: 1.0,
// //     },
// //     {
// //       url: `${BASE_URL}/about`,
// //       lastModified: new Date(),
// //       changeFrequency: 'monthly',
// //       priority: 0.8,
// //     },
// //     {
// //       url: `${BASE_URL}/projects`,
// //       lastModified: new Date(),
// //       changeFrequency: 'weekly',
// //       priority: 0.9,
// //     },
// //     {
// //       url: `${BASE_URL}/resume`,
// //       lastModified: new Date(),
// //       changeFrequency: 'monthly',
// //       priority: 0.8,
// //     },
// //     {
// //       url: `${BASE_URL}/blog`,
// //       lastModified: new Date(),
// //       changeFrequency: 'weekly',
// //       priority: 0.9,
// //     },
// //   ]

// //   // Project pages (from constants)
// //   const projectPages: MetadataRoute.Sitemap = products.map((product) => ({
// //     url: `${BASE_URL}/projects/${product.slug}`,
// //     lastModified: new Date(),
// //     changeFrequency: 'monthly',
// //     priority: 0.7,
// //   }))

// //   // Blog category pages
// //   const categoryPages: MetadataRoute.Sitemap = categories.map((category: any) => ({
// //     url: `${BASE_URL}/blog/${category.slug}`,
// //     lastModified: new Date(category.updatedAt || category.createdAt),
// //     changeFrequency: 'weekly',
// //     priority: 0.8,
// //   }))

// //   // Individual blog post pages - THIS IS THE KEY FIX
// //   const blogPages: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
// //     url: `${BASE_URL}/blog/${blog.categoryId.slug}/${blog.slug}`,
// //     lastModified: new Date(blog.updatedAt),
// //     changeFrequency: 'weekly',
// //     priority: 0.7,
// //   }))

// //   // Combine all pages
// //   return [...staticPages, ...projectPages, ...categoryPages, ...blogPages]
// // }


// import fs from "fs";
// import { MetadataRoute } from "next";
// import path from "path";
// import { products } from '@/constants/products'
// import { buildApiUrl } from '@/lib/getBaseUrl';

// const baseUrl = "https://www.indrabuildswebsites.com";
// const baseDir = "src/app";
// const excludeDirs = ["api", "admin-panel", "fonts"]; // Exclude these from sitemap

// export const revalidate = 60; // Revalidate every 60 seconds (you can change to 3600 for 1 hour)

// // Fetch all published blogs from your API
// async function getBlogs() {
//   try {
//     const response = await fetch(
//       `${baseUrl}/api/get-all-blogs?isPublished=true&limit=1000`,
//       { 
//         cache: 'no-store',
//       }
//     );
    
//     if (!response.ok) {
//       console.error('Failed to fetch blogs for sitemap:', response.status);
//       return [];
//     }
    
//     const data = await response.json();
//     console.log(`✅ Fetched ${data.blogs?.length || 0} blogs for sitemap`);
//     return data.blogs || [];
//   } catch (error) {
//     console.error('Error fetching blogs for sitemap:', error);
//     return [];
//   }
// }

// // Fetch all active categories
// async function getCategories() {
//   try {
//     const response = await fetch(
//       `${baseUrl}/api/get-all-blog-category?activeOnly=true`,
//       { 
//         cache: 'no-store',
//       }
//     );
    
//     if (!response.ok) {
//       console.error('Failed to fetch categories for sitemap:', response.status);
//       return [];
//     }
    
//     const data = await response.json();
//     console.log(`✅ Fetched ${data.categories?.length || 0} categories for sitemap`);
//     return data.categories || [];
//   } catch (error) {
//     console.error('Error fetching categories for sitemap:', error);
//     return [];
//   }
// }

// async function getRoutes(): Promise<MetadataRoute.Sitemap> {
//   let routes: MetadataRoute.Sitemap = [];

//   // 1. STATIC PAGES - Auto-discovered from file system
//   const fullPath = path.join(process.cwd(), baseDir);
//   const entries = fs.readdirSync(fullPath, { withFileTypes: true });

//   // Add homepage
//   routes.push({
//     url: baseUrl,
//     lastModified: new Date(),
//     changeFrequency: "weekly",
//     priority: 1.0,
//   });

//   // Add other static pages (about, projects, resume, blog)
//   entries.forEach((entry) => {
//     if (entry.isDirectory() && !excludeDirs.includes(entry.name) && !entry.name.startsWith('[')) {
//       routes.push({
//         url: `${baseUrl}/${entry.name}`,
//         lastModified: new Date(),
//         changeFrequency: entry.name === 'blog' || entry.name === 'projects' ? "weekly" : "monthly",
//         priority: entry.name === 'blog' || entry.name === 'projects' ? 0.9 : 0.8,
//       });
//     }
//   });

//   // 2. PROJECT PAGES - From constants/products.tsx
//   const projectRoutes: MetadataRoute.Sitemap = products.map((product) => ({
//     url: `${baseUrl}/projects/${product.slug}`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.7,
//   }));

//   // 3. BLOG CATEGORY PAGES - From API
//   const categories = await getCategories();
//   const categoryRoutes: MetadataRoute.Sitemap = categories.map((category: any) => ({
//     url: `${baseUrl}/blog/${category.slug}`,
//     lastModified: new Date(category.updatedAt || category.createdAt),
//     changeFrequency: "weekly",
//     priority: 0.8,
//   }));

//   // 4. BLOG POST PAGES - From API
//   const blogs = await getBlogs();
//   const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
//     url: `${baseUrl}/blog/${blog.categoryId.slug}/${blog.slug}`,
//     lastModified: new Date(blog.updatedAt),
//     changeFrequency: "weekly",
//     priority: 0.7,
//   }));

//   // Combine all routes
//   routes = [...routes, ...projectRoutes, ...categoryRoutes, ...blogRoutes];

//   console.log(`✅ Total sitemap URLs: ${routes.length}`);
//   console.log(`   - Static pages: ${entries.length + 1}`);
//   console.log(`   - Projects: ${projectRoutes.length}`);
//   console.log(`   - Categories: ${categoryRoutes.length}`);
//   console.log(`   - Blog posts: ${blogRoutes.length}`);

//   return routes;
// }

// export default function sitemap() {
//   return getRoutes();
// }


import fs from "fs";
import { MetadataRoute } from "next";
import path from "path";
import { products } from '@/constants/products'
import dbConnect from '@/lib/dbConnect';
import BlogCategoryModel from '@/app/api/models/BlogCategory';
import BlogModel from '@/app/api/models/Blog';
import CraftVideoModel from '@/app/api/models/CraftVideo';

const baseUrl = "https://www.indrabuildswebsites.com";
const baseDir = "src/app";
const excludeDirs = ["api", "admin-panel", "fonts"];

export const revalidate = 3600; // Revalidate every hour

// Direct database access for build time
async function getBlogs() {
  try {
    await dbConnect();
    const blogs = await BlogModel.find({ isPublished: true })
      .populate('categoryId', 'slug')
      .select('slug categoryId updatedAt')
      .limit(1000)
      .lean();
    
    console.log(`✅ Fetched ${blogs.length} blogs for sitemap (direct DB)`);
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  }
}

async function getCategories() {
  try {
    await dbConnect();
    const categories = await BlogCategoryModel.find({ isActive: true })
      .select('slug updatedAt createdAt')
      .lean();
    
    console.log(`✅ Fetched ${categories.length} categories for sitemap (direct DB)`);
    return categories;
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

async function getRoutes(): Promise<MetadataRoute.Sitemap> {
  let routes: MetadataRoute.Sitemap = [];

  // 1. STATIC PAGES
  const fullPath = path.join(process.cwd(), baseDir);
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  routes.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  entries.forEach((entry) => {
    if (entry.isDirectory() && !excludeDirs.includes(entry.name) && !entry.name.startsWith('[')) {
      routes.push({
        url: `${baseUrl}/${entry.name}`,
        lastModified: new Date(),
        changeFrequency: entry.name === 'blog' || entry.name === 'projects' ? "weekly" : "monthly",
        priority: entry.name === 'blog' || entry.name === 'projects' ? 0.9 : 0.8,
      });
    }
  });

  // 2. PROJECT PAGES
  const projectRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/projects/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 3. BLOG CATEGORY PAGES
  const categories = await getCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/blog/${category.slug}`,
    lastModified: new Date(category.updatedAt || category.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 4. BLOG POST PAGES
  const blogs = await getBlogs();
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/${blog.categoryId.slug}/${blog.slug}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  async function getCraftVideos() {
  try {
    await dbConnect();
    const videos = await CraftVideoModel.find({ isPublished: true })
      .select('slug updatedAt')
      .limit(1000)
      .lean();
    
    console.log(`✅ Fetched ${videos.length} craft videos for sitemap (direct DB)`);
    return videos;
  } catch (error) {
    console.error('Error fetching craft videos for sitemap:', error);
    return [];
  }
}

// 5. CRAFT VIDEO PAGES
const craftVideos = await getCraftVideos();
const craftRoutes: MetadataRoute.Sitemap = craftVideos.map((video: any) => ({
  url: `${baseUrl}/craft/${video.slug}`,
  lastModified: new Date(video.updatedAt),
  changeFrequency: "monthly",
  priority: 0.7,
}));

// Add craft index page
routes.push({
  url: `${baseUrl}/craft`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.9,
});

  routes = [...routes, ...projectRoutes, ...categoryRoutes, ...blogRoutes, ...craftRoutes];

  console.log(`✅ Total sitemap URLs: ${routes.length}`);
  console.log(`   - Static pages: ${entries.length + 1}`);
  console.log(`   - Projects: ${projectRoutes.length}`);
  console.log(`   - Categories: ${categoryRoutes.length}`);
  console.log(`   - Blog posts: ${blogRoutes.length}`);
  console.log(`   - Craft videos: ${craftRoutes.length}`);

  return routes;
}

export default function sitemap() {
  return getRoutes();
}