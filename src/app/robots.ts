import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin-panel/', '/keystatic/'],
    },
    sitemap: 'https://www.indrabuildswebsites.com/sitemap.xml',
    host: 'https://www.indrabuildswebsites.com',
  }
}