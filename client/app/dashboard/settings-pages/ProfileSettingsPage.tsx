"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BadgeCheck, Mail, Save, Settings2, ShieldCheck, UserRound } from "lucide-react"

import { useToast } from "@/app/components/ui/use-toast"
import { useUpdateUserSettings, useUserSettings } from "@/app/features/settings"

export default function ProfileSettingsPage() {
  const { data, error } = useUserSettings()
  const updateSettings = useUpdateUserSettings()
  const { toast } = useToast()
  const [name, setName] = useState("")

  useEffect(() => {
    setName(data?.name || "")
  }, [data?.name])

  const handleSave = async () => {
    await updateSettings.mutateAsync({ name })
    toast({
      title: "Profile updated",
      description: "Your display identity was saved successfully.",
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary-foreground" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Profile Settings</h1>
          </div>
          <p className="mt-1 text-sm text-foreground/60">Manage the identity details used across your dashboard.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </motion.div>

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Failed to load profile settings: {error.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
              <UserRound className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
              <p className="text-sm text-foreground/50">These values come from your real account record.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">Display name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                placeholder="Your name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/55 px-4 py-3 text-sm text-foreground/70">
                <Mail className="h-4 w-4 text-foreground/45" />
                {data?.email || "Loading..."}
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground">Account Status</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <span className="text-sm text-foreground/65">Role</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {data?.role || "USER"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <span className="text-sm text-foreground/65">Auth Provider</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {data?.provider || "Credentials"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground">Created</h2>
            <p className="mt-3 text-sm text-foreground/60">
              {data?.createdAt ? new Date(data.createdAt).toLocaleString("en-IN") : "Loading account metadata..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
