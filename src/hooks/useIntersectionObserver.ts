import { useEffect, useRef, useState, useCallback } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  initialInView?: boolean;
  skip?: boolean;
}

interface IntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement>;
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  once = false,
  initialInView = false,
  skip = false,
}: IntersectionObserverOptions = {}): IntersectionObserverReturn {
  const [inView, setInView] = useState(initialInView);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const hasTriggered = useRef(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setEntry(entry);

      if (entry.isIntersecting) {
        setInView(true);
        hasTriggered.current = true;

        // If once is true, disconnect the observer
        if (once && observerRef.current) {
          observerRef.current.disconnect();
        }
      } else if (!once || !hasTriggered.current) {
        setInView(false);
      }
    },
    [once]
  );

  useEffect(() => {
    const element = ref.current;
    
    // Skip if disabled or no element
    if (skip || !element) {
      return;
    }

    // Skip if once is true and already triggered
    if (once && hasTriggered.current) {
      return;
    }

    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, root, rootMargin, threshold, skip, once]);

  // Reset function for manual control
  const reset = useCallback(() => {
    hasTriggered.current = false;
    setInView(initialInView);
    setEntry(undefined);

    const element = ref.current;
    if (element && !skip) {
      observerRef.current?.observe(element);
    }
  }, [initialInView, skip]);

  return {
    ref,
    inView,
    entry,
  };
}

// Specialized hook for lazy loading
export function useLazyLoading(options: Omit<IntersectionObserverOptions, 'once'> = {}) {
  return useIntersectionObserver({
    ...options,
    once: true,
    rootMargin: options.rootMargin || '50px',
  });
}

// Specialized hook for scroll animations
export function useScrollAnimation(options: IntersectionObserverOptions = {}) {
  return useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-10% 0px',
    ...options,
  });
}

// Specialized hook for progressive content loading
export function useProgressiveReveal(options: IntersectionObserverOptions = {}) {
  return useIntersectionObserver({
    threshold: 0.25,
    rootMargin: '0px',
    once: true,
    ...options,
  });
}