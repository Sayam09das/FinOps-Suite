"use client"

import React from 'react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { AlertCircle, Bell, ShieldAlert, AlertTriangle } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/app/lib/utils/cn'

interface Alert {
  message: string
  type?: 'warning' | 'error' | 'info'
}

interface AlertsPanelProps {
  alerts: string[] | Alert[]
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const alertIcons = {
    warning: AlertTriangle,
    error: AlertCircle,
    info: Bell
  }

  const alertColors = {
    warning: 'border-orange-400 bg-orange-50 text-orange-800',
    error: 'border-destructive bg-destructive/10 text-destructive-foreground',
    info: 'border-primary/30 bg-primary/10 text-primary-foreground'
  }

  if (alerts.length === 0) {
    return (
      <Card className="h-[420px] rounded-3xl border-2 border-border/50 shadow-xl flex items-center justify-center">
        <CardContent className="text-center p-12">
          <ShieldAlert className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">All Clear!</h3>
          <p className="text-muted-foreground/70">No financial alerts or risks detected.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[420px] rounded-3xl border-2 shadow-xl overflow-hidden">
      <CardHeader className="p-6 pb-4 bg-gradient-to-r from-warning/10 via-destructive/5 to-warning/10 border-b border-border/50">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-warning" />
          <h3 className="text-xl font-bold text-foreground">Risk & Alerts</h3>
          <Badge className="ml-auto" variant="outline">
            {alerts.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4 overflow-y-auto max-h-[320px]">
        {alerts.map((alert, index) => {
          const isString = typeof alert === 'string'
          const message = isString ? alert : alert.message
          const type = isString ? 'warning' : (alert.type || 'warning')
          const Icon = alertIcons[type as keyof typeof alertIcons] || AlertCircle
          const colorClass = alertColors[type as keyof typeof alertColors]
          
          return (
            <div key={index} className={cn(
              "group flex items-start gap-4 p-5 rounded-2xl border hover:shadow-md transition-all cursor-pointer hover:-translate-y-1",
              colorClass,
              "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            )}>
              <div className="flex-shrink-0 pt-0.5">
                <Icon className="h-6 w-6 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg leading-tight mb-1">{message}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    Action Required
                  </Badge>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-background/50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

