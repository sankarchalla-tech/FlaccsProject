export default function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="h-8 w-16 rounded bg-slate-300" />
        </div>

        <div className="h-12 w-12 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}