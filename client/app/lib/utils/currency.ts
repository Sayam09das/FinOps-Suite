import { formatCurrency, currencySymbol } from "./number"

export function formatAmount(amount: number | string, options: {
  currency?: string
  locale?: string
  compact?: boolean
} = {}) {
  const { currency = "USD", locale = "en-US", compact = false } = options
  
  if (compact) {
    return formatCurrency(amount, currency, locale)
  }
  
  const formatted = formatCurrency(amount, currency, locale)
  return formatted
}

export function getCurrencyRate(from: string, to: string, amount: number = 1): Promise<number> {
  // Placeholder for currency conversion API
  return Promise.resolve(amount)
}

export function calculateConversion(amount: number, rate: number): number {
  return amount * rate
}

export function getCurrencyName(currency: string): string {
  const names = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    CHF: "Swiss Franc",
    INR: "Indian Rupee",
    CNY: "Chinese Yuan"
  }
  return names[currency as keyof typeof names] || currency
}

export function formatPercent(value: number | string, decimals = 1): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  return num.toLocaleString("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  })
}

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "INR" | "CNY"

export const SUPPORTED_CURRENCIES: Currency[] = [
  "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "INR", "CNY"
]

