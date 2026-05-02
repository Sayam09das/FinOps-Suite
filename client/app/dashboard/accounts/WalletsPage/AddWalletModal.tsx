"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useCreateAccount } from "@/app/features/accounts/hooks/use-accounts"
import { useToast } from "@/app/components/ui/use-toast"

interface AddWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const walletTypes = [
  { id: "cash", label: "Cash", icon: Banknote, color: "bg-emerald-100 text-emerald-600" },
  { id: "digital", label: "Digital", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { id: "gift_card", label: "Gift Card", icon: Gift, color: "bg-violet-100 text-violet-600" },
] as const

export default function AddWalletModal({ isOpen, onClose }: AddWalletModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    walletType: "cash" as typeof walletTypes[number]["id"],
    balance: "",
    currency: "INR",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { mutateAsync: createAccount } = useCreateAccount()
  const { toast } = useToast()

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

    setIsSubmitting(true)
    try {
      await createAccount({
        name: formData.name,
        type: "wallet" as const,
        balance: parseFloat(formData.balance) || 0,
        currency: formData.currency,
        institution: formData.notes || undefined,
      })

      toast({
        title: "Success",
        description: "Wallet added successfully!",
      })

      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      walletType: "cash",
      balance: "",
      currency: "INR",
      notes: "",
    })
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
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
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Add Wallet</h2>
                  <p className="text-xs text-foreground/60">Add a new wallet to track</p>
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
              <div className="space-y-5">
                {/* Wallet Type Selection */}
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-foreground">
                    Wallet Type
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {walletTypes.map((type, index) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange("walletType", type.id)}
                        className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3.5 transition ${
                          formData.walletType === type.id
                            ? "border-emerald-500/60 bg-emerald-50/80 dark:bg-emerald-900/20"
                            : "border-border/60 bg-background/50 hover:border-border hover:bg-background"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${type.color}`}
                        >
                          <type.icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-medium text-foreground/80">
                          {type.label}
                        </span>
                        {formData.walletType === type.id && (
                          <motion.div
                            layoutId="check-wallet"
                            className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500"
                          >
                            <Check className="h-2.5 w-2.5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
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
                      placeholder={
                        formData.walletType === "cash"
                          ? "e.g., Cash in Hand"
                          : formData.walletType === "digital"
                          ? "e.g., Paytm Wallet"
                          : "e.g., Amazon Gift Card"
                      }
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-background/80"
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
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-background/80"
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
                    className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 px-4 text-sm text-foreground focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-background/80"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
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
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none dark:bg-background/80"
                    />
                  </div>
                </div>
              </div>

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
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex-1 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Adding...
                    </span>
                  ) : (
                    "Add Wallet"
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
