import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800", className)}
      {...props}
    />
  )
}

export { Skeleton }

export function PageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-64 rounded-[40px]" />
                <Skeleton className="h-64 rounded-[40px]" />
            </div>
            <div className="space-y-6 pt-12">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    )
}
