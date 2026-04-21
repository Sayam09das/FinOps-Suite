import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Plus, Receipt, Target, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      title: 'Add Transaction',
      description: 'Record income or expense',
      icon: Receipt,
      href: '/transactions/new',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Create Budget',
      description: 'Set spending limits',
      icon: Target,
      href: '/budgets/new',
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      title: 'View Reports',
      description: 'Analyze your finances',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Settings',
      description: 'Manage your account',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <CardDescription>Common tasks to manage your finances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="secondary"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
                >
                  <div className={`p-2 rounded-full text-white ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}