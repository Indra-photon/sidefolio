// Client-safe ImageKit URL helpers. No SDK import — safe to use in client components.

// Helper function to generate optimized video URL with transformations
export function getOptimizedVideoUrl(
    path: string,
    width: number,
    quality: number = 80
): string {
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    
    // If path is already a full ImageKit URL, extract just the file path
    let videoPath = path;
    if (path.includes('ik.imagekit.io')) {
        const url = new URL(path);
        videoPath = url.pathname; // e.g., /gbhnwxsyw/blog-videos/file.mp4
        
        // Remove the account ID from the path (first segment)
        const pathParts = videoPath.split('/').filter(Boolean); // ['gbhnwxsyw', 'blog-videos', 'file.mp4']
        pathParts.shift(); // Remove first part (account ID)
        videoPath = '/' + pathParts.join('/'); // '/blog-videos/file.mp4'
    }
    
    // Ensure videoPath starts with /
    if (!videoPath.startsWith('/')) {
        videoPath = '/' + videoPath;
    }
    
    // Build transformation string
    const transformations = `tr:w-${width},q-${quality},f-auto`;
    
    // Construct full URL
    return `${urlEndpoint}/${transformations}${videoPath}`;
}
