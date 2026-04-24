"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { formatCurrency } from '@/app/lib/utils/number'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface Category {
  name: string
  amount: number
  percent: number
  color: string
}

interface ExpenseBreakdownProps {
  categories: Category[]
}

export default function ExpenseBreakdown({ categories }: ExpenseBreakdownProps) {
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0)

  const COLORS = categories.map(cat => cat.color)

  return (
    <Card className="h-[420px] rounded-3xl border-2 border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          Top spending category: Food (30% of total)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="amount"
              nameKey="name"
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            >
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [formatCurrency(value), 'Amount']} />
          </PieChart>
        </ResponsiveContainer>

        {/* Category List */}
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={category.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: category.color + '20' }}
              >
                <div 
                  className="w-6 h-6 rounded-lg shadow-sm"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate group-hover:text-foreground/90">
                  {category.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{formatCurrency(category.amount)}</p>
                <p className="text-sm text-muted-foreground">{category.percent}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

