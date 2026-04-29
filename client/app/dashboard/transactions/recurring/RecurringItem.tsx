"use client"

export interface RecurringTransaction {
  id: string
  name: string
  amount: number
  category: string
  frequency: string
  nextDate: string
  status: "active" | "paused"
  type: "income" | "expense"
}

export default function RecurringItem() {
  return null
}
