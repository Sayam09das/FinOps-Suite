"use client"

import { ResponsiveContainer } from "@/app/components/charts/MountedResponsiveContainer";
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { cn } from '@/app/lib/utils/cn'
import { formatCurrency } from '@/app/lib/utils/number'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface IncomeExpenseChartProps {
  income: number
  expense: number
  compare: boolean
}

const chartData = [
  { month: 'W1', income: 11000, expense: 8500 },
  { month: 'W2', income: 12000, expense: 9000 },
  { month: 'W3', income: 11500, expense: 9500 },
  { month: 'W4', income: 13000, expense: 8000 }
]

export default function IncomeExpenseChart({ income, expense, compare }: IncomeExpenseChartProps) {
  const netSavings = income - expense
  const savingsPercent = ((netSavings / income) * 100).toFixed(1)

  return (
    <Card className="h-[420px] rounded-3xl border-2 border-border/50 shadow-xl hover:shadow-2xl transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          Income vs Expense
        </CardTitle>
        <CardDescription>
          Monthly overview {compare && '(vs previous period +12%)'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-2xl bg-muted/50 hover:bg-muted">
              <div className="text-2xl font-bold text-green-500">
                ₹{formatCurrency(income)}
              </div>
              <div className="text-sm text-green-600 font-medium">Total Income</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted/50 hover:bg-muted">
              <div className="text-2xl font-bold text-destructive">
                ₹{formatCurrency(expense)}
              </div>
              <div className="text-sm text-destructive-600 font-medium">Total Expense</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                ₹{formatCurrency(netSavings)}
              </div>
              <div className="text-sm text-primary font-medium">{savingsPercent}% Net Savings</div>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={12} />
              <YAxis axisLine={false} tickLine={false} tickMargin={12} />
              <Tooltip />
              {compare && (
                <ReferenceLine y={income} strokeDasharray="4 4" stroke="#10B981" label="Previous" />
              )}
              <Area 
                type="monotone" 
                dataKey="income" 
                stackId="1" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#incomeGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stackId="2" 
                stroke="#EF4444" 
                fillOpacity={1} 
                fill="url(#expenseGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

