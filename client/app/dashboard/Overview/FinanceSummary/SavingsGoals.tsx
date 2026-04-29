"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { formatCurrency } from '@/app/lib/utils/number'
import { Target, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

interface Goal {
  name: string
  progress: number
  target: number
}

interface SavingsGoalsProps {
  savingsRate: number
  goals: Goal[]
}

export default function SavingsGoals({ savingsRate, goals }: SavingsGoalsProps) {
  const calculateETA = (progress: number, target: number, monthlySave: number = 5000): string => {
    const remaining = target - (progress / 100 * target)
    const months = Math.ceil(remaining / monthlySave)
    const years = Math.floor(months / 12)
    const remMonths = months % 12
    if (years > 0) return `${years}y ${remMonths}m`
    return `${months}m`
  }

  return (
    <Card className="h-[420px] rounded-3xl border-2 border-border/50 shadow-xl hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Target className="h-6 w-6 text-primary" />
          Savings & Goals
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-lg font-semibold text-primary">
          {savingsRate.toFixed(1)}% Savings Rate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={goal.name} className="group p-4 rounded-2xl hover:bg-muted/50 transition-all border hover:border-primary/30">
              <div className="flex items-start gap-4 mb-3">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg -mt-1">
                  <Target className="h-5 w-5 text-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg leading-tight">{goal.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Target: ₹{formatCurrency(goal.target)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{goal.progress}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={goal.progress} className="h-3 [&>div]:!bg-linear-to-r [&>div]:from-primary [&>div]:to-secondary" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 opacity-70" />
                  ETA: {calculateETA(goal.progress, goal.target)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Savings Rate Insight */}
        <div className="p-5 bg-linear-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 rounded-2xl border border-green-500/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Monthly Savings Rate
              </p>
              <p className="text-3xl font-black bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {savingsRate}%
              </p>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-md">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-2">
            Excellent! Above 20% target ✓
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

