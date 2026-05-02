import prisma from "../../config/db"
import { AppError } from "../../common/errors"
import type { CreateTransferDTO, UpdateTransferDTO, Transfer } from "./transfers.types"

/**
 * Repository for Transfer database operations
 */
export const transfersRepository = {
  /**
   * Get all transfers for a user
   */
  async findAllByUserId(userId: string): Promise<Transfer[]> {
    const transfers = await prisma.transfer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        fromAccount: { select: { name: true } },
        toAccount: { select: { name: true } },
      },
    })

    return transfers.map(this.mapToTransfer)
  },

  /**
   * Get transfer by ID
   */
  async findById(id: string, userId: string): Promise<Transfer | null> {
    const transfer = await prisma.transfer.findFirst({
      where: { id, userId },
      include: {
        fromAccount: { select: { name: true } },
        toAccount: { select: { name: true } },
      },
    })

    if (!transfer) {
      return null
    }

    return this.mapToTransfer(transfer)
  },

  /**
   * Get recent transfers for a user
   */
  async findRecentByUserId(userId: string, limit = 10): Promise<Transfer[]> {
    const transfers = await prisma.transfer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        fromAccount: { select: { name: true } },
        toAccount: { select: { name: true } },
      },
    })

    return transfers.map(this.mapToTransfer)
  },

  /**
   * Create a new transfer
   */
  async create(userId: string, data: CreateTransferDTO): Promise<Transfer> {
    // Get both accounts to verify they exist and user owns them
    const fromAccount = await prisma.account.findFirst({
      where: { id: data.fromAccountId, userId },
    })
    const toAccount = await prisma.account.findFirst({
      where: { id: data.toAccountId, userId },
    })

    if (!fromAccount || !toAccount) {
      throw new AppError("NOT_FOUND", 404, "Account not found")
    }

    // Check sufficient balance
    const totalDeduction = data.amount + (data.fee || 0)
    if (fromAccount.balance < totalDeduction) {
      throw new AppError("BAD_REQUEST", 400, "Insufficient balance")
    }

    const transfer = await prisma.transfer.create({
      data: {
        userId,
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        amount: data.amount,
        currency: data.currency || "INR",
        fee: data.fee || 0,
        notes: data.notes,
        date: data.date ? new Date(data.date) : new Date(),
        status: "completed",
        completedAt: new Date(),
      },
      include: {
        fromAccount: { select: { name: true } },
        toAccount: { select: { name: true } },
      },
    })

    // Update account balances
    await prisma.account.update({
      where: { id: data.fromAccountId },
      data: {
        balance: fromAccount.balance - totalDeduction,
        updatedAt: new Date(),
      },
    })
    await prisma.account.update({
      where: { id: data.toAccountId },
      data: {
        balance: toAccount.balance + data.amount,
        updatedAt: new Date(),
      },
    })

    return this.mapToTransfer(transfer)
  },

  /**
   * Update a transfer
   */
  async update(id: string, userId: string, data: UpdateTransferDTO): Promise<Transfer> {
    const existing = await prisma.transfer.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError("NOT_FOUND", 404, "Transfer not found")
    }

    const updateData: any = { ...data }
    if (data.status === "completed" && !existing.completedAt) {
      updateData.completedAt = new Date()
    }

    const transfer = await prisma.transfer.update({
      where: { id },
      data: updateData,
      include: {
        fromAccount: { select: { name: true } },
        toAccount: { select: { name: true } },
      },
    })

    return this.mapToTransfer(transfer)
  },

  /**
   * Delete a transfer
   */
  async delete(id: string, userId: string): Promise<void> {
    const existing = await prisma.transfer.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError("NOT_FOUND", 404, "Transfer not found")
    }

    await prisma.transfer.delete({
      where: { id },
    })
  },

  /**
   * Get transfer statistics
   */
  async getTransferStats(userId: string): Promise<{ totalTransfers: number; totalAmount: number }> {
    const transfers = await prisma.transfer.findMany({
      where: { userId, status: "completed" },
    })

    return {
      totalTransfers: transfers.length,
      totalAmount: transfers.reduce((sum, t) => sum + t.amount, 0),
    }
  },

  /**
   * Map Prisma Transfer to API Transfer
   */
  mapToTransfer(transfer: {
    id: string
    userId: string
    fromAccountId: string
    toAccountId: string
    fromAccount?: { name: string }
    toAccount?: { name: string }
    amount: number
    currency: string
    fee: number
    status: string
    notes: string | null
    date: Date
    createdAt: Date
    completedAt: Date | null
  }): Transfer {
    return {
      id: transfer.id,
      userId: transfer.userId,
      fromAccountId: transfer.fromAccountId,
      toAccountId: transfer.toAccountId,
      fromAccountName: transfer.fromAccount?.name,
      toAccountName: transfer.toAccount?.name,
      amount: transfer.amount,
      currency: transfer.currency,
      fee: transfer.fee,
      status: transfer.status as Transfer["status"],
      notes: transfer.notes ?? undefined,
      date: transfer.date.toISOString(),
      createdAt: transfer.createdAt.toISOString(),
      completedAt: transfer.completedAt?.toISOString() ?? undefined,
    }
  },
}

export default transfersRepository
