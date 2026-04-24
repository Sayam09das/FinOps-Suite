"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { formatCurrency } from '@/app/lib/utils/number'
import { Calendar, AlertCircle, CreditCard, Repeat } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { cn } from '@/app/lib/utils/cn'

interface RecurringExpense {
  name: string
  amount: number
  due: string
}

interface RecurringExpensesProps {
  recurring: RecurringExpense[]
}

export default function RecurringExpenses({ recurring }: RecurringExpensesProps) {
  const monthlyTotal = recurring.reduce((sum, item) => sum + item.amount, 0)

  const getDueStatus = (due: string) => {
    const dueDate = new Date(due)
    const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysUntil <= 0) return 'overdue'
    if (daysUntil <= 3) return 'soon'
    return 'upcoming'
  }

  const statusColors = {
    overdue: 'bg-destructive text-destructive-foreground',
    soon: 'bg-orange-500 text-orange-foreground',
    upcoming: 'bg-secondary text-secondary-foreground'
  }

  return (
    <Card className="h-[420px] rounded-3xl border-2 border-border/50 shadow-xl hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Repeat className="h-6 w-6 text-primary" />
          Recurring Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full flex flex-col">
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-muted/50 to-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">₹{formatCurrency(monthlyTotal)}</p>
              <p className="text-sm text-muted-foreground">Monthly recurring total</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <CreditCard className="h-4 w-4" />
              {recurring.length} items
            </Badge>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {recurring.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Repeat className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No recurring expenses</p>
              <p className="text-sm">Great job keeping commitments low!</p>
            </div>
          ) : (
            recurring.map((expense) => {
              const status = getDueStatus(expense.due)
              return (
                <div key={expense.name} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/70 transition-all border hover:border-primary/40 cursor-pointer">
                  <div className="flex flex-col items-center p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:shadow-md transition-all">
                    <Calendar className="h-6 w-6 text-primary mb-1" />
                    <span className="text-xs font-mono text-primary/80">
                      {new Date(expense.due).getDate()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-lg truncate">{expense.name}</p>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs px-2 py-0.5 h-auto", statusColors[status])}
                      >
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Due {new Date(expense.due).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-destructive">₹{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

