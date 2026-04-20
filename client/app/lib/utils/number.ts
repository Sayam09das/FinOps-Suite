import { cn } from "./cn"

export function formatCurrency(value: number | string, currency = "USD", locale = "en-US") {
  const numValue = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  }).format(numValue)
}

export function formatNumber(value: number | string, options: Intl.NumberFormatOptions = {}) {
  const numValue = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat("en-US", { 
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
    ...options
  }).format(numValue)
}

export function abbreviateNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  
  const suffixes = ["", "K", "M", "B", "T"]
  let suffixIndex = 0
  
  let current = num
  while (Math.abs(current) >= 1000 && suffixIndex < suffixes.length - 1) {
    current /= 1000
    suffixIndex++
  }
  
  return formatNumber(Math.round(current * 10) / 10, {}) + suffixes[suffixIndex]
}

export function currencySymbol(currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { 
    style: 'currency', 
    currency,
    minimumFractionDigits: 0 
  }).formatToParts(1).find(part => part.type === 'currency')?.value || "$"
}

export function isValidNumber(value: any): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value)
}

export function parseCurrency(str: string): number | null {
  const num = parseFloat(str.replace(/[^\d.-]/g, ''))
  return isNaN(num) ? null : num
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

