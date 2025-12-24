// Helper functions for craft video operations

// Helper to calculate video duration (if needed in future)
export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Helper to sanitize and validate slug uniqueness
export function sanitizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .trim()
        .replace(/[^\w-]/g, '') // Only allow alphanumeric and hyphens
        .replace(/\s+/g, '-')    // Replace spaces with hyphens
        .replace(/-+/g, '-')     // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper to validate and format tags
export function formatTags(tags: string[]): string[] {
    return tags
        .map(tag => tag.toLowerCase().trim())
        .filter(tag => tag.length > 0)
        .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates
}

// Helper to extract file extension
export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
}

// Helper to generate unique filename
export function generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const extension = getFileExtension(originalName);
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const sanitized = nameWithoutExt.replace(/[^\w-]/g, '-');
    return `${sanitized}-${timestamp}.${extension}`;
}