function Bone({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Bone key={i} className="h-24" />)}
      </div>
      <Bone className="h-12" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Bone className="h-64" />
        <Bone className="h-64" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="space-y-2">
      <Bone className="h-10" />
      {[...Array(rows)].map((_, i) => <Bone key={i} className="h-12" />)}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => <Bone key={i} className="h-32" />)}
    </div>
  );
}
