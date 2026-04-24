"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MenuItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white dark:bg-white/5 dark:border-white/10 shadow-sm">
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-20 mt-2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <div className="p-4 pt-2">
        <div className="flex gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}