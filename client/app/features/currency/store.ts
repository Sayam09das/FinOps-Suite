export const DASHBOARD_CURRENCIES = ["USD", "INR", "EUR", "GBP"] as const

export type DashboardCurrency = (typeof DASHBOARD_CURRENCIES)[number]

export const DEFAULT_DASHBOARD_CURRENCY: DashboardCurrency = "INR"
export const DEFAULT_SOURCE_CURRENCY: DashboardCurrency = "INR"
export const DASHBOARD_CURRENCY_STORAGE_KEY = "finops-dashboard-currency"
export const DASHBOARD_CURRENCY_RATES_STORAGE_KEY = "finops-dashboard-currency-rates"
export const DASHBOARD_CURRENCY_API_URL = "https://api.frankfurter.dev/v1/latest"

export type CurrencyRates = Record<DashboardCurrency, number>

export const IDENTITY_CURRENCY_RATES: CurrencyRates = {
  USD: 1,
  INR: 1,
  EUR: 1,
  GBP: 1,
}

type CurrencyStoreState = {
  selectedCurrency: DashboardCurrency
  rates: CurrencyRates
}

const currencyStore: CurrencyStoreState = {
  selectedCurrency: DEFAULT_DASHBOARD_CURRENCY,
  rates: IDENTITY_CURRENCY_RATES,
}

export function isDashboardCurrency(value: string): value is DashboardCurrency {
  return DASHBOARD_CURRENCIES.includes(value as DashboardCurrency)
}

export function getDashboardCurrencyLocale(currency: string): string {
  switch (currency) {
    case "INR":
      return "en-IN"
    case "EUR":
      return "en-IE"
    case "GBP":
      return "en-GB"
    case "USD":
    default:
      return "en-US"
  }
}

export function getSelectedDashboardCurrency(): DashboardCurrency {
  return currencyStore.selectedCurrency
}

export function getDashboardCurrencyRates(): CurrencyRates {
  return currencyStore.rates
}

export function setDashboardCurrencyState(next: Partial<CurrencyStoreState>) {
  if (next.selectedCurrency) {
    currencyStore.selectedCurrency = next.selectedCurrency
  }

  if (next.rates) {
    currencyStore.rates = next.rates
  }
}

export function convertCurrencyAmount(
  amount: number,
  from: string = DEFAULT_SOURCE_CURRENCY,
  to: string = currencyStore.selectedCurrency,
): number {
  if (!Number.isFinite(amount)) {
    return 0
  }

  if (from === to) {
    return amount
  }

  if (!isDashboardCurrency(from) || !isDashboardCurrency(to)) {
    return amount
  }

  const rates = currencyStore.rates
  const fromRate = rates[from]
  const toRate = rates[to]

  if (!fromRate || !toRate) {
    return amount
  }

  const amountInUsd = from === "USD" ? amount : amount / fromRate
  return to === "USD" ? amountInUsd : amountInUsd * toRate
}
