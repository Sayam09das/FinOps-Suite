export interface SocketNotification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  data?: any
  timestamp: string
}

export interface SocketBudgetUpdate {
  id: string
  name: string
  currentAmount: number
  threshold: number
  updatedAt: string
}

export interface SocketTransaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

export type SocketData<T = any> = {
  event: string
  data: T
  timestamp: string
}

