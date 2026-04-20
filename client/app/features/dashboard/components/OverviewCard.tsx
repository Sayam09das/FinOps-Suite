import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { TrendingUp, DollarSign, FileText } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

interface OverviewCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  isPositive?: boolean
}

export function OverviewCard({ title, value, change, icon, isPositive = true }: OverviewCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(
          'h-6 w-6 rounded-full p-1',
          isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">
          {value}
        </span>
        <p className="text-xs text-muted-foreground">
          {change}
        </p>
      </CardContent>
    </Card>
  )
}

