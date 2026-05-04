"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BellRing, Globe2, PlugZap, ShieldCheck, Wifi } from "lucide-react"

import { useDashboardCurrency } from "@/app/features/currency"
import { useNotifications } from "@/app/features/notifications"
import { useUserSettings } from "@/app/features/settings"

function StatusCard({
  title,
  description,
  status,
  meta,
  icon: Icon,
}: {
  title: string
  description: string
  status: "Connected" | "Active" | "Offline" | "Pending"
  meta: string
  icon: typeof PlugZap
}) {
  const tone =
    status === "Connected" || status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Pending"
      ? "bg-amber-50 text-amber-700"
      : "bg-rose-50 text-rose-700"

  return (
    <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-foreground/55">{description}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>
      </div>
      <p className="mt-4 text-sm text-foreground/60">{meta}</p>
    </div>
  )
}

export default function IntegrationsPage() {
  const { data } = useUserSettings()
  const { data: notificationsData } = useNotifications()
  const { lastUpdated } = useDashboardCurrency()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
        <PlugZap className="h-5 w-5 text-primary-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Integrations</h1>
          <p className="mt-1 text-sm text-foreground/60">Live status cards for the connected services your dashboard already depends on.</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusCard title="Authentication Provider" description="Current account sign-in source" status={data?.isOAuth ? "Connected" : "Active"} meta={data?.provider ? `Using OAuth provider: ${data.provider}` : "Using credentials-based authentication."} icon={ShieldCheck} />
        <StatusCard title="Notification Delivery" description="Realtime backend notification feed" status={data?.pushNotifications ? "Active" : "Pending"} meta={`${notificationsData?.unreadCount ?? 0} unread notification(s) currently available in your live feed.`} icon={BellRing} />
        <StatusCard title="Exchange Rates" description="Dashboard FX conversion service" status={lastUpdated ? "Connected" : "Pending"} meta={lastUpdated ? `Last live rates sync: ${lastUpdated}` : "Waiting for the first successful FX sync."} icon={Globe2} />
        <StatusCard title="Browser Realtime Channel" description="Current session connectivity" status={isOnline ? "Connected" : "Offline"} meta={isOnline ? "This browser is online and ready for realtime updates." : "Your browser is offline, so live updates are temporarily paused."} icon={Wifi} />
      </div>
    </div>
  )
}
