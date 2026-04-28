"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Wifi,
  CheckCircle2,
  XCircle,
  LogOut,
  X,
  Sparkles,
  ShieldAlert,
  Eye,
  Search,
} from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import {
  demoLoginSessions,
  demoLoginSummary,
  type LoginSession,
} from "./demo-data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

const tableRowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

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
  const d = new Date(iso)
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatRelativeTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

export default function LoginActivityPage() {
  const [selectedSession, setSelectedSession] = useState<LoginSession | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "failed">("all")
  const [showUnknownAlert, setShowUnknownAlert] = useState(true)

  const filteredSessions = useMemo(() => {
    if (filterStatus === "all") return demoLoginSessions
    return demoLoginSessions.filter((s) => s.status === filterStatus)
  }, [filterStatus])

  const unknownDevices = useMemo(
    () => demoLoginSessions.filter((s) => s.isUnknownDevice),
    [],
  )

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            Track every access event across your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="rounded-full">
            <Sparkles className="mr-1 h-3 w-3" />
            Pro
          </Badge>
        </div>
      </motion.div>

      {/* Unknown Device Alert */}
      <AnimatePresence>
        {showUnknownAlert && unknownDevices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card
              variant="accent"
              padding="md"
              className="flex items-start gap-3 border-accent/40"
            >
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-accent-foreground">
                  This wasn&apos;t you?
                </p>
                <p className="text-sm text-accent-foreground/80">
                  We detected {unknownDevices.length} unknown device(s) attempting access. Review
                  and secure your account if these were not you.
                </p>
              </div>
              <button
                onClick={() => setShowUnknownAlert(false)}
                className="rounded-full p-1 text-accent-foreground/60 hover:bg-accent/20"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Summary */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <motion.div variants={itemVariants}>
          <Card variant="primary" padding="lg" className="h-full">
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Eye className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Total Logins (7d)
                </span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {demoLoginSummary.totalLogins7d}
              </p>
              <p className="text-xs text-foreground/50">Across all devices and locations</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="surface" padding="lg" className="h-full">
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-foreground/50">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Last Login</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {formatRelativeTime(demoLoginSummary.lastLoginTime)}
              </p>
              <p className="text-xs text-foreground/50">
                {formatDateTime(demoLoginSummary.lastLoginTime)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            variant={demoLoginSummary.suspiciousAttempts > 0 ? "accent" : "surface"}
            padding="lg"
            className="h-full"
          >
            <CardContent className="space-y-2">
              <div
                className={`flex items-center gap-2 ${
                  demoLoginSummary.suspiciousAttempts > 0
                    ? "text-accent-foreground/70"
                    : "text-foreground/50"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Suspicious Attempts
                </span>
              </div>
              <p
                className={`text-3xl font-bold ${
                  demoLoginSummary.suspiciousAttempts > 0
                    ? "text-accent-foreground"
                    : "text-foreground"
                }`}
              >
                {demoLoginSummary.suspiciousAttempts}
              </p>
              <p className="text-xs text-foreground/50">Failed logins from unknown sources</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-2"
      >
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
            {status === "all"
              ? "All Events"
              : status === "success"
                ? "Successful"
                : "Failed"}
          </button>
        ))}
      </motion.div>

      {/* Login Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <Card variant="ghost" padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Date & Time
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Device
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Location
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    IP Address
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredSessions.map((session, idx) => {
                    const DeviceIcon = getDeviceIcon(session.deviceType)
                    const isSuccess = session.status === "success"

                    return (
                      <motion.tr
                        key={session.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => setSelectedSession(session)}
                        className="cursor-pointer border-b border-border/40 transition-colors hover:bg-primary/10"
                      >
                        <td className="px-5 py-3.5">
                          <div className="text-sm font-medium text-foreground">
                            {formatDateTime(session.dateTime)}
                          </div>
                          <div className="text-xs text-foreground/50">
                            {formatRelativeTime(session.dateTime)}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                                session.isUnknownDevice
                                  ? "border-accent/40 bg-accent/15 text-accent-foreground"
                                  : "border-border/70 bg-background/60 text-foreground/70"
                              }`}
                            >
                              <DeviceIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-foreground">
                                  {session.browser}
                                </span>
                                {session.isUnknownDevice && (
                                  <Badge variant="accent" className="rounded-full px-2 py-0.5 text-[10px]">
                                    <Sparkles className="mr-0.5 h-2.5 w-2.5" />
                                    Unknown
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-foreground/50">{session.os}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-sm text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-foreground/40" />
                            {session.location}
                            <span className="text-foreground/40">/ {session.country}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-sm font-mono text-foreground/80">
                            <Wifi className="h-3.5 w-3.5 text-foreground/40" />
                            {session.ipAddress}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                              isSuccess
                                ? "border-emerald-200/80 bg-emerald-50 text-emerald-700"
                                : "border-red-200/80 bg-red-50 text-red-700"
                            }`}
                          >
                            {isSuccess ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {isSuccess ? "Success" : "Failed"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedSession(session)
                            }}
                            className="rounded-full p-1.5 text-foreground/40 transition hover:bg-background hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-foreground/30" />
              <p className="mt-3 text-sm font-medium text-foreground/50">No events found</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Device Details Drawer */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSession(null)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Session Details</h2>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Device Header */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-bold ${
                      selectedSession.isUnknownDevice
                        ? "border-accent/40 bg-accent/15 text-accent-foreground"
                        : "border-border/70 bg-background/60 text-foreground"
                    }`}
                  >
                    {(() => {
                      const Icon = getDeviceIcon(selectedSession.deviceType)
                      return <Icon className="h-6 w-6" />
                    })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {selectedSession.device}
                      </h3>
                      {selectedSession.isUnknownDevice && (
                        <Badge variant="accent" className="rounded-full text-[10px]">
                          <Sparkles className="mr-0.5 h-2.5 w-2.5" />
                          Unknown
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60">
                      {selectedSession.browser} · {selectedSession.os}
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <DetailCard
                    icon={Globe}
                    label="IP Address"
                    value={selectedSession.ipAddress}
                  />
                  <DetailCard
                    icon={MapPin}
                    label="Location"
                    value={`${selectedSession.location}, ${selectedSession.country}`}
                  />
                  <DetailCard
                    icon={Clock}
                    label="Logged In"
                    value={formatDateTime(selectedSession.dateTime)}
                  />
                  <DetailCard
                    icon={ShieldCheck}
                    label="Status"
                    value={selectedSession.status === "success" ? "Successful" : "Failed"}
                    status={selectedSession.status}
                  />
                </div>

                {/* Session Token */}
                {selectedSession.sessionToken && (
                  <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2 text-foreground/50">
                      <Wifi className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Session Token</span>
                    </div>
                    <p className="break-all text-xs font-mono text-foreground/80">
                      {selectedSession.sessionToken}
                    </p>
                  </div>
                )}

                {/* Last Active */}
                {selectedSession.lastActive && (
                  <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                    <div className="mb-1 flex items-center gap-2 text-foreground/50">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Last Active</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatDateTime(selectedSession.lastActive)}
                    </p>
                  </div>
                )}

                {/* Alert Box */}
                {selectedSession.isUnknownDevice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3"
                  >
                    <div className="mb-1 flex items-center gap-2 text-accent-foreground">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-xs font-semibold">Security Alert</span>
                    </div>
                    <p className="text-sm text-foreground/80">
                      This device was not recognized. If this wasn&apos;t you, secure your account
                      immediately.
                    </p>
                  </motion.div>
                )}

                {/* Logout Action */}
                {selectedSession.status === "success" && selectedSession.sessionToken && (
                  <Button
                    variant="accent"
                    className="w-full rounded-2xl"
                    onClick={() => {
                      alert(`Logout from ${selectedSession.device} — feature coming soon`)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout this device
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailCard({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ElementType
  label: string
  value: string
  status?: "success" | "failed"
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-foreground/50">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p
        className={`text-sm font-semibold ${
          status === "success"
            ? "text-emerald-600"
            : status === "failed"
              ? "text-red-600"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

