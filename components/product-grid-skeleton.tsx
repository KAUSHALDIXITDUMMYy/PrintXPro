export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 pb-3">
          <div className="w-full aspect-square bg-[#f4f0f0] rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[#f4f0f0] rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-[#f4f0f0] rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}