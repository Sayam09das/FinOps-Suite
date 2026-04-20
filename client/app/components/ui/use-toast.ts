"use client"

import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

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
  variant: "default" | "destructive"
  duration?: number
  action?: ToastAction
  className?: string
}

export interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
  action?: ToastAction
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
          dispatch({ type: "DISMISS_TOAST", toastId })
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
    variant: options.variant || "default" as ToastVariant
  } as Toast
  
  dispatch({ type: "ADD_TOAST", toast: toastMsg })
  
  return {
    id: toastMsg.id,
    dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: toastMsg.id })
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
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId })
  }
}

export { useToast, toast }
type ToastVariant = "default" | "destructive"
