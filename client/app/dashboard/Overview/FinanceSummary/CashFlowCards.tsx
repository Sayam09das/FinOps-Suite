"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { formatCurrency } from '@/app/lib/utils/number'
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'

interface CashFlow {
  opening: number
  in: number
  out: number
  closing: number
}

interface CashFlowCardsProps {
  cashFlow: CashFlow
}

export default function CashFlowCards({ cashFlow }: CashFlowCardsProps) {
  const netFlow = cashFlow.in - cashFlow.out

  return (
    <Card className="rounded-3xl border-2 border-border/50 shadow-xl hover:shadow-2xl transition-all">
      <CardHeader className="pb-6">
        <CardTitle>Cash Flow Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <CashFlowItem 
            label="Opening Balance" 
            value={cashFlow.opening}
            icon={TrendingUp}
            color="text-muted-foreground"
          />
          <CashFlowItem 
            label="Money In" 
            value={cashFlow.in}
            icon={ArrowUp}
            color="text-green-500"
          />
          <CashFlowItem 
            label="Money Out" 
            value={cashFlow.out}
            icon={ArrowDown}
            color="text-destructive"
          />
          <div className="col-span-2" />
        </div>

        <div className="pt-6 border-t border-border/50">
          <CashFlowItem 
            label="Closing Balance" 
            value={cashFlow.closing}
            icon={TrendingUp}
            color="text-primary font-bold text-xl"
            className="text-center py-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border-2 border-primary/20 shadow-lg"
          />
        </div>

        {/* Net Flow Insight */}
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-2xl border border-green-500/20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <ArrowUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-lg">
                Net Cash Flow: ₹{formatCurrency(netFlow)}
              </p>
              <p className="text-sm text-muted-foreground">
                Positive cash flow this period
              </p>
            </div>
            <div className="ml-auto text-sm font-medium text-green-600">
              +{(netFlow / cashFlow.in * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CashFlowItemProps {
  label: string
  value: number
  icon: React.ElementType
  color: string
  className?: string
}

function CashFlowItem({ label, value, icon: Icon, color, className }: CashFlowItemProps) {
  return (
    <div className={cn("group p-4 rounded-2xl hover:bg-muted/50 transition-all border hover:border-primary/30", className)}>
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-muted/50 group-hover:bg-primary/20 rounded-xl transition-colors">
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {label}
          </p>
        </div>
      </div>
      <p className={cn("text-2xl font-bold", color)}>
        ₹{formatCurrency(value)}
      </p>
    </div>
  )
}

