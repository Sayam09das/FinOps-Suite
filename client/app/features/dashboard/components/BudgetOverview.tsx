import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import { Badge } from '@/app/components/ui/badge'
import { Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

interface Budget {
  id: string
  name: string
  category: string
  allocated: number
  spent: number
  period: string
}

interface BudgetOverviewProps {
  budgets: Budget[]
  limit?: number
}

export function BudgetOverview({ budgets, limit = 4 }: BudgetOverviewProps) {
  const recentBudgets = budgets.slice(0, limit)

  const getBudgetStatus = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100
    if (percentage >= 90) return { status: 'danger', color: 'bg-rose-500', icon: AlertTriangle }
    if (percentage >= 75) return { status: 'warning', color: 'bg-yellow-500', icon: AlertTriangle }
    return { status: 'good', color: 'bg-emerald-500', icon: CheckCircle }
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Budget Overview
        </CardTitle>
        <CardDescription>Track your spending against budgets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBudgets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No budgets set</p>
            <p className="text-sm">Create your first budget to get started</p>
          </div>
        ) : (
          recentBudgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.allocated) * 100, 100)
            const remaining = budget.allocated - budget.spent
            const { status, color, icon: StatusIcon } = getBudgetStatus(budget.spent, budget.allocated)

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{budget.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {budget.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">
                        {budget.period}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusIcon className={cn(
                      'h-4 w-4',
                      status === 'danger' ? 'text-rose-500' :
                      status === 'warning' ? 'text-yellow-500' : 'text-emerald-500'
                    )} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Progress
                    value={percentage}
                    className="h-2"
                    // You might need to add custom styling for the progress bar color
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(budget.spent)} spent</span>
                    <span>
                      {remaining > 0 ? formatCurrency(remaining) : formatCurrency(Math.abs(remaining))} +
                      {remaining > 0 ? ' remaining' : ' over budget'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}