import { Skeleton } from "@/components/ui/Skeleton";

export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-sm border border-border bg-card">
      <Skeleton className="h-40 w-full rounded-none sm:h-44" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
