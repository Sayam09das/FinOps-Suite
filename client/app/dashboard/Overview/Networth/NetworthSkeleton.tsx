"use client"

import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function NetworthSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      {/* Hero Card Skeleton */}
      <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl">
        <Skeleton height={36} width={280} className="rounded-xl" />
        <Skeleton height={20} width={180} className="mt-2 rounded-lg" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <Skeleton height={28} width={140} className="rounded-lg" />
            <Skeleton height={16} width={80} className="mt-2 rounded-md" />
          </div>
          <div>
            <Skeleton height={28} width={140} className="rounded-lg" />
            <Skeleton height={16} width={80} className="mt-2 rounded-md" />
          </div>
        </div>
        <Skeleton height={200} className="mt-6 rounded-2xl" />
      </div>

      {/* Two Column Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl">
          <Skeleton height={28} width={160} className="rounded-lg" />
          <Skeleton height={16} width={120} className="mt-2 rounded-md" />
          <div className="mt-4 space-y-3">
            <Skeleton height={48} className="rounded-xl" />
            <Skeleton height={48} className="rounded-xl" />
            <Skeleton height={48} className="rounded-xl" />
          </div>
        </div>
        <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl">
          <Skeleton height={28} width={160} className="rounded-lg" />
          <Skeleton height={16} width={120} className="mt-2 rounded-md" />
          <div className="mt-4 space-y-3">
            <Skeleton height={48} className="rounded-xl" />
            <Skeleton height={48} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl">
          <Skeleton height={28} width={200} className="rounded-lg" />
          <Skeleton height={240} className="mt-4 rounded-2xl" />
        </div>
        <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl">
          <Skeleton height={28} width={200} className="rounded-lg" />
          <Skeleton height={240} className="mt-4 rounded-2xl" />
        </div>
      </div>

      {/* Insights Skeleton */}
      <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-6 backdrop-blur-xl">
        <Skeleton height={28} width={180} className="rounded-lg" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={100} className="rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

