"use client"

import React from 'react'
import { Button } from '@/app/components/ui/button'
import { Calendar, Download, ArrowLeftRight, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Switch } from '@/app/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { cn } from '@/app/lib/utils/cn'
import { format } from 'date-fns'

// Ensure UI components are available
if (typeof SelectContent === 'undefined') {
  console.warn('SelectContent component not available')
}
if (typeof Popover === 'undefined') {
  console.warn('Popover component not available')
}

interface HeaderControlsProps {
  dateRange: string
  onDateRangeChange: (value: string) => void
  compare: boolean
  onCompareToggle: () => void
}

export default function HeaderControls({ dateRange, onDateRangeChange, compare, onCompareToggle }: HeaderControlsProps) {
  const dateRanges = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
    { value: 'custom', label: 'Custom' }
  ]

  const exportOptions = ['CSV', 'PDF']

  const currentDate = format(new Date(), 'MMMM yyyy')

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-background/80 backdrop-blur-sm rounded-2xl border p-6 shadow-xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Finance Summary
        </h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {currentDate}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
      {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Calendar className="h-4 w-4" />
              {dateRanges.find(r => r.value === dateRange)?.label ?? 'Select Range'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1">
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger>
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
          </PopoverContent>
        </Popover>

        {/* Compare Toggle */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-background/50">
          <span className="text-sm font-medium text-muted-foreground">Compare</span>
          <Switch 
            checked={compare} 
            onCheckedChange={onCompareToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Export */}
        <Select>
          <SelectTrigger className="w-32">
            <Download className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            {exportOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" variant="ghost" className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}

