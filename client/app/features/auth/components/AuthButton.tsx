"use client"

import { Button } from '@/app/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '../hooks/use-auth'
import { cn } from '@/app/lib/utils/cn'

interface AuthButtonProps {
  variant?: 'login' | 'logout'
}

export function AuthButton({ variant = 'login' }: AuthButtonProps) {
  const { user, logout, isLoading } = useAuth()

  if (variant === 'login') {
    return (
      <Button variant="outline" size="sm">
        Sign in
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={logout} disabled={isLoading} className="flex items-center gap-2">
      {user ? user.name : 'User'}
      <LogOut className="h-4 w-4" />
    </Button>
  )
}

