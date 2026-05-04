"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Globe2, Languages, Save } from "lucide-react"

import { useToast } from "@/app/components/ui/use-toast"
import { useDashboardCurrency } from "@/app/features/currency"
import { useUpdateUserSettings, useUserSettings } from "@/app/features/settings"

const LOCALE_OPTIONS = ["en-IN", "en-US", "en-GB", "en-IE"] as const
const TIMEZONE_OPTIONS = ["Asia/Kolkata", "UTC", "Europe/London", "America/New_York"] as const

export default function CurrencyLocalePage() {
  const { data, error } = useUserSettings()
  const updateSettings = useUpdateUserSettings()
  const { toast } = useToast()
  const { currencies, selectedCurrency, setSelectedCurrency, isLoadingRates, lastUpdated } = useDashboardCurrency()
  const [locale, setLocale] = useState("en-IN")
  const [timezone, setTimezone] = useState("Asia/Kolkata")

  useEffect(() => {
    if (!data) return
    setLocale(data.locale)
    setTimezone(data.timezone)
    if (data.preferredCurrency !== selectedCurrency) {
      setSelectedCurrency(data.preferredCurrency)
    }
  }, [data, selectedCurrency, setSelectedCurrency])

  const handleSave = async () => {
    await updateSettings.mutateAsync({
      preferredCurrency: selectedCurrency,
      locale,
      timezone,
    })
    toast({
      title: "Regional preferences saved",
      description: "Your currency and locale settings are now synced.",
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Currency & Locale</h1>
          </div>
          <p className="mt-1 text-sm text-foreground/60">Choose how finance values and regional preferences should feel across the dashboard.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load currency preferences: {error.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground">Display Preferences</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">Currency</span>
              <select
                value={selectedCurrency}
                onChange={(event) => setSelectedCurrency(event.target.value as (typeof currencies)[number])}
                disabled={isLoadingRates}
                className="w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">Locale</span>
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
              >
                {LOCALE_OPTIONS.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">Timezone</span>
              <select
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
              >
                {TIMEZONE_OPTIONS.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Live Status</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-foreground/65">
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                Current dashboard currency: <strong className="text-foreground">{selectedCurrency}</strong>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                Locale preference: <strong className="text-foreground">{locale}</strong>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                FX sync: <strong className="text-foreground">{lastUpdated || "waiting for first sync"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
