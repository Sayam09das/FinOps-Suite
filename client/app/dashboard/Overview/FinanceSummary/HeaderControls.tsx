"use client"

import React from 'react'
import { Button } from '@/app/components/ui/button'
import { Calendar, Download, ArrowLeftRight, CalendarDays } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Switch } from '@/app/components/ui/switch'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/app/lib/utils/cn'
import { format } from 'date-fns'

interface HeaderControlsProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
  compare: boolean
  onCompareToggle: () => void
}

export default function HeaderControls({ dateRange, onDateRangeChange, compare, onCompareToggle }: HeaderControlsProps) {
  const queryClient = useQueryClient()
  
  const dateRanges = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const currentDate = format(new Date(), 'MMMM yyyy')

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] })
  }

  const handleExport = async (format: 'csv') => {
    const dateRangeParam = dateRange || 'thisMonth';
    const url = `/api/export/${format}?dateRange=${dateRangeParam}`;
    
    window.open(url, '_blank');
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-background/80 backdrop-blur-sm rounded-2xl border p-6 shadow-xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Finance Summary
        </h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {currentDate} • Live data from your transactions
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Date Range - Controls real API data */}
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Compare Toggle */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-background/50">
          <span className="text-sm font-medium text-muted-foreground">Compare Period</span>
          <Switch 
            checked={compare} 
            onCheckedChange={onCompareToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Export */}
        <Select onValueChange={(value) => handleExport('csv' as const)}>
          <SelectTrigger className="w-32">
            <Download className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Export" />
          </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
        </Select>

        {/* Refresh - Real data refetch */}
        <Button size="sm" variant="ghost" onClick={handleRefresh} className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </div>
  )
}
