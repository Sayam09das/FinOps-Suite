"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import DashNavbar from "./layout/DashNavbar"
import DashSidebar from "./layout/DashSidebar"
import FloatingAIButton from "./layout/Floatingaibutton"
import { cn } from "@/app/lib/utils/cn"
import { useAuth } from "@/app/features/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isInitializing } = useAuth()

  // ✅ mobile drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ✅ desktop collapse state
  const [isCollapsed, setIsCollapsed] = useState(false)

  // close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, isInitializing, router])

  // ✅ single handler (mobile + desktop)
  const handleMenuClick = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches

    if (isDesktop) {
      setIsCollapsed((v) => !v)
    } else {
      setSidebarOpen((v) => !v)
    }
  }

  if (isInitializing || !isAuthenticated) {
    return null
  }

  return (
    <div className="relative px-3 pb-8 md:px-4 lg:pb-10">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">

        {/* Navbar */}
        <DashNavbar
          onMenuClick={handleMenuClick}
          sidebarCollapsed={isCollapsed}
        />

        {/* Layout Grid */}
        <div
          className={cn(
            "grid items-start gap-4 transition-all duration-300",
            isCollapsed
              ? "lg:grid-cols-[90px_minmax(0,1fr)]"
              : "lg:grid-cols-[320px_minmax(0,1fr)]"
          )}
        >
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <DashSidebar collapsed={isCollapsed} />
          </div>

          {/* Main Content */}
          <main className="min-w-0">
            <div className="panel-frost min-h-[calc(100vh-10rem)] overflow-hidden rounded-[2.2rem] border border-border/80">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <DashSidebar
        mobile
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Floating AI Button */}
      <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-6 sm:right-6">
        <FloatingAIButton />
      </div>
    </div>
  )
}
