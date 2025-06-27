import { useState, useEffect, useRef } from 'react';

interface ProgressiveLoadingConfig {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  fallbackDelay?: number;
}

export function useProgressiveLoading(config: ProgressiveLoadingConfig = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    delay = 0,
    fallbackDelay = 3000,
  } = config;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fallback: load after specified delay even if not visible
    const fallbackTimeout = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
      }
    }, fallbackDelay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay if specified
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(element);
          clearTimeout(fallbackTimeout);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      clearTimeout(fallbackTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, delay, fallbackDelay, isVisible]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const reset = () => {
    setIsVisible(false);
    setIsLoaded(false);
    setHasError(false);
  };

  return {
    ref,
    isVisible,
    isLoaded,
    hasError,
    handleLoad,
    handleError,
    reset,
    // Computed states
    shouldLoad: isVisible,
    isLoading: isVisible && !isLoaded && !hasError,
  };
}