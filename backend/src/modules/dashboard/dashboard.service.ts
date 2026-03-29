import prisma from "../../config/db";

export const getDashboardData = async (userId: string) => {
    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });

    let income = 0;
    let expense = 0;

    const categoryMap: any = {};

    transactions.forEach((t) => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;

        if (!categoryMap[t.category]) {
            categoryMap[t.category] = 0;
        }

        categoryMap[t.category] += t.amount;
    });

    return {
        income,
        expense,
        balance: income - expense,
        recentTransactions: transactions.slice(0, 5),
        categoryAnalytics: categoryMap,
    };
};