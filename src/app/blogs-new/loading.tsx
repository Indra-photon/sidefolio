import { Skeleton } from "@/components/BlogUI/ui/skeleton";

export default function BlogLoading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-3 w-28" />
      <div className="mt-6 flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="mt-6 h-48 w-full rounded-2xl" />
    </div>
  );
}
