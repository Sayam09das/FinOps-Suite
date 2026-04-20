"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { Toaster } from "@/app/components/ui/toaster"
// import { AuthProvider } from "@/providers/auth-provider" // future

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <QueryProvider>
        <div className="h-full">
          {children}
          <Toaster />
        </div>
      </QueryProvider>
    </ThemeProvider>
  )
}

