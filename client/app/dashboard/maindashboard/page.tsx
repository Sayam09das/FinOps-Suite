"use client"

import React from 'react'
import { useAuth } from '@/app/features/auth'
import { useDashboard } from '@/app/features/dashboard'
import { OverviewCard } from '@/app/features/dashboard/components/OverviewCard'

export default function Page() {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading || !isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">Loading dashboard...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to Dashboard, {user?.name}!</h1>
      <p>Your secure financial operations workspace.</p>
      {/* Future dashboard content */}
    </div>
  )
}
