"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { formatCurrency } from '@/app/lib/utils/number'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Banknote, CreditCard, TrendingUp, Package } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

interface Account {
  name: string
  balance: number
  percent: number
}

interface AccountDistributionProps {
  accounts: Account[]
}

const accountIcons = {
  'Savings': Banknote,
  'Checking': Package,
  'Investments': TrendingUp,
  'Credit Card': CreditCard
}

export default function AccountDistribution({ accounts }: AccountDistributionProps) {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']

  return (
    <Card className="h-[420px] rounded-3xl border-2 border-border/50 shadow-xl hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />
          Account Distribution
        </CardTitle>
        <CardDescription>Total across all accounts: ₹{formatCurrency(totalBalance)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={accounts}
              cx={120}
              cy={100}
              innerRadius={40}
              outerRadius={80}
              dataKey="balance"
              nameKey="name"
            >
              {accounts.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [formatCurrency(value), 'Balance']} />
          </PieChart>
        </ResponsiveContainer>

        <div className="p-6 space-y-3">
          {accounts.map((account, index) => {
            const Icon = accountIcons[account.name as keyof typeof accountIcons] || Banknote
            return (
              <div key={account.name} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all group border hover:border-accent/50">
                <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                  <Icon className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg leading-tight truncate">
                    {account.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {account.percent}% of total portfolio
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">
                    ₹{formatCurrency(account.balance)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

