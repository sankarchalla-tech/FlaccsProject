interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({
  rows = 8,
  columns = 6,
}: TableSkeletonProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div
          className="grid gap-4 p-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className={`h-4 rounded bg-slate-100 animate-pulse ${
                columns % 3 === 0 ? "w-3/4" : columns % 2 === 0 ? "w-full" : "w-1/2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div>
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="grid gap-4 border-b border-slate-100 p-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, col) => (
              <div
                key={col}
                className="h-4 rounded bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
