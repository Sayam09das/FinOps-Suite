"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import DashNavbar from "./layout/DashNavbar"
import DashSidebar from "./layout/DashSidebar"
import FloatingAIButton from "./layout/Floatingaibutton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="relative px-3 pb-8 md:px-4 lg:pb-10">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <DashNavbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <DashSidebar />

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

      {/* ✅ Floating AI Button (GLOBAL) */}
      <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-6 sm:right-6">
        <FloatingAIButton />
      </div>
    </div>
  )
}