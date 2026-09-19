export function PropertySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
      <div className="bg-slate-200 h-48 rounded-xl w-full" />
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-8 bg-slate-200 rounded-xl w-full pt-2" />
    </div>
  );
}