"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  History,
  Search,
  Download,
  Filter,
  X,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Clock,
  User,
  FileText,
  ChevronRight,
  Sparkles,
  Eye,
} from "lucide-react"

import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { demoAuditLogs, type AuditLog, type AuditAction } from "./demo-data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

const timelineItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

const actionIconMap: Record<AuditAction, React.ElementType> = {
  Create: Plus,
  Update: Pencil,
  Delete: Trash2,
}

const actionColorMap: Record<AuditAction, string> = {
  Create: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
  Update: "border-blue-200/80 bg-blue-50 text-blue-700",
  Delete: "border-red-200/80 bg-red-50 text-red-700",
}

function formatTimestamp(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    full: d.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }
}

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState<"all" | AuditAction>("all")
  const [filterUser, setFilterUser] = useState<"all" | string>("all")

  const uniqueUsers = useMemo(
    () => Array.from(new Set(demoAuditLogs.map((l) => l.user))),
    [],
  )

  const filteredLogs = useMemo(() => {
    return demoAuditLogs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesAction = filterAction === "all" || log.actionType === filterAction
      const matchesUser = filterUser === "all" || log.user === filterUser
      return matchesSearch && matchesAction && matchesUser
    })
  }, [searchQuery, filterAction, filterUser])

  const criticalCount = useMemo(
    () => filteredLogs.filter((l) => l.isCritical).length,
    [filteredLogs],
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
            <History className="h-5 w-5 text-primary-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Audit Logs
            </h1>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            Complete trail of every action across your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="rounded-2xl"
            onClick={() => alert("Export feature coming soon")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Badge variant="accent" className="rounded-full">
            <Sparkles className="mr-1 h-3 w-3" />
            Pro
          </Badge>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      >
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border/80 bg-background/60 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-foreground/40" />
          {(["all", "Create", "Update", "Delete"] as const).map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filterAction === action
                  ? "border-foreground/20 bg-foreground text-background"
                  : "border-border/80 bg-background/60 text-foreground/70 hover:bg-background"
              }`}
            >
              {action === "all" ? "All" : action}
            </button>
          ))}
        </div>

        {/* User Filter */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-foreground/40" />
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="rounded-full border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground outline-none transition focus:border-primary/50"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Critical Alert */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="accent" padding="md" className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-accent-foreground" />
            <p className="text-sm text-accent-foreground">
              <span className="font-semibold">{criticalCount} critical action(s)</span> detected
              in the filtered results. Review these carefully.
            </p>
          </Card>
        </motion.div>
      )}

      {/* Logs Timeline */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {filteredLogs.map((log, idx) => {
          const ActionIcon = actionIconMap[log.actionType]
          const timestamp = formatTimestamp(log.timestamp)

          return (
            <motion.div
              key={log.id}
              variants={timelineItemVariants}
              transition={{ delay: idx * 0.04 }}
            >
              <Card
                variant={log.isCritical ? "accent" : "ghost"}
                padding="md"
                className={`cursor-pointer transition hover:-translate-y-0.5 ${
                  log.isCritical ? "border-accent/30" : "hover:border-primary/30"
                }`}
                onClick={() => setSelectedLog(log)}
              >
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    {/* Action Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${actionColorMap[log.actionType]}`}
                    >
                      <ActionIcon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{log.action}</span>
                        {log.isCritical && (
                          <Badge variant="accent" className="rounded-full px-2 py-0.5 text-[10px]">
                            <AlertCircle className="mr-0.5 h-2.5 w-2.5" />
                            Critical
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/50">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {log.entity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timestamp.date} at {timestamp.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button className="rounded-full p-1.5 text-foreground/40 transition hover:bg-background hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </button>
                    <ChevronRight className="h-4 w-4 text-foreground/30" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {filteredLogs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Search className="h-10 w-10 text-foreground/25" />
          <p className="mt-4 text-sm font-medium text-foreground/50">No logs match your filters</p>
          <button
            onClick={() => {
              setSearchQuery("")
              setFilterAction("all")
              setFilterUser("all")
            }}
            className="mt-2 text-sm text-primary-foreground underline underline-offset-2"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

      {/* Log Details Drawer */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLog(null)}
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
                <h2 className="text-xl font-bold text-foreground">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Action Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${actionColorMap[selectedLog.actionType]}`}
                  >
                    {(() => {
                      const Icon = actionIconMap[selectedLog.actionType]
                      return <Icon className="h-5 w-5" />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedLog.action}</h3>
                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(selectedLog.timestamp).full}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-3">
                  <LogDetailCard label="User" value={selectedLog.user} />
                  <LogDetailCard label="Entity" value={selectedLog.entity} />
                  <LogDetailCard label="Entity ID" value={selectedLog.entityId} />
                  <LogDetailCard label="Action Type" value={selectedLog.actionType} />
                </div>

                {/* Before / After */}
                {selectedLog.before && (
                  <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Before</span>
                    </div>
                    <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs font-mono text-foreground/80">
                      {JSON.stringify(selectedLog.before, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.after && (
                  <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-emerald-600">
                      <Plus className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold uppercase tracking-wider">After</span>
                    </div>
                    <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs font-mono text-foreground/80">
                      {JSON.stringify(selectedLog.after, null, 2)}
                    </pre>
                  </div>
                )}

                {!selectedLog.before && !selectedLog.after && (
                  <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-4 text-center">
                    <p className="text-sm text-foreground/50">No state changes recorded for this action.</p>
                  </div>
                )}

                {/* Critical Badge */}
                {selectedLog.isCritical && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3"
                  >
                    <div className="mb-1 flex items-center gap-2 text-accent-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-semibold">Critical Action</span>
                    </div>
                    <p className="text-sm text-foreground/80">
                      This action has been flagged as critical and may require additional review.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LogDetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
      <p className="text-xs font-medium text-foreground/50">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

