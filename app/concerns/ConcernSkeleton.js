'use client';

export default function ConcernSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
            {/* Header skeleton */}
            <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse duration-1000"></div>
              <div className="absolute top-4 left-4 w-16 h-6 bg-white/20 rounded-full"></div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-20 h-6 bg-white/20 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
              </div>
              
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List view skeleton
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-2xl animate-pulse"></div>
          <div className="flex-1 ml-6 space-y-3">
            <div className="flex justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-3 ml-4">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
