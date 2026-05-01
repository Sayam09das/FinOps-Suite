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

// Safe Select wrapper to prevent InvalidNodeTypeError from Radix UI
function SafeSelect({
  children,
  onValueChange,
  value,
  className,
  placeholder,
  icon: Icon
}: {
  children: React.ReactNode
  onValueChange?: (value: string) => void
  value?: string
  className?: string
  placeholder?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // During SSR and initial render, return a safe placeholder (no Radix components)
  if (!isMounted) {
    return (
      <button type="button" className={className} disabled style={{ 
        height: '2.5rem', 
        padding: '0 0.75rem', 
        borderRadius: '0.375rem',
        border: '1px solid hsl(var(--border))',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
      }}>
        {Icon && <Icon className="h-4 w-4" />}
        <span style={{ opacity: 0.5 }}>{placeholder || 'Select...'}</span>
      </button>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  )
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
        <h1 className="text-3xl font-bold bg-linear-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Finance Summary
        </h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {currentDate} • Live data from your transactions
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Date Range - Controls real API data */}
        <SafeSelect
          value={dateRange}
          onValueChange={onDateRangeChange}
          className="w-[180px]"
          icon={Calendar}
        >
          {dateRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SafeSelect>

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
        <Select value="export" onValueChange={(value) => value === 'csv' && handleExport('csv')}>
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
