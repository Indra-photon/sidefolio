'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function EditCraftVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;
  const editorRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [currentThumbnail, setCurrentThumbnail] = useState<string>('');
  
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

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/craft/get-one-craft-video/${videoId}`);
      const data = await res.json();

      if (data.success) {
        const video = data.video;
        setFormData({
          videoTitle: video.videoTitle,
          slug: video.slug,
          creationDate: new Date(video.creationDate).toISOString().split('T')[0],
          productionLink: video.productionLink || '',
          blogLink: video.blogLink || '',
          designDetails: video.designDetails,
          codeblock: video.codeblock || '',
          tags: video.tags.join(', '),
          isFeatured: video.isFeatured,
          isPublished: video.isPublished,
          displayOrder: video.displayOrder
        });
        setCurrentVideoUrl(video.videoLink);
        setCurrentThumbnail(video.thumbnail || '');
      } else {
        toast.error('Failed to fetch video');
        router.push('/admin-panel/craft-videos');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('An error occurred');
      router.push('/admin-panel/craft-videos');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== 'video/mp4') {
        toast.error('Only MP4 video files are allowed');
        return;
      }
      
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
    
    if (!designDetails || designDetails.trim() === '') {
      toast.error('Please add design details');
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
      
      // Override designDetails with editor content
      formDataToSend.set('designDetails', designDetails);
      formDataToSend.append('codeblock', formData.codeblock);
      
      if (videoFile) {
        formDataToSend.append('video', videoFile);
      }
      
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }


      const res = await fetch(`/api/craft/update-craft-video/${videoId}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Craft video updated successfully!');
        router.push('/admin-panel/craft-videos');
      } else {
        toast.error(data.message || 'Failed to update craft video');
      }
    } catch (error) {
      console.error('Error updating craft video:', error);
      toast.error('An error occurred while updating the craft video');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Craft Video</h1>
        <p className="text-gray-500 mt-2">Update your design showcase video</p>
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
              <p className="text-xs text-gray-500 mt-1">URL-friendly version</p>
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
            <CardDescription>Update your video and thumbnail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="video">Current Video</Label>
              {currentVideoUrl && (
                <div className="mt-2">
                  <video 
                    src={currentVideoUrl} 
                    controls 
                    className="w-full max-w-md rounded border"
                  />
                </div>
              )}
              <Label htmlFor="video" className="mt-4 block">Replace Video (MP4, max 12MB)</Label>
              <Input
                id="video"
                type="file"
                accept="video/mp4"
                onChange={handleVideoChange}
              />
              {videoFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ New video: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              {currentThumbnail && (
                <div className="mb-2">
                  <Label>Current Thumbnail</Label>
                  <img 
                    src={currentThumbnail} 
                    alt="Current thumbnail" 
                    className="w-32 h-32 object-cover rounded border mt-2"
                  />
                </div>
              )}
              <Label htmlFor="thumbnail">Replace Thumbnail (optional)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ New thumbnail: {thumbnailFile.name}
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
              initialValue={formData.designDetails}
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
                Updating...
              </>
            ) : (
              'Update Video'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}