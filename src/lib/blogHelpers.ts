import { deleteImage } from './imagekit';

// Helper to calculate reading time (words per minute: 200)
export function calculateReadingTime(content: string): number {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    
    // Count words
    const words = plainText.trim().split(/\s+/).length;
    
    // Calculate reading time (200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    return readingTime;
}

// Helper to sanitize and validate slug uniqueness
export function sanitizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .trim()
        .replace(/[^\w-]/g, '') // Only allow alphanumeric and hyphens
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}


// Helper to extract first image from content (for thumbnail fallback)
export function extractFirstImage(html: string): string | null {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = html.match(imgRegex);
    return match ? match[1] : null;
}


// Helper to validate and format tags
export function formatTags(tags: string[]): string[] {
    return tags
        .map(tag => tag.toLowerCase().trim())
        .filter(tag => tag.length > 0)
        .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates
}

// NEW: Extract all ImageKit URLs from HTML content
export function extractImageKitUrls(html: string): string[] {
    const regex = /https:\/\/ik\.imagekit\.io\/[^\s"'<>]+/g;
    const matches = html.match(regex);
    
    if (!matches) return [];

    return matches.filter((url, index, self) => self.indexOf(url) === index);
}

// NEW: Find removed URLs by comparing old and new content
export function findRemovedUrls(oldContent: string, newContent: string): string[] {
    const oldUrls = extractImageKitUrls(oldContent);
    const newUrls = extractImageKitUrls(newContent);
    
    return oldUrls.filter(url => !newUrls.includes(url));
}

// NEW: Extract fileId from ImageKit URL
export function extractFileIdFromUrl(url: string): string | null {
    // Example URL: https://ik.imagekit.io/gbhnwxsyw/blog-images/my-image_abc123.jpg
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName || null;
}

// NEW: Cleanup removed files from ImageKit
export async function cleanupRemovedFiles(removedUrls: string[]): Promise<void> {
    for (const url of removedUrls) {
        try {
            const fileId = extractFileIdFromUrl(url);
            if (fileId) {
                await deleteImage(fileId);
            }
        } catch (error) {
            console.error(`Failed to delete file: ${url}`, error);
        }
    }
}