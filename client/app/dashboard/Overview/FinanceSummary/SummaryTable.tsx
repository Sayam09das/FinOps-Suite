"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { formatCurrency } from '@/app/lib/utils/number'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/app/lib/utils/cn'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'

const demoData = [
  {
    category: 'Food & Dining',
    budget: 10000,
    actual: 12000,
    difference: -2000,
    status: 'over'
  },
  {
    category: 'Rent & Utilities',
    budget: 25000,
    actual: 25000,
    difference: 0,
    status: 'ontrack'
  },
  {
    category: 'Transportation',
    budget: 5000,
    actual: 3500,
    difference: 1500,
    status: 'under'
  },
  {
    category: 'Subscriptions',
    budget: 2000,
    actual: 1800,
    difference: 200,
    status: 'under'
  },
  {
    category: 'Shopping',
    budget: 8000,
    actual: 9500,
    difference: -1500,
    status: 'over'
  },
  {
    category: 'Investments',
    budget: 15000,
    actual: 18000,
    difference: -3000,
    status: 'over'
  }
]

export default function SummaryTable() {
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
              {demoData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/30 border-b border-border/20 h-14 group">
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    ₹{formatCurrency(row.budget)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    ₹{formatCurrency(row.actual)}
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

        {/* Summary Row */}
        <div className="mt-6 pt-6 border-t border-border/50 bg-muted/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Variance</span>
            <Badge className="text-lg px-4 py-2 font-bold bg-gradient-to-r from-destructive to-orange-500 text-destructive-foreground shadow-lg">
              -₹{formatCurrency(4500)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            2 categories over budget, 3 under budget
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

