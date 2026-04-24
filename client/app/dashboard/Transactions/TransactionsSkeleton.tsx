"use client"

import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function TransactionsSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton height={36} width={240} className="rounded-xl" />
        <div className="flex gap-2">
          <Skeleton height={40} width={140} className="rounded-xl" />
          <Skeleton height={40} width={120} className="rounded-xl" />
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-5 backdrop-blur-xl">
        <div className="flex flex-wrap gap-3">
          <Skeleton height={36} width={140} className="rounded-full" />
          <Skeleton height={36} width={200} className="rounded-full" />
          <Skeleton height={36} width={140} className="rounded-full" />
          <Skeleton height={36} width={140} className="rounded-full" />
          <Skeleton height={36} width={120} className="rounded-full" />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={80} className="rounded-2xl" />
        ))}
      </div>

      {/* Table */}
      <div className="rounded-[1.95rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-5 backdrop-blur-xl">
        <div className="space-y-3">
          <Skeleton height={40} className="rounded-xl" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={52} className="rounded-xl" />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Skeleton height={36} width={280} className="rounded-full" />
      </div>
    </div>
  )
}

