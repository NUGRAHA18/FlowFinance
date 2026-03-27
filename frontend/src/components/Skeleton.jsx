export function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-4 h-4 w-24 animate-shimmer rounded-lg" />
          <div className="mb-2 h-8 w-40 animate-shimmer rounded-lg" />
          <div className="h-3 w-32 animate-shimmer rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800">
          <div className="h-12 w-12 animate-shimmer rounded-full" />
          <div className="flex-1">
            <div className="mb-2 h-4 w-40 animate-shimmer rounded-lg" />
            <div className="h-3 w-56 animate-shimmer rounded-lg" />
          </div>
          <div className="h-6 w-24 animate-shimmer rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-3 h-3 w-20 animate-shimmer rounded-lg" />
            <div className="mb-2 h-8 w-36 animate-shimmer rounded-lg" />
            <div className="h-3 w-24 animate-shimmer rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">
          <div className="mb-6 h-5 w-40 animate-shimmer rounded-lg" />
          <div className="h-72 animate-shimmer rounded-xl" />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-4 h-5 w-40 animate-shimmer rounded-lg" />
          <div className="h-48 animate-shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
}
