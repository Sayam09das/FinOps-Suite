"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  Clock,
  Globe,
  Monitor,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Tablet,
} from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import { Card, CardContent } from "@/app/components/ui/card"
import { useSecurityLoginActivity } from "@/app/features/security"
import type { LoginSession } from "@/app/features/security"

function getDeviceIcon(deviceType: LoginSession["deviceType"]) {
  switch (deviceType) {
    case "mobile":
      return Smartphone
    case "tablet":
      return Tablet
    default:
      return Monitor
  }
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatRelativeTime(iso: string, now: number | null) {
  if (now === null) {
    return "Just now"
  }

  const diffMs = Math.max(0, now - new Date(iso).getTime())
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
}

export default function LoginActivityPage() {
  const { data, error, isLoading } = useSecurityLoginActivity()
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "failed">("all")
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
  }, [data?.summary.lastLoginTime, data?.sessions.length, filterStatus])

  const sessions = data?.sessions ?? []
  const filteredSessions = useMemo(() => {
    if (filterStatus === "all") {
      return sessions
    }
    return sessions.filter((session) => session.status === filterStatus)
  }, [filterStatus, sessions])

  const unknownDevices = useMemo(
    () => sessions.filter((session) => session.isUnknownDevice),
    [sessions],
  )

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Login Activity
            </h1>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            Real login events from your authenticated sessions and attempts.
          </p>
        </div>
        <Badge variant="accent" className="rounded-full">
          Live
        </Badge>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load login activity: {error.message}
        </div>
      ) : null}

      {unknownDevices.length > 0 ? (
        <Card variant="accent" padding="md" className="border-accent/40">
          <CardContent className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
            <div>
              <p className="text-sm font-semibold text-accent-foreground">
                Unknown device activity detected
              </p>
              <p className="text-sm text-accent-foreground/80">
                {unknownDevices.length} login event(s) came from a device fingerprint you had not used before.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card variant="primary" padding="lg">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Logins (7d)
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {data?.summary.totalLogins7d ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="lg">
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-foreground/50">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Last Login</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {data?.summary.lastLoginTime
                ? formatRelativeTime(data.summary.lastLoginTime, now)
                : "No login recorded yet"}
            </p>
            <p className="text-xs text-foreground/50">
              {data?.summary.lastLoginTime
                ? formatDateTime(data.summary.lastLoginTime)
                : "Your next successful sign-in will appear here."}
            </p>
          </CardContent>
        </Card>

        <Card
          variant={(data?.summary.suspiciousAttempts ?? 0) > 0 ? "accent" : "surface"}
          padding="lg"
        >
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-foreground/50">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Suspicious Attempts
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {data?.summary.suspiciousAttempts ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "success", "failed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              filterStatus === status
                ? "border-foreground/20 bg-foreground text-background"
                : "border-border/80 bg-background/60 text-foreground/70 hover:bg-background"
            }`}
          >
            {status === "all" ? "All Events" : status === "success" ? "Successful" : "Failed"}
          </button>
        ))}
      </div>

      <Card variant="ghost" padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Time</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Device</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Location</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">IP</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.deviceType)
                return (
                  <tr key={session.id} className="border-b border-border/40">
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-medium text-foreground">
                        {formatDateTime(session.dateTime)}
                      </div>
                      <div className="text-xs text-foreground/50">
                        {formatRelativeTime(session.dateTime, now)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <DeviceIcon className="h-4 w-4 text-foreground/50" />
                        <div>
                          <p>{session.device}</p>
                          <p className="text-xs text-foreground/50">
                            {session.browser} • {session.os}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-foreground/50" />
                        <span>
                          {session.location}, {session.country}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground/70">{session.ipAddress}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                            session.status === "success"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {session.status === "success" ? "Success" : "Failed"}
                        </span>
                        {session.isUnknownDevice ? (
                          <span className="text-xs text-amber-600">Unknown device</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredSessions.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-foreground/50">
            No login activity matches this filter yet.
          </div>
        ) : null}
      </Card>
    </div>
  )
}
