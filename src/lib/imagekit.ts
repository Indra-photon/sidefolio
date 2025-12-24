import ImageKit from 'imagekit';

// const imagekit = new ImageKit({
//     publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
//     urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string
// });

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string || 'dummy-key-for-client',
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string
});

export default imagekit;

// Helper function to upload images or videos
export async function uploadImage(
    file: Buffer | string,
    fileName: string,
    folder: string = 'blog-images',
    tags?: string[],
    fileType: 'image' | 'video' = 'image' // NEW: Specify if uploading image or video
): Promise<{ url: string; fileId: string; filePath: string }> {
    try {
        const response = await imagekit.upload({
            file: file,
            fileName: fileName,
            folder: fileType === 'video' ? 'blog-videos' : folder, // NEW: Videos go to separate folder
            useUniqueFileName: true,
            tags: tags || []
        });

        return {
            url: response.url,
            fileId: response.fileId,
            filePath: response.filePath
        };
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw new Error('Failed to upload file');
    }
}

// Helper function to generate optimized image URL with transformations
export function getOptimizedImageUrl(
    path: string,
    transformations?: {
        height?: number;
        width?: number;
        quality?: number;
        format?: string;
        crop?: string;
        focus?: string;
    }
): string {
    const transformation = [];
    
    if (transformations) {
        if (transformations.height) transformation.push({ height: transformations.height.toString() });
        if (transformations.width) transformation.push({ width: transformations.width.toString() });
        if (transformations.quality) transformation.push({ quality: transformations.quality.toString() });
        if (transformations.format) transformation.push({ format: transformations.format });
        if (transformations.crop) transformation.push({ crop: transformations.crop });
        if (transformations.focus) transformation.push({ focus: transformations.focus });
    }

    return imagekit.url({
        path: path,
        transformation: transformation.length > 0 ? transformation : undefined
    });
}

// Helper function to delete image
export async function deleteImage(fileId: string): Promise<void> {
    try {
        await imagekit.deleteFile(fileId);
    } catch (error) {
        console.error('ImageKit delete error:', error);
        throw new Error('Failed to delete image');
    }
}

// Helper to get authentication parameters for client-side upload
export function getAuthenticationParameters() {
    return imagekit.getAuthenticationParameters();
}

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
    const finalUrl = `${urlEndpoint}/${transformations}${videoPath}`;
    
    console.log('Video URL generated:', finalUrl);
    
    return finalUrl;
}