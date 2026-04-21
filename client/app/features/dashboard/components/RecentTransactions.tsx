import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  date: string
  type: 'income' | 'expense'
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  limit?: number
}

export function RecentTransactions({ transactions, limit = 5 }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, limit)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number, type: string) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    return type === 'income' ? `+${formatted}` : `-${formatted}`
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
            <p className="text-sm">Start by adding your first transaction</p>
          </div>
        ) : (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center',
                  transaction.type === 'income'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-rose-100 text-rose-600'
                )}>
                  {transaction.type === 'income' ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={cn(
                'font-semibold text-sm',
                transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
              )}>
                {formatAmount(transaction.amount, transaction.type)}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}