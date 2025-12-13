import { Container } from '@/components/Container';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CategoryLoading() {
  return (
    <Container className="max-w-7xl">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Category Header Skeleton */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-full bg-neutral-600" />
          <Skeleton className="h-10 w-64 bg-neutral-600" />
        </div>
        <Skeleton className="h-6 w-full max-w-2xl mb-2 bg-neutral-600" />
        <Skeleton className="h-6 w-full max-w-xl bg-neutral-600" />
        <div className="mt-4">
          <Skeleton className="h-6 w-24 rounded-full bg-neutral-600" />
        </div>
      </div>

      {/* Blogs Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-full overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <Skeleton className="w-full h-56 bg-neutral-600" />

            <CardHeader>
              {/* Title Skeleton */}
              <Skeleton className="h-6 w-full mb-2 bg-neutral-600" />
              <Skeleton className="h-6 w-3/4 mb-4 bg-neutral-600" />
              
              {/* Description Skeleton */}
              <Skeleton className="h-4 w-full mb-2 bg-neutral-600" />
              <Skeleton className="h-4 w-full mb-2 bg-neutral-600" />
              <Skeleton className="h-4 w-2/3 bg-neutral-600" />
            </CardHeader>

            <CardContent>
              {/* Meta Info Skeleton */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Skeleton className="h-4 w-24 bg-neutral-600" />
                <Skeleton className="h-4 w-20 bg-neutral-600" />
                <Skeleton className="h-4 w-20 bg-neutral-600" />
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full bg-neutral-600" />
                <Skeleton className="h-6 w-20 rounded-full bg-neutral-600" />
                <Skeleton className="h-6 w-14 rounded-full bg-neutral-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}