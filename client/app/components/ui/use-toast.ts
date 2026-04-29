"use client"

import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000
const PROMISE_DURATION = 2000

type ActionType = "ADD_TOAST" | "DISMISS_TOAST" | "REMOVE_TOAST"

interface Action {
  type: ActionType
  toast?: Toast
  toastId?: string
}

interface State {
  toasts: Toast[]
}

export interface Toast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant: "default" | "destructive" | "loading" | "success"
  duration?: number
  action?: ToastAction
  className?: string
  promiseState?: "loading" | "success" | "error"
}

export interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" | "loading" | "success"
  duration?: number
  action?: ToastAction
}

interface PromiseOptions {
  loading: string
  success: (data: any) => string
  error: string
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

const dispatch = (action: Action) => {
  memoryState = updater(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

const updater = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      if (!action.toast) return state
      const toastId = (Math.random() * 1_000_000).toString()
      const newToast = { ...action.toast, id: toastId }
      
      if (newToast.duration) {
        const timeoutId = setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", toastId: toastId })
        }, newToast.duration)
        toastTimeouts.set(toastId, timeoutId)
      }
      
      return {
        ...state,
        toasts: [...state.toasts, newToast]
      }
      
    case "DISMISS_TOAST":
      toastTimeouts.forEach((timeout, id) => {
        if (id === action.toastId) {
          clearTimeout(timeout)
          toastTimeouts.delete(id)
        }
      })
      
      return {
        ...state,
        toasts: state.toasts.map(t => 
          t.id === action.toastId ? { ...t, open: false } : t
        )
      }
      
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId)
      }
      
    default:
      return state
  }
}

function toast(options: ToastOptions) {
  const toastMsg = {
    ...options,
    variant: (options.variant || "default") as Toast["variant"]
  } as Toast
  
  dispatch({ type: "ADD_TOAST", toast: toastMsg })
  
  return {
    id: toastMsg.id,
    dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: toastMsg.id })
  }
}

function toastPromise<T>(promiseFn: () => Promise<T>, options: PromiseOptions) {
  const promiseToastId = (Math.random() * 1_000_000).toString()
  
  // Show loading
  const loadingToast = {
    title: "Sonner",
    description: options.loading,
    variant: "loading" as const,
    duration: 0, // Don't auto-dismiss loading
  } as Toast
  
  dispatch({ type: "ADD_TOAST", toast: { ...loadingToast, id: promiseToastId } })
  
  // Run promise and update
  promiseFn()
    .then((data) => {
      // Dismiss loading
      dispatch({ type: "REMOVE_TOAST", toastId: promiseToastId })
      
      // Show success
      const successToast = {
        title: "Success",
        description: options.success(data),
        variant: "success" as const,
        duration: PROMISE_DURATION,
      } as Toast
      
      const successId = (Math.random() * 1_000_000).toString()
      dispatch({ type: "ADD_TOAST", toast: { ...successToast, id: successId } })
    })
    .catch((error) => {
      // Dismiss loading
      dispatch({ type: "REMOVE_TOAST", toastId: promiseToastId })
      
      // Optionally show error (user wants no red, so silent or custom)
      // For now, show brief neutral
      const errorToast = {
        title: "Notice",
        description: options.error,
        variant: "default" as const,
        duration: PROMISE_DURATION,
      } as Toast
      
      const errorId = (Math.random() * 1_000_000).toString()
      dispatch({ type: "ADD_TOAST", toast: { ...errorToast, id: errorId } })
    })
  
  return {
    id: promiseToastId,
    dismiss: () => dispatch({ type: "REMOVE_TOAST", toastId: promiseToastId })
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    toastPromise,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId })
  }
}

export { useToast, toast, toastPromise }
type ToastVariant = "default" | "destructive" | "loading" | "success"
