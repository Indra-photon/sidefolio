'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<'html' | 'mdx'>('html');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    contentType: 'html' as 'html' | 'mdx',
    categoryId: '',
    author: 'Indranil Maiti',
    tags: '',
    isPublished: false,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterCreator: '@your_twitter'
  });

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/get-all-blog-category?activeOnly=true');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!editorRef.current) {
  //     alert('Editor not initialized');
  //     return;
  //   }

  //   const content = editorRef.current.getContent();
    
  //   if (!thumbnailFile) {
  //     alert('Please upload a thumbnail');
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const formDataToSend = new FormData();
      
  //     // Append all form fields
  //     Object.entries(formData).forEach(([key, value]) => {
  //       formDataToSend.append(key, value.toString());
  //     });
      
  //     formDataToSend.append('content', content);
  //     formDataToSend.append('thumbnail', thumbnailFile);

  //     const res = await fetch('/api/upload-blog', {
  //       method: 'POST',
  //       body: formDataToSend
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       alert('Blog created successfully!');
  //       router.push('/admin-panel/blogs');
  //     } else {
  //       alert(data.message || 'Failed to create blog');
  //     }
  //   } catch (error) {
  //     console.error('Error creating blog:', error);
  //     alert('An error occurred while creating the blog');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Get content based on contentType
  let content = '';
  if (contentType === 'html') {
    if (!editorRef.current) {
      alert('Editor not initialized');
      return;
    }
    content = editorRef.current.getContent();
  } else {
    // For MDX, content is already in formData
    content = formData.content;
  }
  
  if (!content || content.trim() === '') {
    alert('Please add some content');
    return;
  }
  
  if (!thumbnailFile) {
    alert('Please upload a thumbnail');
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();
    
    // Append all form fields (this includes contentType automatically)
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value.toString());
    });
    
    // Override content with the correct content (from editor or textarea)
    formDataToSend.set('content', content);
    formDataToSend.append('thumbnail', thumbnailFile);

    const res = await fetch('/api/upload-blog', {
      method: 'POST',
      body: formDataToSend
    });

    const data = await res.json();

    if (data.success) {
      alert('Blog created successfully!');
      router.push('/admin-panel/blogs');
    } else {
      alert(data.message || 'Failed to create blog');
    }
  } catch (error) {
    console.error('Error creating blog:', error);
    alert('An error occurred while creating the blog');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
        <p className="text-gray-500 mt-2">Write and publish your blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about your blog post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
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
                placeholder="enter-blog-slug"
                required
              />
              <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title</p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your blog"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="categoryId">Category *</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author name"
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
                placeholder="react, nextjs, javascript (comma separated)"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">Thumbnail Image *</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                required
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleSwitchChange('isPublished', checked)}
                />
                <Label htmlFor="isPublished">Publish immediately</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured">Featured post</Label>
              </div>
            </div>
          </CardContent>

        </Card>

        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Write your blog content with rich formatting and code snippets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="contentType">Content Type *</Label>
              <Select 
                value={contentType} 
                onValueChange={(value: 'html' | 'mdx') => {
                  setContentType(value);
                  setFormData(prev => ({ ...prev, contentType: value }));
                }}
              >
                <SelectTrigger id="contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">
                    <div className="flex flex-col">
                      <span className="font-medium">Rich Text Editor (TinyMCE)</span>
                      <span className="text-xs text-gray-500">For standard blog posts</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="mdx">
                    <div className="flex flex-col">
                      <span className="font-medium">MDX Editor (Interactive)</span>
                      <span className="text-xs text-gray-500">For interactive demos and components</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                {contentType === 'html' 
                  ? '📝 Use the visual editor for standard blog posts with images and formatting'
                  : '⚡ Use MDX for interactive demos, live code examples, and custom components'
                }
              </p>
            </div>
            {contentType === 'html' ? (
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'codesample', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | image media link | codesample code | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                images_upload_url: '/api/imagekit-auth',
                automatic_uploads: true,
                // file_picker_types: 'image',
                file_picker_types: 'file',
                file_picker_callback: (callback, value, meta) => {
                // Create file input
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                
                // Set accepted file types based on what's being inserted
                if (meta.filetype === 'image') {
                  input.setAttribute('accept', 'image/*');
                } else if (meta.filetype === 'media') {
                  input.setAttribute('accept', 'video/mp4,image/gif');
                } else {
                  input.setAttribute('accept', 'image/*,video/mp4,image/gif');
                }

                // Handle file selection
                input.onchange = async function() {
                  const file = (this as HTMLInputElement).files?.[0];
                  if (!file) return;

                  // Determine if it's a video/gif or image
                  const isVideo = file.type === 'video/mp4' || file.type === 'image/gif';
                  
                  // Upload to appropriate endpoint
                  const uploadUrl = isVideo ? '/api/upload-video' : '/api/imagekit-auth';
                  
                  try {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch(uploadUrl, {
                      method: 'POST',
                      body: formData
                    });

                    const data = await response.json();

                    if (data.success || data.location) {
                      // Return the URL to TinyMCE
                      callback(data.location || data.url, { 
                        alt: file.name,
                        title: file.name 
                      });
                    } else {
                      alert(data.message || 'Upload failed');
                    }
                  } catch (error) {
                    console.error('Upload error:', error);
                    alert('Failed to upload file');
                  }
                };

                // Trigger file selection
                input.click();
              },
                codesample_languages: [
                  { text: 'JavaScript', value: 'javascript' },
                  { text: 'TypeScript', value: 'typescript' },
                  { text: 'HTML/XML', value: 'markup' },
                  { text: 'CSS', value: 'css' },
                  { text: 'Python', value: 'python' },
                  { text: 'Java', value: 'java' },
                  { text: 'C#', value: 'csharp' },
                  { text: 'PHP', value: 'php' },
                  { text: 'Ruby', value: 'ruby' },
                  { text: 'Go', value: 'go' },
                ]
              }}
            />
            ) : (
              <div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full h-[500px] p-4 font-mono text-sm border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="# Your MDX content here

                  Write in markdown with React components!

                  Example:
                  ## Interactive Color Picker
                  <ColorPicker initialColor='#3b82f6' />

                  ## Regular Content
                  You can mix regular markdown with interactive components."
                      />
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 className="font-semibold text-blue-900 mb-2">📚 Available Interactive Components (Coming Soon):</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800 font-mono">
                          <span>&lt;ColorPicker /&gt;</span>
                          <span>&lt;MarginDemo /&gt;</span>
                          <span>&lt;PaddingVisualizer /&gt;</span>
                          <span>&lt;FlexboxPlayground /&gt;</span>
                          <span>&lt;GridGenerator /&gt;</span>
                          <span>&lt;CSSAnimator /&gt;</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>Optimize your blog for search engines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                placeholder="Leave empty to use blog title"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                placeholder="SEO-friendly description (160 characters)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleInputChange}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                name="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={handleInputChange}
                placeholder="https://yoursite.com/blog/slug (optional)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Configure Open Graph and Twitter card settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ogTitle">Open Graph Title</Label>
              <Input
                id="ogTitle"
                name="ogTitle"
                value={formData.ogTitle}
                onChange={handleInputChange}
                placeholder="Leave empty to use blog title"
              />
            </div>

            <div>
              <Label htmlFor="ogDescription">Open Graph Description</Label>
              <Textarea
                id="ogDescription"
                name="ogDescription"
                value={formData.ogDescription}
                onChange={handleInputChange}
                placeholder="Description for social media shares"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="twitterTitle">Twitter Title</Label>
              <Input
                id="twitterTitle"
                name="twitterTitle"
                value={formData.twitterTitle}
                onChange={handleInputChange}
                placeholder="Leave empty to use blog title"
              />
            </div>

            <div>
              <Label htmlFor="twitterDescription">Twitter Description</Label>
              <Textarea
                id="twitterDescription"
                name="twitterDescription"
                value={formData.twitterDescription}
                onChange={handleInputChange}
                placeholder="Description for Twitter card"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="twitterCreator">Twitter Creator</Label>
              <Input
                id="twitterCreator"
                name="twitterCreator"
                value={formData.twitterCreator}
                onChange={handleInputChange}
                placeholder="@your_twitter"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin-panel')}
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
              'Create Blog'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}