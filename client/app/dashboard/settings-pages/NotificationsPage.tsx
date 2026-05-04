"use client"

import { motion } from "framer-motion"
import { BellRing, Mail, Save, ShieldAlert, Smartphone } from "lucide-react"

import { useToast } from "@/app/components/ui/use-toast"
import { useMarkAllNotificationsRead, useNotifications } from "@/app/features/notifications"
import { useUpdateUserSettings, useUserSettings } from "@/app/features/settings"

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  icon: typeof Mail
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-background/50 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-xs leading-5 text-foreground/55">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`flex h-7 w-12 items-center rounded-full border px-0.5 transition ${
          checked ? "border-emerald-300 bg-emerald-50" : "border-border/70 bg-background"
        }`}
      >
        <span
          className={`h-5.5 w-5.5 rounded-full shadow-sm transition ${
            checked ? "translate-x-[18px] bg-emerald-500" : "translate-x-0 bg-white"
          }`}
        />
      </button>
    </div>
  )
}

export default function NotificationsPage() {
  const { data, error } = useUserSettings()
  const updateSettings = useUpdateUserSettings()
  const { data: notificationFeed } = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()
  const { toast } = useToast()

  const handleToggle = async (patch: Record<string, boolean>) => {
    await updateSettings.mutateAsync(patch)
    toast({
      title: "Notification settings updated",
      description: "Your alert preferences were saved in real time.",
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Notifications</h1>
          </div>
          <p className="mt-1 text-sm text-foreground/60">Control which real alerts reach you and review the latest live notification feed.</p>
        </div>
        <button
          type="button"
          onClick={() => markAllRead.mutate()}
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/75 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-white/80"
        >
          <Save className="h-4 w-4" />
          Mark All Read
        </button>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load notification settings: {error.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <ToggleRow label="Email notifications" description="Receive important finance summaries and alert emails." checked={data?.emailNotifications ?? true} onChange={(value) => handleToggle({ emailNotifications: value })} icon={Mail} />
          <ToggleRow label="Push notifications" description="Show live in-app and device-oriented notification activity." checked={data?.pushNotifications ?? true} onChange={(value) => handleToggle({ pushNotifications: value })} icon={Smartphone} />
          <ToggleRow label="Weekly digest" description="Get one concise summary of your recent money movement each week." checked={data?.weeklyDigest ?? false} onChange={(value) => handleToggle({ weeklyDigest: value })} icon={BellRing} />
          <ToggleRow label="Budget alerts" description="Trigger notifications for spending thresholds and overages." checked={data?.budgetAlerts ?? true} onChange={(value) => handleToggle({ budgetAlerts: value })} icon={BellRing} />
          <ToggleRow label="Security alerts" description="Notify immediately for suspicious login or permissions changes." checked={data?.securityAlerts ?? true} onChange={(value) => handleToggle({ securityAlerts: value })} icon={ShieldAlert} />
        </div>

        <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground">Live Feed</h2>
          <p className="mt-1 text-sm text-foreground/50">
            {notificationFeed?.unreadCount ?? 0} unread notification(s) in your real account feed.
          </p>

          <div className="mt-5 space-y-3">
            {(notificationFeed?.notifications ?? []).slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  {!item.read ? <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">New</span> : null}
                </div>
                <p className="mt-1 text-xs leading-5 text-foreground/55">{item.message}</p>
              </div>
            ))}

            {(notificationFeed?.notifications ?? []).length === 0 ? (
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-6 text-center text-sm text-foreground/50">
                No notifications yet. Your live alerts will appear here as backend events arrive.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
