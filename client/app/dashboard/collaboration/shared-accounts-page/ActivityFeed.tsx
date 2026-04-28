"use client"

import { motion } from "framer-motion"
import {
  Plus,
  Pencil,
  UserPlus,
  Settings,
  IndianRupee,
  Clock,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Activity } from "../types"

interface ActivityFeedProps {
  activities: Activity[]
}

const actionConfig: Record<
  string,
  { icon: typeof Plus; color: string; bg: string }
> = {
  added: { icon: Plus, color: "text-emerald-600", bg: "bg-emerald-50" },
  updated: { icon: Pencil, color: "text-sky-600", bg: "bg-sky-50" },
  joined: { icon: UserPlus, color: "text-violet-600", bg: "bg-violet-50" },
  created: { icon: Settings, color: "text-amber-600", bg: "bg-amber-50" },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const listItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const sorted = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          Activity Feed
        </h3>
        <div className="flex h-7 items-center gap-1 rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-600">
          <IndianRupee className="h-3 w-3" />
          Transparency
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative space-y-3"
      >
        {/* timeline line */}
        <div className="absolute left-[1.15rem] top-2 h-[calc(100%-1rem)] w-px bg-border/60" />

        {sorted.map((activity) => {
          const config = actionConfig[activity.action] || actionConfig.updated
          const Icon = config.icon

          return (
            <motion.div
              key={activity.id}
              variants={listItem}
              className="relative flex items-start gap-3 pl-1"
            >
              {/* dot on timeline */}
              <div
                className={`relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bg}`}
              >
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
              </div>

              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{activity.userName}</span>{" "}
                  <span className="text-foreground/70">{activity.description}</span>
                </p>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-foreground/40">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

