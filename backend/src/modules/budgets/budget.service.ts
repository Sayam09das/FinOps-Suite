import { createBudget, getBudgetsByUser, getBudgetsByUserAndMonth, getTransactionsByUserAndMonth } from './budget.repository';
import type { Budget, BudgetStatus } from './budget.types';
import type { Transaction } from '../transactions/transaction.types';

// Re-export for controller compatibility
export { createBudget } from './budget.repository';

// 📄 Get Budgets (wrapper)
export const getBudgets = async (userId: string) => {
    return getBudgetsByUser(userId);
};

// 📊 Budget vs Spending
export const checkBudget = async (userId: string, month?: string): Promise<BudgetStatus> => {
    const m = month || new Date().toISOString().slice(0,7);
    const budgets = await getBudgetsByUserAndMonth(userId, m);
    const transactions = await getTransactionsByUserAndMonth(userId, m);

    const result: BudgetStatus = {};

    budgets.forEach((b: Budget) => {
        result[b.category] = {
            budget: b.amount,
            spent: 0,
            remaining: b.amount,
        };
    });

    transactions.forEach((t: Transaction) => {
        if (!result[t.category]) return;

        result[t.category]!.spent += t.amount;
        result[t.category]!.remaining = result[t.category]!.budget - result[t.category]!.spent;
    });

    return result;
};
