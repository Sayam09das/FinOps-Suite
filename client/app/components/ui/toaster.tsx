import * as React from "react"

import { useToast } from "./use-toast"
import { cn } from "@/app/lib/utils/cn"

const TOAST_LIMIT = 5
const DEFAULT_DURATION = 3000

interface Toast {
  id: string
  duration?: number
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastAction
  variant?: "default" | "destructive" | "loading" | "success"
  className?: string
}

interface ToastAction {
  label: string
  onClick: () => void
}

function Toaster() {
  const { toasts } = useToast()

  // ✅ limit number of toasts (simple + instant)
  const visibleToasts = toasts.slice(0, TOAST_LIMIT)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-[350px] max-w-[90vw]">
      {visibleToasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

interface ToastProps {
  id: string
  duration?: number
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" | "loading" | "success"
  action?: ToastAction
  className?: string
}

function Toast({
  id,
  duration,
  className,
  variant = "default",
  title,
  description,
  action
}: ToastProps) {
  const { dismiss } = useToast()

  React.useEffect(() => {
    if (duration === 0 || variant === "loading") {
      return
    }

    const timer = setTimeout(() => {
      dismiss(id)
    }, duration ?? DEFAULT_DURATION)

    return () => clearTimeout(timer)
  }, [dismiss, duration, id, variant])

  const variantStyles = {
    default: "bg-background border text-foreground",
    destructive: "bg-destructive text-destructive-foreground border-destructive",
    loading: "bg-background border text-foreground",
    success: "bg-background border text-foreground"
  }

  return (
    <div
      className={cn(
        "group relative pointer-events-auto flex w-full items-start rounded-md border bg-background p-4 text-foreground shadow transition-all",
        variant === "destructive" &&
        "border-destructive bg-destructive text-destructive-foreground",
        className
      )}
    >
      <div className="flex-1 space-y-1">
        {title && <div className="text-sm font-medium">{title}</div>}
        {description && (
          <div className="text-sm opacity-80">{description}</div>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="ml-4 text-sm font-medium underline"
        >
          {action.label}
        </button>
      )}

      <button
        onClick={() => dismiss(id)}
        className="absolute right-2 top-2 text-sm opacity-60 transition-opacity hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}

export { Toaster }
