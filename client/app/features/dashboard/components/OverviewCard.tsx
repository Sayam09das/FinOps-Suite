import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { TrendingUp, DollarSign, FileText, CreditCard, Target, AlertTriangle } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

interface OverviewCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  isPositive?: boolean
  description?: string
}

export function OverviewCard({
  title,
  value,
  change,
  icon,
  isPositive = true,
  description
}: OverviewCardProps) {
  return (
    <Card className="flex-1 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
        </div>
        <div className={cn(
          'h-8 w-8 rounded-full p-1.5',
          isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">
          {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
        </span>
        <p className={cn(
          "text-xs font-medium",
          isPositive ? "text-emerald-600" : "text-rose-600"
        )}>
          {change}
        </p>
      </CardContent>
    </Card>
  )
}

