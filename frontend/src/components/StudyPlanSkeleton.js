'use client';

export default function StudyPlanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="bg-surfaceContainerLow border border-outlineVariant/10 rounded-2xl p-6 flex flex-col shadow-xl">
          {/* Header Skeleton */}
          <div className="border-b border-outlineVariant/10 pb-4 mb-6">
            <div className="h-8 w-32 animate-shimmer rounded-lg mb-3"></div>
            <div className="h-3 w-20 animate-shimmer rounded-full"></div>
          </div>
          
          {/* Tasks Skeleton */}
          <div className="flex-1 space-y-5">
            {[...Array(3)].map((_, tIdx) => (
              <div key={tIdx} className="bg-surfaceContainerHighest/40 rounded-xl p-4 border border-outlineVariant/5">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-4 w-16 animate-shimmer rounded"></div>
                  <div className="h-4 w-12 animate-shimmer rounded-full"></div>
                </div>
                <div className="h-4 w-full animate-shimmer rounded mb-2"></div>
                <div className="h-4 w-2/3 animate-shimmer rounded mb-4"></div>
                <div className="h-3 w-20 animate-shimmer rounded"></div>
              </div>
            ))}
          </div>

          {/* Footer Skeleton */}
          <div className="mt-8 pt-4 border-t border-outlineVariant/10 flex items-center justify-between opacity-60">
             <div className="h-2 w-16 animate-shimmer rounded"></div>
             <div className="h-2 w-12 animate-shimmer rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
