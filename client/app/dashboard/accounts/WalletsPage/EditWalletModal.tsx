"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Wallet,
  Banknote,
  Smartphone,
  Gift,
  DollarSign,
  FileText,
  Check,
  Loader2,
} from "lucide-react"
import { useUpdateAccount, useAccount } from "@/app/features/accounts/hooks/use-accounts"
import type { BankAccount } from "@/app/features/accounts/api"
import { useToast } from "@/app/components/ui/use-toast"

interface EditWalletModalProps {
  isOpen: boolean
  walletId: string | null
  onClose: () => void
}

const walletTypes = [
  { id: "cash", label: "Cash", icon: Banknote, color: "bg-emerald-100 text-emerald-600" },
  { id: "digital", label: "Digital", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { id: "gift_card", label: "Gift Card", icon: Gift, color: "bg-violet-100 text-violet-600" },
] as const

type WalletType = "cash" | "digital" | "gift_card"

export default function EditWalletModal({ isOpen, walletId, onClose }: EditWalletModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    currency: "INR",
    notes: "",
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [initialType, setInitialType] = useState<WalletType>("cash")

  const { data: walletData, isLoading: isFetching } = useAccount(walletId || "")
  const { mutateAsync: updateAccount } = useUpdateAccount()
  const { toast } = useToast()

  // Load wallet data when modal opens
  useEffect(() => {
    if (walletData && isOpen) {
      setFormData({
        name: walletData.name || "",
        balance: walletData.balance?.toString() || "0",
        currency: walletData.currency || "INR",
        notes: walletData.institution || "",
        isActive: walletData.isActive ?? true,
      })
      // Try to determine type from name or default
      const nameLower = walletData.name?.toLowerCase() || ""
      if (nameLower.includes("gift")) {
        setInitialType("gift_card")
      } else if (nameLower.includes("paytm") || nameLower.includes("phonepe") || nameLower.includes("gpay") || nameLower.includes("google")) {
        setInitialType("digital")
      } else {
        setInitialType("cash")
      }
    }
  }, [walletData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter wallet name",
        variant: "destructive",
      })
      return
    }

    if (!walletId) {
      toast({
        title: "Error",
        description: "Wallet ID is missing",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await updateAccount({
        id: walletId,
        data: {
          name: formData.name,
          balance: parseFloat(formData.balance) || 0,
          currency: formData.currency,
          institution: formData.notes || undefined,
          isActive: formData.isActive,
        },
      })

      toast({
        title: "Success",
        description: "Wallet updated successfully!",
      })

      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      balance: "",
      currency: "INR",
      notes: "",
      isActive: true,
    })
    setInitialType("cash")
    onClose()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-4 right-4 top-1/2 z-50 mx-auto w-full max-w-lg -translate-y-1/2 overflow-hidden rounded-[1.5rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] shadow-2xl backdrop-blur-xl md:left-1/2 md:-translate-x-1/2 dark:bg-[linear-gradient(180deg,rgba(30,30,30,0.98),rgba(20,20,20,0.92))]"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between border-b border-border/60 bg-background/50 px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Edit Wallet</h2>
                  <p className="text-xs text-foreground/60">Update wallet details</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-foreground/70 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
              {isFetching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Wallet Type Display (read-only) */}
                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-foreground">
                      Wallet Type
                    </label>
                    <div className="flex gap-2">
                      {walletTypes.map((type) => {
                        const isSelected = initialType === type.id
                        return (
                          <div
                            key={type.id}
                            className={`flex flex-1 items-center gap-2 rounded-2xl border px-3 py-3 ${
                              isSelected
                                ? "border-blue-500/60 bg-blue-50/80 dark:bg-blue-900/20"
                                : "border-border/60 bg-background/50 opacity-50"
                            }`}
                          >
                            <type.icon className={`h-4 w-4 ${type.color}`} />
                            <span className="text-xs font-medium text-foreground/80">
                              {type.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <p className="mt-1 text-[10px] text-foreground/50">
                      Wallet type cannot be changed
                    </p>
                  </div>

                  {/* Wallet Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Wallet Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g., Cash in Hand"
                        className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-background/80"
                      />
                    </div>
                  </div>

                  {/* Balance */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Current Balance
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                      <input
                        type="number"
                        value={formData.balance}
                        onChange={(e) => handleInputChange("balance", e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-background/80"
                      />
                    </div>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 px-4 text-sm text-foreground focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-background/80"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 p-4 dark:bg-background/80">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active</p>
                      <p className="text-xs text-foreground/50">
                        Inactive wallets won't appear in lists
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange("isActive", !formData.isActive)}
                      className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                        formData.isActive ? "bg-emerald-500" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          formData.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-foreground/40" />
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Add any notes about this wallet..."
                        rows={3}
                        className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none dark:bg-background/80"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flex flex-col gap-2.5 sm:flex-row"
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleClose}
                  className="flex-1 rounded-2xl border border-border/60 bg-background/50 px-5 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-background dark:bg-background/50 dark:hover:bg-background"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isFetching}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
