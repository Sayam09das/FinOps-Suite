"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import {
  DASHBOARD_CURRENCIES,
  DASHBOARD_CURRENCY_API_URL,
  DASHBOARD_CURRENCY_RATES_STORAGE_KEY,
  DASHBOARD_CURRENCY_STORAGE_KEY,
  DEFAULT_DASHBOARD_CURRENCY,
  IDENTITY_CURRENCY_RATES,
  type CurrencyRates,
  type DashboardCurrency,
  isDashboardCurrency,
  setDashboardCurrencyState,
} from "./store"

type CurrencyContextValue = {
  currencies: readonly DashboardCurrency[]
  selectedCurrency: DashboardCurrency
  setSelectedCurrency: (currency: DashboardCurrency) => void
  isLoadingRates: boolean
  lastUpdated: string | null
}

type StoredRatesPayload = {
  lastUpdated: string | null
  rates: CurrencyRates
}

const DashboardCurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

function readStoredCurrency(): DashboardCurrency {
  if (typeof window === "undefined") {
    return DEFAULT_DASHBOARD_CURRENCY
  }

  const stored = window.localStorage.getItem(DASHBOARD_CURRENCY_STORAGE_KEY)
  return stored && isDashboardCurrency(stored) ? stored : DEFAULT_DASHBOARD_CURRENCY
}

function readStoredRates(): StoredRatesPayload {
  if (typeof window === "undefined") {
    return { rates: IDENTITY_CURRENCY_RATES, lastUpdated: null }
  }

  const raw = window.localStorage.getItem(DASHBOARD_CURRENCY_RATES_STORAGE_KEY)
  if (!raw) {
    return { rates: IDENTITY_CURRENCY_RATES, lastUpdated: null }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredRatesPayload>
    if (!parsed.rates) {
      return { rates: IDENTITY_CURRENCY_RATES, lastUpdated: null }
    }

    return {
      rates: {
        USD: Number(parsed.rates.USD) || 1,
        INR: Number(parsed.rates.INR) || 1,
        EUR: Number(parsed.rates.EUR) || 1,
        GBP: Number(parsed.rates.GBP) || 1,
      },
      lastUpdated: typeof parsed.lastUpdated === "string" ? parsed.lastUpdated : null,
    }
  } catch {
    return { rates: IDENTITY_CURRENCY_RATES, lastUpdated: null }
  }
}

async function fetchUsdRates(signal?: AbortSignal): Promise<StoredRatesPayload> {
  const symbols = DASHBOARD_CURRENCIES.filter((currency) => currency !== "USD").join(",")
  const response = await fetch(`${DASHBOARD_CURRENCY_API_URL}?base=USD&symbols=${symbols}`, {
    cache: "no-store",
    signal,
  })

  if (!response.ok) {
    throw new Error(`Currency API failed with ${response.status}`)
  }

  const data = await response.json() as {
    date?: string
    rates?: Partial<Record<DashboardCurrency, number>>
  }

  return {
    lastUpdated: data.date ?? null,
    rates: {
      USD: 1,
      INR: Number(data.rates?.INR) || 1,
      EUR: Number(data.rates?.EUR) || 1,
      GBP: Number(data.rates?.GBP) || 1,
    },
  }
}

export function DashboardCurrencyProvider({ children }: { children: React.ReactNode }) {
  const initialRates = readStoredRates()
  const [selectedCurrency, setSelectedCurrency] = useState<DashboardCurrency>(readStoredCurrency)
  const [rates, setRates] = useState<CurrencyRates>(initialRates.rates)
  const [lastUpdated, setLastUpdated] = useState<string | null>(initialRates.lastUpdated)
  const [isLoadingRates, setIsLoadingRates] = useState(initialRates.lastUpdated === null)

  useEffect(() => {
    window.localStorage.setItem(DASHBOARD_CURRENCY_STORAGE_KEY, selectedCurrency)
    setDashboardCurrencyState({ selectedCurrency })
  }, [selectedCurrency])

  useEffect(() => {
    setDashboardCurrencyState({ rates })
  }, [rates])

  useEffect(() => {
    const controller = new AbortController()

    const loadRates = async () => {
      setIsLoadingRates(true)
      try {
        const next = await fetchUsdRates(controller.signal)
        setRates(next.rates)
        setLastUpdated(next.lastUpdated)
        window.localStorage.setItem(DASHBOARD_CURRENCY_RATES_STORAGE_KEY, JSON.stringify(next))
      } catch (error) {
        console.error("[CURRENCY] Failed to fetch live rates", error)
      } finally {
        setIsLoadingRates(false)
      }
    }

    void loadRates()

    return () => controller.abort()
  }, [])

  const updateSelectedCurrency = useCallback((currency: DashboardCurrency) => {
    setSelectedCurrency(currency)
  }, [])

  const value = useMemo<CurrencyContextValue>(() => ({
    currencies: DASHBOARD_CURRENCIES,
    selectedCurrency,
    setSelectedCurrency: updateSelectedCurrency,
    isLoadingRates,
    lastUpdated,
  }), [isLoadingRates, lastUpdated, selectedCurrency, updateSelectedCurrency])

  return (
    <DashboardCurrencyContext.Provider value={value}>
      {children}
    </DashboardCurrencyContext.Provider>
  )
}

export function useDashboardCurrency() {
  const context = useContext(DashboardCurrencyContext)

  if (!context) {
    throw new Error("useDashboardCurrency must be used within a DashboardCurrencyProvider")
  }

  return context
}
