export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        Loading FinOps Suite
      </div>
    </div>
  );
}
