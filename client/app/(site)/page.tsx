"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import Home from "@/app/Home/Landing/Home"
import { useAuth } from "@/app/features/auth"
import { AUTH } from "@/app/lib/constants/auth"

export default function Page() {
  const router = useRouter()
  const { isAuthenticated, isInitializing } = useAuth()

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace(AUTH.DASHBOARD_PATH)
    }
  }, [isAuthenticated, isInitializing, router])

  if (isInitializing || isAuthenticated) {
    return null
  }

  return <Home />
}
