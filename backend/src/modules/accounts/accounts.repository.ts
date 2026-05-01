import prisma from "../../config/db";
import { AppError } from "../../common/errors";
import { ErrorCodes } from "../../common/errors/errorCodes";
import type { CreateAccountDTO, UpdateAccountDTO } from "./accounts.types";
import type { Account } from "./accounts.types";

/**
 * Repository for Account database operations
 */
export const accountsRepository = {
  /**
   * Get all accounts for a user
   */
  async findAllByUserId(userId: string): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return accounts.map(this.mapToAccount);
  },

  /**
   * Get account by ID
   */
  async findById(id: string, userId: string): Promise<Account | null> {
    const account = await prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      return null;
    }

    return this.mapToAccount(account);
  },

  /**
   * Get accounts by type
   */
  async findByType(userId: string, type: string): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      where: { userId, type },
      orderBy: { name: "asc" },
    });

    return accounts.map(this.mapToAccount);
  },

  /**
   * Get accounts by type (banks only)
   */
  async findBanksByUserId(userId: string): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      where: { userId, type: "bank" },
      orderBy: { name: "asc" },
    });

    return accounts.map(this.mapToAccount);
  },

  /**
   * Get wallets by user ID
   */
  async findWalletsByUserId(userId: string): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      where: { userId, type: "wallet" },
      orderBy: { name: "asc" },
    });

    return accounts.map(this.mapToAccount);
  },

  /**
   * Get credit cards by user ID
   */
  async findCreditCardsByUserId(userId: string): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      where: { userId, type: "credit_card" },
      orderBy: { name: "asc" },
    });

    return accounts.map(this.mapToAccount);
  },

/**
   * Get total balance for user (all accounts)
   */
  async getTotalBalance(userId: string): Promise<number> {
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
    });

    // Total = sum of all positive balances minus credit card balances (debt)
    return accounts.reduce((total, acc) => {
      // For credit cards, balance represents used amount (negative effect)
      if (acc.type === "credit_card") {
        return total - acc.balance;
      }
      return total + acc.balance;
    }, 0);
  },

  /**
   * Get total balance by type
   */
  async getBalanceByType(userId: string): Promise<Record<string, number>> {
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
    });

    const byType: Record<string, number> = {};
    for (const acc of accounts) {
      if (!byType[acc.type]) {
        byType[acc.type] = 0;
      }
      byType[acc.type] += acc.balance;
    }

    return byType;
  },

  /**
   * Create a new account
   */
  async create(userId: string, data: CreateAccountDTO): Promise<Account> {
    const account = await prisma.account.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        balance: data.balance ?? 0,
        currency: data.currency ?? "INR",
        institution: data.institution,
        accountNumber: data.accountNumber,
        isActive: true,
      },
    });

    return this.mapToAccount(account);
  },

  /**
   * Update an account
   */
  async update(id: string, userId: string, data: UpdateAccountDTO): Promise<Account> {
    // Check if account exists and belongs to user
    const existing = await prisma.account.findFirst({
      where: { id, userId },
    });

if (!existing) {
      throw new AppError(
        "NOT_FOUND",
        404,
        "Account not found"
      );
    }

    const account = await prisma.account.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        balance: data.balance,
        currency: data.currency,
        institution: data.institution,
        accountNumber: data.accountNumber,
        isActive: data.isActive,
        updatedAt: new Date(),
      },
    });

    return this.mapToAccount(account);
  },

  /**
   * Delete an account
   */
  async delete(id: string, userId: string): Promise<void> {
    const existing = await prisma.account.findFirst({
      where: { id, userId },
    });

if (!existing) {
      throw new AppError(
        "NOT_FOUND",
        404,
        "Account not found"
      );
    }

    await prisma.account.delete({
      where: { id },
    });
  },

  /**
   * Update account balance (for transactions)
   */
  async updateBalance(
    id: string,
    userId: string,
    amount: number,
    operation: "add" | "subtract"
  ): Promise<Account> {
    const existing = await prisma.account.findFirst({
      where: { id, userId },
    });

if (!existing) {
      throw new AppError(
        "NOT_FOUND",
        404,
        "Account not found"
      );
    }

    const newBalance =
      operation === "add"
        ? existing.balance + amount
        : existing.balance - amount;

    const account = await prisma.account.update({
      where: { id },
      data: {
        balance: newBalance,
        updatedAt: new Date(),
      },
    });

    return this.mapToAccount(account);
  },

  /**
   * Map Prisma Account to API Account
   */
  mapToAccount(account: {
    id: string;
    userId: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    institution: string | null;
    accountNumber: string | null;
    isActive: boolean;
    asOfDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Account {
    return {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type as Account["type"],
      balance: account.balance,
      currency: account.currency,
      institution: account.institution ?? undefined,
      accountNumber: account.accountNumber ?? undefined,
      isActive: account.isActive,
      asOfDate: account.asOfDate.toISOString(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  },
};

export default accountsRepository;
