"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { Toaster } from "@/app/components/ui/toaster"
import { AuthProvider } from "@/app/features/auth"

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
        <AuthProvider>
          <div className="h-full">
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

