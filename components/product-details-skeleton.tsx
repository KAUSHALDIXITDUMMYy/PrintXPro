export function ProductDetailsSkeleton() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex flex-wrap gap-2 p-4">
              <div className="h-4 bg-[#f4f0f0] rounded w-16"></div>
              <div className="h-4 bg-[#f4f0f0] rounded w-4"></div>
              <div className="h-4 bg-[#f4f0f0] rounded w-32"></div>
            </div>

            {/* Image Skeleton */}
            <div className="flex w-full grow bg-white p-4">
              <div className="w-full aspect-[2/3] bg-[#f4f0f0] rounded-lg"></div>
            </div>

            {/* Title Skeleton */}
            <div className="px-4 pb-3 pt-5">
              <div className="h-7 bg-[#f4f0f0] rounded w-3/4"></div>
            </div>

            {/* Description Skeleton */}
            <div className="px-4 pb-3 pt-1 space-y-2">
              <div className="h-4 bg-[#f4f0f0] rounded w-full"></div>
              <div className="h-4 bg-[#f4f0f0] rounded w-5/6"></div>
              <div className="h-4 bg-[#f4f0f0] rounded w-2/3"></div>
            </div>

            {/* Details Section Skeleton */}
            <div className="px-4 pb-2 pt-4">
              <div className="h-6 bg-[#f4f0f0] rounded w-16"></div>
            </div>
            <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5dcdc] py-5">
                  <div className="h-4 bg-[#f4f0f0] rounded w-16"></div>
                  <div className="h-4 bg-[#f4f0f0] rounded w-32"></div>
                </div>
              ))}
            </div>

            {/* Price Skeleton */}
            <div className="px-4 pb-2 pt-4">
              <div className="h-6 bg-[#f4f0f0] rounded w-16"></div>
            </div>
            <div className="px-4 pb-3 pt-1">
              <div className="h-6 bg-[#f4f0f0] rounded w-20"></div>
            </div>

            {/* Button Skeleton */}
            <div className="px-4 py-3">
              <div className="h-10 bg-[#f4f0f0] rounded-lg w-32"></div>
            </div>

            {/* Additional Info Skeleton */}
            <div className="border-t border-t-[#e5dcdc] mt-8 px-4 py-6 space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="h-5 w-5 bg-[#f4f0f0] rounded mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-[#f4f0f0] rounded w-32"></div>
                    <div className="h-4 bg-[#f4f0f0] rounded w-full"></div>
                    <div className="h-4 bg-[#f4f0f0] rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}