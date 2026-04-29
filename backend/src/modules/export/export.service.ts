import prisma from "../../config/db";
import { getDashboardData } from "../dashboard/dashboard.service";
export const exportDashboardData = async (userId: string, dateRange: string, format: 'csv' | 'pdf') => {
  const data = await getDashboardData(userId);
  
  if (format === 'csv') {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Income', `₹${data.income.toLocaleString()}`],
      ['Total Expense', `₹${data.expense.toLocaleString()}`],
      ['Net Balance', `₹${data.balance.toLocaleString()}`],
      ['', ''],
      ['Recent Transactions'],
      ...data.recentTransactions.map(t => [`${t.note || 'Transaction'}`, `₹${t.amount.toLocaleString()}`, t.category, t.date]),
      ['', ''],
      ['Category Analytics'],
      ...Object.entries(data.categoryAnalytics).map(([category, amount]) => [category, `₹${Number(amount).toLocaleString()}`])
    ];
    
    return csvRows.map(row => row.join(',')).join('\\n');
  } 

  throw new Error('PDF export requires puppeteer - install with: npm i puppeteer');
};

