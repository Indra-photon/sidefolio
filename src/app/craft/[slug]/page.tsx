"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Calendar, Eye, ExternalLink, FileText } from "lucide-react";
import { Heading } from "@/components/Heading";
import { getOptimizedVideoUrl } from "@/lib/imagekit";

export default function CraftVideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    fetchVideo();
  }, [slug]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/craft/get-one-craft-video/${slug}`);
      const data = await res.json();

      if (data.success) {
        setVideo(data.video);
      } else {
        router.push('/craft');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      router.push('/craft');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!video) return null;

  const videoUrl = getOptimizedVideoUrl(video.videoLink, 1200, 85);

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      {/* Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={video.slug}
        className="relative"
      >
        {!videoLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse flex items-center justify-center z-10">
            <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
          </div>
        )}
        
        <video
          src={videoUrl}
          controls
          className={`
            rounded-md w-full h-auto transition-opacity duration-500
            ${videoLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          poster={video.thumbnail || undefined}
          onLoadedMetadata={() => setVideoLoaded(true)}
        />
        
        <div className="absolute bottom-0 bg-gradient-to-t from-white dark:from-gray-900 h-40 w-full [mask-image:linear-gradient(to_bottom,transparent,white)]" />
      </motion.div>

      {/* Title and Tags */}
      <div className="flex lg:flex-row justify-between items-start lg:items-center flex-col mt-20">
        <Heading className="font-black mb-2 pb-1">{video.videoTitle}</Heading>
        <div className="flex space-x-2 md:mb-1 mt-2 md:mt-0 flex-wrap gap-2">
          {video.tags && video.tags.length > 0 && video.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs md:text-xs lg:text-xs bg-gray-400 dark:bg-gray-700 px-2 py-1 rounded-sm text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(video.creationDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{video.views} views</span>
        </div>
      </div>

      {/* Design Details */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Design Details
        </h2>
        <div
          className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: video.designDetails }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-10">
        {video.productionLink && (
          <Link
            href={video.productionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group/button rounded-full hover:scale-105 focus:outline-none transition ring-offset-gray-900 bg-gray-800 text-white shadow-lg shadow-black/20 sm:backdrop-blur-sm group-hover/button:bg-gray-700 focus-visible:ring-1 focus-visible:ring-offset-2 ring-gray-50/60 text-sm font-medium px-4 py-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Production
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-3.5 h-3.5 group-hover/button:translate-x-0.5 transition-transform"
            >
              <path d="M5 12l14 0"></path>
              <path d="M13 18l6 -6"></path>
              <path d="M13 6l6 6"></path>
            </svg>
          </Link>
        )}

        {video.blogLink && (
          <Link
            href={video.blogLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group/button rounded-full hover:scale-105 focus:outline-none transition ring-offset-gray-900 bg-gray-600 text-white shadow-lg shadow-black/20 sm:backdrop-blur-sm group-hover/button:bg-gray-500 focus-visible:ring-1 focus-visible:ring-offset-2 ring-gray-50/60 text-sm font-medium px-4 py-2"
          >
            <FileText className="w-4 h-4" />
            Read Blog Post
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-3.5 h-3.5 group-hover/button:translate-x-0.5 transition-transform"
            >
              <path d="M5 12l14 0"></path>
              <path d="M13 18l6 -6"></path>
              <path d="M13 6l6 6"></path>
            </svg>
          </Link>
        )}

        <Link
          href="/craft"
          className="inline-flex items-center gap-2 group/button rounded-full hover:scale-105 focus:outline-none transition ring-offset-gray-900 border-2 border-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-300 shadow-lg shadow-black/20 sm:backdrop-blur-sm group-hover/button:bg-gray-100 dark:group-hover/button:bg-gray-800 focus-visible:ring-1 focus-visible:ring-offset-2 ring-gray-50/60 text-sm font-medium px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-3.5 h-3.5 group-hover/button:-translate-x-0.5 transition-transform"
          >
            <path d="M19 12l-14 0"></path>
            <path d="M11 18l-6 -6"></path>
            <path d="M11 6l-6 6"></path>
          </svg>
          Back to Gallery
        </Link>
      </div>
    </div>
  );
}

// Generate static paths for all published videos
// export async function generateStaticParams() {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_SITE_URL}/api/craft/get-all-craft-videos?isPublished=true&limit=100`
//     );
//     const data = await res.json();

//     if (!data.success) return [];

//     return data.videos.map((video: any) => ({
//       slug: video.slug,
//     }));
//   } catch (error) {
//     console.error('Error generating static params for craft videos:', error);
//     return [];
//   }
// }

// Generate metadata
// export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;
  
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_SITE_URL}/api/craft/get-one-craft-video/${slug}`
//     );
//     const data = await res.json();

//     if (data.success) {
//       return {
//         title: `${data.video.videoTitle} | Craft`,
//         description: data.video.designDetails.substring(0, 160),
//       };
//     }
//   } catch (error) {
//     console.error('Error generating metadata:', error);
//   }

//   return {
//     title: 'Craft Video',
//   };
// }