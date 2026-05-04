"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Download,
  Eye,
  FileText,
  Filter,
  History,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react"

import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { useSecurityAuditLogs } from "@/app/features/security"
import type { AuditActionType, AuditLog } from "@/app/features/security"

const actionIconMap: Record<AuditActionType, typeof Plus> = {
  Create: Plus,
  Update: Pencil,
  Delete: Trash2,
}

const actionColorMap: Record<AuditActionType, string> = {
  Create: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
  Update: "border-blue-200/80 bg-blue-50 text-blue-700",
  Delete: "border-red-200/80 bg-red-50 text-red-700",
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function exportLogs(logs: AuditLog[]) {
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "security-audit-logs.json"
  link.click()
  window.URL.revokeObjectURL(url)
}

export default function AuditLogsPage() {
  const { data, error, isLoading } = useSecurityAuditLogs()
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState<"all" | AuditActionType>("all")

  const logs = data?.logs ?? []
  const uniqueUsers = useMemo(
    () => Array.from(new Set(logs.map((log) => log.user))),
    [logs],
  )
  const [filterUser, setFilterUser] = useState<"all" | string>("all")

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const search = searchQuery.trim().toLowerCase()
      const matchesSearch =
        search === "" ||
        log.action.toLowerCase().includes(search) ||
        log.entity.toLowerCase().includes(search) ||
        log.user.toLowerCase().includes(search)
      const matchesAction = filterAction === "all" || log.actionType === filterAction
      const matchesUser = filterUser === "all" || log.user === filterUser
      return matchesSearch && matchesAction && matchesUser
    })
  }, [filterAction, filterUser, logs, searchQuery])

  const criticalCount = filteredLogs.filter((log) => log.isCritical).length

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
            <History className="h-5 w-5 text-primary-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Audit Logs
            </h1>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            Live security-related audit history for logins and permission changes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="rounded-2xl"
            onClick={() => exportLogs(filteredLogs)}
            disabled={filteredLogs.length === 0}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Badge variant="accent" className="rounded-full">
            Live
          </Badge>
        </div>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load audit logs: {error.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-full border border-border/80 bg-background/60 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

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

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-foreground/40" />
          <select
            value={filterUser}
            onChange={(event) => setFilterUser(event.target.value)}
            className="rounded-full border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground outline-none transition focus:border-primary/50"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      {criticalCount > 0 ? (
        <Card variant="accent" padding="md">
          <CardContent className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-accent-foreground" />
            <p className="text-sm text-accent-foreground">
              <span className="font-semibold">{criticalCount} critical event(s)</span> are in the
              filtered result right now.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {filteredLogs.map((log) => {
          const ActionIcon = actionIconMap[log.actionType]

          return (
            <Card
              key={log.id}
              variant={log.isCritical ? "accent" : "ghost"}
              padding="md"
              className={`cursor-pointer transition hover:-translate-y-0.5 ${
                log.isCritical ? "border-accent/30" : "hover:border-primary/30"
              }`}
              onClick={() => setSelectedLog(log)}
            >
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${actionColorMap[log.actionType]}`}
                  >
                    <ActionIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{log.action}</span>
                      {log.isCritical ? (
                        <Badge variant="accent" className="rounded-full px-2 py-0.5 text-[10px]">
                          Critical
                        </Badge>
                      ) : null}
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
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Eye className="h-4 w-4 text-foreground/40" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!isLoading && filteredLogs.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-background/60 px-5 py-12 text-center text-sm text-foreground/50">
          No live audit entries match the current filters yet.
        </div>
      ) : null}

      {selectedLog ? (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-muted"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50">Action</p>
                <p className="mt-1 font-semibold text-foreground">{selectedLog.action}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50">User</p>
                <p className="mt-1 text-foreground">{selectedLog.user}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50">Timestamp</p>
                <p className="mt-1 text-foreground">{formatTimestamp(selectedLog.timestamp)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50">Entity</p>
                <p className="mt-1 text-foreground">
                  {selectedLog.entity} ({selectedLog.entityId})
                </p>
              </div>
              {selectedLog.before ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground/50">Before</p>
                  <pre className="mt-2 overflow-x-auto rounded-2xl bg-muted/50 p-3 text-xs text-foreground">
                    {JSON.stringify(selectedLog.before, null, 2)}
                  </pre>
                </div>
              ) : null}
              {selectedLog.after ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-foreground/50">After</p>
                  <pre className="mt-2 overflow-x-auto rounded-2xl bg-muted/50 p-3 text-xs text-foreground">
                    {JSON.stringify(selectedLog.after, null, 2)}
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
