"use client";

function PulseBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[1.5rem] bg-white/55 ${className}`} />;
}

export default function OverviewSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <div className="space-y-3">
        <PulseBlock className="h-5 w-32" />
        <PulseBlock className="h-10 w-full max-w-lg" />
        <PulseBlock className="h-4 w-full max-w-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[1.8rem] border border-border/75 bg-background/70 p-5 shadow-[0_18px_45px_rgba(33,49,43,0.06)]">
            <PulseBlock className="mb-6 h-10 w-10 rounded-2xl" />
            <PulseBlock className="h-4 w-24" />
            <PulseBlock className="mt-3 h-9 w-32" />
            <PulseBlock className="mt-4 h-4 w-28" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <div className="rounded-[1.9rem] border border-border/75 bg-background/70 p-5 shadow-[0_18px_45px_rgba(33,49,43,0.06)]">
          <PulseBlock className="h-5 w-48" />
          <PulseBlock className="mt-3 h-4 w-72" />
          <PulseBlock className="mt-6 h-[320px] w-full rounded-[1.6rem]" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[1.9rem] border border-border/75 bg-background/70 p-5 shadow-[0_18px_45px_rgba(33,49,43,0.06)]">
              <PulseBlock className="h-4 w-28" />
              <PulseBlock className="mt-4 h-8 w-full" />
              <PulseBlock className="mt-3 h-4 w-40" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.9rem] border border-border/75 bg-background/70 p-5 shadow-[0_18px_45px_rgba(33,49,43,0.06)]">
        <PulseBlock className="h-5 w-44" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PulseBlock key={index} className="h-14 w-full rounded-[1.2rem]" />
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[1.9rem] border border-border/75 bg-background/70 p-5 shadow-[0_18px_45px_rgba(33,49,43,0.06)]">
            <PulseBlock className="h-5 w-40" />
            <PulseBlock className="mt-3 h-4 w-60" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((__, innerIndex) => (
                <PulseBlock key={innerIndex} className="h-12 w-full rounded-[1.2rem]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
