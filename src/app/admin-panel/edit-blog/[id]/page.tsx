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
import { useRouter, useParams } from 'next/navigation';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const editorRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    categoryId: '',
    author: '',
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
    twitterCreator: ''
  });

  useEffect(() => {
    fetchBlogData();
    fetchCategories();
  }, []);

  const fetchBlogData = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/get-one-blog/[id]`);
      const data = await res.json();
      
      if (data.success) {
        const blog = data.blog;
        setFormData({
          title: blog.title,
          slug: blog.slug,
          description: blog.description,
          content: blog.content,
          categoryId: blog.categoryId._id,
          author: blog.author,
          tags: blog.tags.join(', '),
          isPublished: blog.isPublished,
          isFeatured: blog.isFeatured,
          metaTitle: blog.seo.metaTitle,
          metaDescription: blog.seo.metaDescription,
          metaKeywords: blog.seo.metaKeywords.join(', '),
          canonicalUrl: blog.seo.canonicalUrl || '',
          ogTitle: blog.seo.openGraph.title,
          ogDescription: blog.seo.openGraph.description,
          twitterTitle: blog.seo.twitter.title,
          twitterDescription: blog.seo.twitter.description,
          twitterCreator: blog.seo.twitter.creator
        });
        setCurrentThumbnail(blog.thumbnail);
      } else {
        alert('Blog not found');
        router.push('/admin-panel/blogs');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Failed to load blog data');
    } finally {
      setFetching(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editorRef.current) {
      alert('Editor not initialized');
      return;
    }

    const content = editorRef.current.getContent();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('blogId', blogId);
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'content') {
          formDataToSend.append(key, value.toString());
        }
      });
      
      formDataToSend.append('content', content);
      
      // Only append thumbnail if new one is selected
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      const res = await fetch('/api/update-blog', {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await res.json();

      if (data.success) {
        alert('Blog updated successfully!');
        router.push('/admin-panel/blogs');
      } else {
        alert(data.message || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('An error occurred while updating the blog');
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
        <p className="text-gray-500 mt-2">Update your blog post</p>
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
              <Label htmlFor="thumbnail">Thumbnail Image</Label>
              {currentThumbnail && (
                <div className="mb-2">
                  <img 
                    src={currentThumbnail} 
                    alt="Current thumbnail" 
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current thumbnail (upload new to replace)</p>
                </div>
              )}
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleSwitchChange('isPublished', checked)}
                />
                <Label htmlFor="isPublished">Published</Label>
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
            <Editor
              apiKey="your-tinymce-api-key"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={formData.content}
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
                file_picker_types: 'image',
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
            onClick={() => router.push('/admin-panel/blogs')}
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
              'Update Blog'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}