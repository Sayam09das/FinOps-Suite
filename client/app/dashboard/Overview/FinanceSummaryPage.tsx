"use client"

import React, { useState, useMemo } from 'react'
import { Calendar, Download, BarChart3, TrendingUp } from 'lucide-react'

import HeaderControls from './FinanceSummary/HeaderControls'
import NetWorthCard from './FinanceSummary/NetWorthCard'
import IncomeExpenseChart from './FinanceSummary/IncomeExpenseChart'
import ExpenseBreakdown from './FinanceSummary/ExpenseBreakdown'
import CashFlowCards from './FinanceSummary/CashFlowCards'
import SavingsGoals from './FinanceSummary/SavingsGoals'
import AccountDistribution from './FinanceSummary/AccountDistribution'
import RecurringExpenses from './FinanceSummary/RecurringExpenses'
import AlertsPanel from './FinanceSummary/AlertsPanel'
import SummaryTable from './FinanceSummary/SummaryTable'

// Demo data - replace with useDashboard hook
const demoData = {
  netWorth: 125000,
  assets: 150000,
  liabilities: 25000,
  trend: 8,
  income: 45000,
  expense: 32000,
  savingsRate: 28.9,
  categories: [
    { name: 'Food', amount: 12000, percent: 30, color: '#EF4444' },
    { name: 'Rent', amount: 15000, percent: 37, color: '#3B82F6' },
    { name: 'Travel', amount: 5000, percent: 12, color: '#10B981' },
    { name: 'Other', amount: 10000, percent: 21, color: '#F59E0B' }
  ],
  cashFlow: {
    opening: 50000,
    in: 45000,
    out: 32000,
    closing: 63000
  },
  goals: [
    { name: 'Emergency Fund', progress: 70, target: 100000 },
    { name: 'Investment Goal', progress: 40, target: 50000 }
  ],
  accounts: [
    { name: 'Savings', balance: 45000, percent: 36 },
    { name: 'Checking', balance: 30000, percent: 24 },
    { name: 'Investments', balance: 75000, percent: 60 }
  ],
  recurring: [
    { name: 'Netflix', amount: 999, due: '2024-12-05' },
    { name: 'EMI Loan', amount: 5000, due: '2024-12-10' }
  ],
  alerts: ['Overspending on Food (30% budget)', 'Unusual transaction detected']
}

export default function FinanceSummaryPage() {
  const [dateRange, setDateRange] = useState('thisMonth')
  const [compare, setCompare] = useState(false)

  // TODO: Integrate useDashboard for real data
  const data = demoData

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <HeaderControls 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        compare={compare}
        onCompareToggle={() => setCompare(!compare)}
      />

      {/* Hero Net Worth */}
      <NetWorthCard 
        netWorth={data.netWorth}
        assets={data.assets}
        liabilities={data.liabilities}
        trend={data.trend}
      />

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart 
          income={data.income} 
          expense={data.expense}
          compare={compare}
        />
        <ExpenseBreakdown categories={data.categories} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowCards cashFlow={data.cashFlow} />
        <SavingsGoals 
          savingsRate={data.savingsRate}
          goals={data.goals}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountDistribution accounts={data.accounts} />
        <RecurringExpenses recurring={data.recurring} />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsPanel alerts={data.alerts} />
        <SummaryTable />
      </div>
    </div>
  )
}

