export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square bg-muted rounded-lg"></div>

      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-3/4"></div>

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-5 w-5 bg-muted rounded-full"></div>
          ))}
          <div className="h-5 bg-muted rounded w-24 ml-2"></div>
        </div>

        <div className="h-10 bg-muted rounded w-1/3"></div>

        <div className="space-y-4">
          <div>
            <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full mt-1"></div>
            <div className="h-4 bg-muted rounded w-2/3 mt-1"></div>
          </div>

          <div>
            <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded-full w-20"></div>
              ))}
            </div>
          </div>

          <div className="h-12 bg-muted rounded w-full mt-6"></div>

          <div className="border-t pt-6 mt-8 space-y-4">
            <div className="flex gap-3">
              <div className="h-5 w-5 bg-muted rounded-full flex-shrink-0"></div>
              <div className="space-y-1 flex-1">
                <div className="h-5 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-5 w-5 bg-muted rounded-full flex-shrink-0"></div>
              <div className="space-y-1 flex-1">
                <div className="h-5 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
