"use client"

import { ResponsiveContainer } from "@/app/components/charts/MountedResponsiveContainer";
import React, { useMemo } from 'react'
import { TrendingUp, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { cn } from '@/app/lib/utils/cn'
import { formatCurrency } from '@/app/lib/utils/number'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface NetWorthCardProps {
  netWorth: number
  assets: number
  liabilities: number
  trend: number
}

export default function NetWorthCard({ netWorth, assets, liabilities, trend }: NetWorthCardProps) {
  const netWorthTrend = trend > 0 ? 'text-green-500' : 'text-destructive'

  // Use actual netWorth value - no demo fallback
  // If netWorth is 0 or undefined, show empty state
  const hasData = netWorth && netWorth > 0;
  const displayValue = hasData ? netWorth : 0;
  
  const trendData = useMemo(() => {
    if (!hasData) {
      // Return empty/default data when no real data exists
      return [
        { month: 'Jan', value: 0 },
        { month: 'Feb', value: 0 },
        { month: 'Mar', value: 0 },
        { month: 'Apr', value: 0 },
        { month: 'May', value: 0 },
        { month: 'Jun', value: 0 }
      ];
    }
    // Generate trend based on actual value
    return [
      { month: 'Jan', value: displayValue * 0.9 },
      { month: 'Feb', value: displayValue * 0.92 },
      { month: 'Mar', value: displayValue * 0.95 },
      { month: 'Apr', value: displayValue * 0.97 },
      { month: 'May', value: displayValue * 0.99 },
      { month: 'Jun', value: displayValue }
    ];
  }, [displayValue, hasData]);

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-2 border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">
          {formatCurrency(netWorth)}
        </CardTitle>
        <CardDescription className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
          Total Net Worth
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Mini Trend Chart */}
        <div className="h-40 p-6 bg-linear-to-r from-muted/20 to-accent/10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} opacity={0.7} fontSize={12} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown */}
        <div className="p-6 grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(assets)}
            </div>
            <div className="text-sm text-muted-foreground">Assets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">
              -{formatCurrency(liabilities)}
            </div>
            <div className="text-sm text-muted-foreground">Liabilities</div>
          </div>
        </div>

        {/* Insight */}
        <div className="p-6 pt-0 border-t border-border/30">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 group-hover:bg-primary/10 transition-all">
            <div className={cn('p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-lg', netWorthTrend)}>
              {trend > 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Net worth {trend > 0 ? 'increased' : 'decreased'} by{' '}
                <span className={netWorthTrend + ' font-bold'}>{Math.abs(trend)}%</span>
              </p>
              <p className="text-xs text-muted-foreground/70">from last month</p>
            </div>
            <TrendingUp className="ml-auto h-5 w-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
