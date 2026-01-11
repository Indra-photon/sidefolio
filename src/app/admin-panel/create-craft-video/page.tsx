'use client';

import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateCraftVideoPage() {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    videoTitle: '',
    slug: '',
    creationDate: '',
    productionLink: '',
    blogLink: '',
    designDetails: '',
    codeblock: '',
    tags: '',
    isFeatured: false,
    isPublished: false,
    displayOrder: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from title
    if (name === 'videoTitle') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (file.type !== 'video/mp4') {
        toast.error('Only MP4 video files are allowed');
        return;
      }
      
      // Validate file size (12MB)
      const maxSize = 12 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Video file must be under 12MB');
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editorRef.current) {
      toast.error('Editor not initialized');
      return;
    }

    const designDetails = editorRef.current.getContent();

    console.log('Form Data Check:', {
  videoTitle: formData.videoTitle,
  slug: formData.slug,
  creationDate: formData.creationDate,
  designDetails: designDetails,
  codeblock: formData.codeblock,
  videoFile: videoFile?.name,
  hasVideo: !!videoFile
});
    
    if (!designDetails || designDetails.trim() === '') {
      toast.error('Please add design details');
      return;
    }
    
    if (!videoFile) {
      toast.error('Please upload a video file');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'designDetails' && key !== 'codeblock') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Now append the actual content
      formDataToSend.append('designDetails', designDetails);
      formDataToSend.append('codeblock', formData.codeblock);
      formDataToSend.append('video', videoFile);
      
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      const res = await fetch('/api/craft/upload-craft-video', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Craft video created successfully!');
        router.push('/admin-panel/craft-videos');
      } else {
        toast.error(data.message || 'Failed to create craft video');
      }
    } catch (error) {
      console.error('Error creating craft video:', error);
      toast.error('An error occurred while creating the craft video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Craft Video</h1>
        <p className="text-gray-500 mt-2">Upload and showcase your design work</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about your craft video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="videoTitle">Video Title *</Label>
              <Input
                id="videoTitle"
                name="videoTitle"
                value={formData.videoTitle}
                onChange={handleInputChange}
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="enter-video-slug"
                required
              />
              <p className="text-xs text-gray-500 mt-1">URL-friendly version (auto-generated from title)</p>
            </div>

            <div>
              <Label htmlFor="creationDate">Creation Date *</Label>
              <Input
                id="creationDate"
                name="creationDate"
                type="date"
                value={formData.creationDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. animation, ui-design, motion"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated tags</p>
            </div>

            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleInputChange}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
          </CardContent>
        </Card>

        {/* Media Files */}
        <Card>
          <CardHeader>
            <CardTitle>Media Files</CardTitle>
            <CardDescription>Upload your video and optional thumbnail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="video">Video File * (MP4, max 12MB)</Label>
              <Input
                id="video"
                type="file"
                accept="video/mp4"
                onChange={handleVideoChange}
                required
              />
              {videoFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="thumbnail">Thumbnail Image (optional)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {thumbnailFile.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>External Links</CardTitle>
            <CardDescription>Optional links to production or related blog posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="productionLink">Production Link</Label>
              <Input
                id="productionLink"
                name="productionLink"
                type="url"
                value={formData.productionLink}
                onChange={handleInputChange}
                placeholder="https://example.com/project"
              />
            </div>

            <div>
              <Label htmlFor="blogLink">Blog Link</Label>
              <Input
                id="blogLink"
                name="blogLink"
                type="url"
                value={formData.blogLink}
                onChange={handleInputChange}
                placeholder="https://yourblog.com/article"
              />
            </div>
          </CardContent>
        </Card>

        {/* Design Details Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Design Details</CardTitle>
            <CardDescription>Describe your design process, inspiration, and details</CardDescription>
          </CardHeader>
          <CardContent>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'anchor', 'searchreplace', 'visualblocks', 'code',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </CardContent>
        </Card>

        {/* Code Block */}
        <Card>
          <CardHeader>
            <CardTitle>Code Block (Optional)</CardTitle>
            <CardDescription>Add code snippet related to this craft video</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              id="codeblock"
              name="codeblock"
              value={formData.codeblock}
              onChange={(e) => setFormData(prev => ({ ...prev, codeblock: e.target.value }))}
              placeholder="Paste your code here (HTML, CSS, JavaScript, etc.)"
              rows={12}
              className="w-full p-3 border rounded-md font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Publication and display settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured Video</Label>
                <p className="text-xs text-gray-500">Highlight this video on the craft page</p>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublished">Published</Label>
                <p className="text-xs text-gray-500">Make this video visible to the public</p>
              </div>
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin-panel/craft-videos')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Video'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}