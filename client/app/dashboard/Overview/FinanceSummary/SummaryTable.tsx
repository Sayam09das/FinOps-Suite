"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { formatCurrency } from '@/app/lib/utils/number'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'

interface BudgetSummaryRow {
  category: string
  budget: number
  actual: number
  difference: number
  status: 'over' | 'under' | 'ontrack'
}

interface SummaryTableProps {
  budgetSummary: BudgetSummaryRow[]
}

export default function SummaryTable({ budgetSummary }: SummaryTableProps) {
  const displayData = budgetSummary || []

  // Calculate totals
  const totalBudget = displayData.reduce((sum: number, row: BudgetSummaryRow) => sum + row.budget, 0)
  const totalActual = displayData.reduce((sum: number, row: BudgetSummaryRow) => sum + row.actual, 0)
  const totalVariance = totalBudget - totalActual
  const overBudgetCount = displayData.filter((row: BudgetSummaryRow) => row.status === 'over').length
  const underBudgetCount = displayData.filter((row: BudgetSummaryRow) => row.status === 'under').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      case 'under': return 'bg-green-500 text-green-foreground hover:bg-green-500/90'
      case 'ontrack': return 'bg-primary/20 text-primary-foreground hover:bg-primary/30'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over': return <ArrowUp className="h-3 w-3 rotate-180" />
      case 'under': return <ArrowUp className="h-3 w-3" />
      case 'ontrack': return <Minus className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <Card className="h-[420px] rounded-3xl border-2 border-border/50 shadow-xl hover:shadow-2xl overflow-hidden">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-xl">
          Detailed Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-2xl border overflow-hidden h-[320px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-1/2 font-semibold text-foreground/90">Category</TableHead>
                <TableHead className="text-right font-semibold text-foreground/90">Budget</TableHead>
                <TableHead className="text-right font-semibold text-foreground/90">Actual</TableHead>
                <TableHead className="w-24 text-right">Diff</TableHead>
              </TableRow>
            </TableHeader>
<TableBody>
              {displayData.map((row: BudgetSummaryRow, index: number) => (
                <TableRow key={index} className="hover:bg-muted/30 border-b border-border/20 h-14 group">
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatCurrency(row.budget)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatCurrency(row.actual)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      className={cn(
                        'gap-1 px-3 py-1 h-fit shadow-md font-semibold',
                        row.difference < 0 
                          ? 'bg-destructive text-destructive-foreground' 
                          : 'bg-green-500 text-green-foreground'
                      )}
                    >
                      {getStatusIcon(row.status)}
                      {formatCurrency(Math.abs(row.difference))}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

{/* Summary Row - use calculated totals */}
        <div className="mt-6 pt-6 border-t border-border/50 bg-muted/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Variance</span>
            <Badge className={cn(
              "text-lg px-4 py-2 font-bold shadow-lg",
              totalVariance < 0 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-green-500 text-green-foreground"
            )}>
              {totalVariance < 0 ? '-' : '+'}{formatCurrency(Math.abs(totalVariance))}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {overBudgetCount} categories over budget, {underBudgetCount} under budget
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
