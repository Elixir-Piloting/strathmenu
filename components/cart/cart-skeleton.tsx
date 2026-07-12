import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      ))}
    </div>
  );
}
