"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, Landmark } from "lucide-react"

import { cn } from "@/app/lib/utils/cn"
import { ACCOUNT_CONFIG } from "../AllTransactions/view-model"

interface AccountSelectProps {
  value: string
  onChange: (account: string) => void
}

export default function AccountSelect({ value, onChange }: AccountSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const accounts = Object.keys(ACCOUNT_CONFIG)
  const selectedConfig = ACCOUNT_CONFIG[value]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3.5 text-left transition hover:bg-white/70",
          isOpen && "border-primary/50 ring-2 ring-primary/10"
        )}
      >
        {selectedConfig ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <selectedConfig.icon className="h-5 w-5" style={{ color: selectedConfig.color }} />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <Landmark className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{value || "Select account"}</p>
          <p className="text-xs text-foreground/50">Bank, wallet, or card</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-foreground/40 transition", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border/70 bg-white/95 shadow-[0_20px_60px_rgba(33,49,43,0.12)] backdrop-blur-xl"
            >
              <div className="max-h-56 overflow-y-auto p-2">
                {accounts.map((accName, i) => {
                  const config = ACCOUNT_CONFIG[accName]
                  const isSelected = value === accName
                  return (
                    <motion.button
                      key={accName}
                      type="button"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        onChange(accName)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                        isSelected ? "bg-primary/8" : "hover:bg-muted/60"
                      )}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <config.icon className="h-4 w-4" style={{ color: config.color }} />
                      </div>
                      <span className="flex-1 text-sm font-medium">{accName}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

