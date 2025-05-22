export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
          <div className="aspect-square bg-muted"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
