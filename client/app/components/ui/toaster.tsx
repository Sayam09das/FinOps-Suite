import * as React from "react"

import { useToast } from "./use-toast"
import { cn } from "@/app/lib/utils/cn"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000
const DEFAULT_DURATION = 3000

interface Toast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastAction
  variant: "default" | "destructive" | "loading" | "success"
  className?: string
  promiseState?: "loading" | "success" | "error"
}

interface ToastAction {
  label: string
  onClick: () => void
}

function Toaster() {
  const { toasts, dismiss: dismissToast } = useToast()

  React.useEffect(() => {
    if (toasts.length > TOAST_LIMIT) {
      const delayToast = toasts[TOAST_LIMIT]
      if (delayToast) {
        const timeout = setTimeout(() => {
          dismissToast(delayToast.id)
        }, TOAST_REMOVE_DELAY)
        return () => clearTimeout(timeout)
      }
    }
  }, [toasts, dismissToast])

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 space-y-3 max-w-md mx-4 sm:mx-0">
      {toasts.map(({ 
        id, 
        title, 
        description, 
        action, 
        variant = "default" as const,
        className,
        promiseState
      }) => (
        <Toast 
          key={id}
          id={id}
          variant={variant} 
          className={cn(className)}
          title={title}
          description={description}
          action={action}
          promiseState={promiseState}
        />
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
  promiseState?: "loading" | "success" | "error"
}

function Toast({ id, className, variant, title, description, action, promiseState }: ToastProps) {
  const { dismiss } = useToast()

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dismiss(id)
    }, DEFAULT_DURATION)

    return () => {
      clearTimeout(timer)
    }
  }, [id, dismiss])

  const variantStyles = {
    default: "bg-background border text-foreground shadow-lg",
    destructive: "destructive border-destructive bg-destructive text-destructive-foreground shadow",
    loading: "border-blue-300 bg-blue-50/50 text-blue-900 shadow-lg animate-pulse border-2",
    success: "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-lg border-2"
  }

  return (
    <div 
      className={cn(
        "group pointer-events-auto flex w-full items-center rounded-lg border p-4 pr-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=enter]:animate-in data-[swipe=leave]:animate-out duration-300 ease-in-out",
        variantStyles[variant || "default"],
        className
      )}
    >
      <div className="w-full flex items-center gap-3">
        {variant === "loading" && (
          <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
        )}
        {variant === "success" && (
          <div className="w-5 h-5 bg-emerald-500 rounded-full" />
        )}
        <div>
          {title && (
            <div className="font-medium mb-1">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
      </div>
      {action && (
        <button 
          className="ml-4 h-8 w-8 rounded-md border p-0 hover:bg-accent hover:text-accent-foreground"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
      <button 
        className="absolute right-2 top-2 h-6 w-8 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-all"
        onClick={() => dismiss(id)}
      >
        ✕
      </button>
    </div>
  )
}

export { Toaster }
