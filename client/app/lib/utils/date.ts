export function formatDate(date: Date | string | number, format: "short" | "medium" | "long" | "full" = "medium") {
  const dateObj = new Date(date)
  
  const formats = {
    short: { month: "short", day: "numeric", year: "numeric" },
    medium: { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" },
    long: { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" },
    full: { 
      weekday: "long", 
      month: "long", 
      day: "numeric", 
      year: "numeric", 
      hour: "numeric", 
      minute: "2-digit" 
    }
  } as Record<string, Intl.DateTimeFormatOptions>

  return new Intl.DateTimeFormat("en-US", formats[format]).format(dateObj)
}

export function formatDateRange(start: Date | string, end: Date | string, format: "short" | "long" = "short") {
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  if (format === "short") {
    return `${formatDate(startDate, "short")} - ${formatDate(endDate, "short")}`
  }
  
  const sameYear = startDate.getFullYear() === endDate.getFullYear()
  const sameMonth = startDate.getMonth() === endDate.getMonth()
  
  let startStr = formatDate(startDate, "medium")
  let endStr = formatDate(endDate, "medium")
  
  if (sameYear && sameMonth) {
    endStr = endDate.toLocaleDateString("en-US", { day: "numeric", hour: "numeric", minute: "2-digit" })
  } else if (sameYear) {
    endStr = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
  }
  
  return `${startStr} - ${endStr}`
}

export function isToday(date: Date | string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return today.getTime() === target.getTime()
}

export function isYesterday(date: Date | string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return yesterday.getTime() === target.getTime()
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  
  if (diffSeconds < 60) return "just now"
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
  if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)}d ago`
  
  return formatDate(date, "short")
}

export function getMonthName(month: number, format: "short" | "long" = "short"): string {
  const date = new Date(2000, month, 1)
  return date.toLocaleDateString("en-US", { month: format })
}

export function startOfMonth(date: Date | string): Date {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfMonth(date: Date | string): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  d.setHours(23, 59, 59, 999)
  return d
}

export type DateFormat = "short" | "medium" | "long" | "full"

