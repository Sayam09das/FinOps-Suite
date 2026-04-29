import * as React from "react"

import { useToast } from "./use-toast"
import { cn } from "@/app/lib/utils/cn"

const TOAST_LIMIT = 5
const DEFAULT_DURATION = 3000

interface Toast {
  id: string
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
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" | "loading" | "success"
  action?: ToastAction
  className?: string
}

function Toast({
  id,
  className,
  variant = "default",
  title,
  description,
  action
}: ToastProps) {
  const { dismiss } = useToast()

  // ✅ auto dismiss
  React.useEffect(() => {
    const timer = setTimeout(() => {
      dismiss(id)
    }, DEFAULT_DURATION)

    return () => clearTimeout(timer)
  }, [id, dismiss])

  const variantStyles = {
    default: "bg-background border text-foreground",
    destructive: "bg-red-50 border-red-300 text-red-900",
    loading: "bg-blue-50 border-blue-300 text-blue-900",
    success: "bg-emerald-50 border-emerald-300 text-emerald-900"
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border p-4 shadow-md transition-all",
        variantStyles[variant],
        className
      )}
    >
      {/* ✅ Icons */}
      {variant === "loading" && (
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      )}
      {variant === "success" && (
        <div className="w-5 h-5 bg-emerald-500 rounded-full" />
      )}

      {/* ✅ Content */}
      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && (
          <div className="text-sm opacity-80">{description}</div>
        )}
      </div>

      {/* ✅ Action */}
      {action && (
        <button
          className="ml-2 text-sm px-2 py-1 rounded-md border hover:bg-accent"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}

      {/* ✅ Close */}
      <button
        className="absolute top-2 right-2 text-sm opacity-60 hover:opacity-100"
        onClick={() => dismiss(id)}
      >
        ✕
      </button>
    </div>
  )
}

export { Toaster }