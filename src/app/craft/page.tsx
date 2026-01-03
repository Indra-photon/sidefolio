'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Loader2, Play } from 'lucide-react';
import { getOptimizedVideoUrl } from '@/lib/imagekit';
import Masonry from 'react-masonry-css'
import { Container } from '@/components/Container';
import { Heading } from '@/components/Heading';

// Helper function for clustered pattern
const getCardSize = (index: number): 'large' | 'small' => {
  // Pattern: positions 0,1 = large, 2,3,4,5 = small, 6,7 = large...
  // Creates clustered pairs: [LL][SSSS][LL][SSSS]...
  return (index % 6 === 0 || index % 6 === 1) ? 'large' : 'small';
};

// Video Card Component
const VideoCard = ({ video, index }: { video: any; index: number }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(index < 6);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const cardSize = getCardSize(index);

  // Get optimized video URL based on card size and screen
  const getVideoUrl = () => {
    if (typeof window === 'undefined') return '';
    
    const width = window.innerWidth;
    let videoWidth: number;

    if (width < 768) {
      videoWidth = 400;
    } else if (width < 1024) {
      videoWidth = cardSize === 'large' ? 800 : 400;
    } else {
      videoWidth = cardSize === 'large' ? 1200 : 600;
    }

    console.log('Video data:', { 
      videoLink: video.videoLink, 
      videoWidth, 
      cardSize 
    }); // ADD THIS LOG

    return getOptimizedVideoUrl(video.videoLink, videoWidth, 80);
};

  const [videoUrl, setVideoUrl] = useState(getVideoUrl());

  // Update video URL on window resize
  useEffect(() => {
    const handleResize = () => setVideoUrl(getVideoUrl());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [video.videoLink, cardSize]);

  // Lazy load video source when near viewport
  useEffect(() => {
    if (shouldLoadVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
        }
      },
      { rootMargin: '500px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  // Autoplay when 50% visible
  useEffect(() => {
    if (!videoRef.current || !shouldLoadVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          videoRef.current?.play()
            .then(() => setIsPlaying(true))
            .catch((err) => console.error('Autoplay failed:', err));
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  return (
    <Link
      ref={cardRef}
      href={`/craft/${video.slug}`}
      className={`
        relative overflow-hidden rounded-lg group cursor-pointer
        transition-transform duration-300 hover:scale-[1.02]
        ${cardSize === 'large'
          ? 'col-span-1 row-span-1 md:col-span-2 md:row-span-2'
          : 'col-span-1 row-span-1'
        }
      `}
    >
      {/* Loading Skeleton */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Video */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          src={videoUrl}
          preload={index < 6 ? 'metadata' : 'none'}
          muted
          loop
          playsInline
          className={`
            w-full h-full object-cover transition-opacity duration-500
            ${videoLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoadedMetadata={() => setVideoLoaded(true)}
        />
      )}

      {/* Gradient Overlay */}

      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /> */}

      {/* Content */}

      {/* <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
        <h3 className={`font-semibold mb-2 line-clamp-2 ${
          cardSize === 'large' ? 'text-xl md:text-2xl' : 'text-lg'
        }`}>
          {video.videoTitle}
        </h3>
        <p className="text-white/80 text-sm mb-2">
          {new Date(video.creationDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        {video.tags && video.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {video.tags.slice(0, cardSize === 'large' ? 4 : 3).map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div> */}

      {/* Hover Overlay */}
      {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-white text-center">
          <Play className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2" />
          <p className="text-sm md:text-base font-medium">View Details</p>
        </div>
      </div> */}
    </Link>
  );
};

// Main Craft Page Component
export default function CraftPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    fetchVideos(true);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchVideos(false);
        }
      },
      { rootMargin: '200px' }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page]);

  const fetchVideos = async (isInitial: boolean) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const skip = page * 12;
      const res = await fetch(
        `/api/craft/get-all-craft-videos?isPublished=true&limit=12&skip=${skip}&sortBy=displayOrder&sortOrder=asc`
      );
      const data = await res.json();

      if (data.success) {
        setVideos(prev => isInitial ? data.videos : [...prev, ...data.videos]);
        setHasMore(data.pagination.hasMore);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <Container className="max-w-7xl mx-auto">
      <span className="text-4xl">💬</span>
      <Heading className="">My design works..</Heading>
       <p className="text-lg text-gray-200 dark:text-gray-400 pb-10">
          A showcase of design experiments, motion graphics, and thoughtful designs for websites...
      </p>

      {/* Grid Container */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          // Initial Loading Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`
                  bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse
                  ${getCardSize(i) === 'large'
                    ? 'col-span-1 row-span-1 md:col-span-2 md:row-span-2'
                    : 'col-span-1 row-span-1'
                  }
                `}
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No videos yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new craft videos
            </p>
          </div>
        ) : (
          // Video Grid
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[130px]">
          //   {videos.map((video, index) => (
          //     <VideoCard key={video._id} video={video} index={index} />
          //   ))}
          // </div>
          // Video Grid - MASONRY
          <Masonry
            breakpointCols={{
              default: 4,
              1536: 3,
              1024: 2,
              640: 1
            }}
            className="masonry-grid"
            columnClassName="masonry-column"
          >
            {videos.map((video, index) => (
              <VideoCard key={video._id} video={video} index={index} />
            ))}
          </Masonry>
          )}

        {/* Infinite Scroll Sentinel */}
        {hasMore && !loading && (
          <div ref={sentinelRef} className="h-20 flex items-center justify-center mt-8">
            {loadingMore && (
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            )}
          </div>
        )}

        {/* End Message */}
        {!hasMore && videos.length > 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            You've reached the end
          </div>
        )}
      </div>
    </Container>
  );
}