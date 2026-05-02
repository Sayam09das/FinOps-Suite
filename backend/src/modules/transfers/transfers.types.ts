export interface Transfer {
  id: string
  userId: string
  fromAccountId: string
  toAccountId: string
  fromAccountName?: string
  toAccountName?: string
  amount: number
  currency: string
  fee: number
  status: "pending" | "completed" | "failed"
  notes?: string
  date: string
  createdAt: string
  completedAt?: string
}

export interface CreateTransferDTO {
  fromAccountId: string
  toAccountId: string
  amount: number
  currency?: string
  fee?: number
  notes?: string
  date?: string
}

export interface UpdateTransferDTO {
  status?: "pending" | "completed" | "failed"
  notes?: string
}

export interface TransfersResponse {
  transfers: Transfer[]
  totalTransfers: number
  totalAmount: number
}
