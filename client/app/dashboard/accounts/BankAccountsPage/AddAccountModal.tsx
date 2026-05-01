"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Landmark,
  Wallet,
  Building2,
  CreditCard,
  PiggyBank,
  TrendingUp,
  DollarSign,
  Hash,
  Building,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react"
import { useCreateAccount } from "@/app/features/accounts/hooks/use-accounts"
import { useToast } from "@/app/components/ui/use-toast"

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

const accountTypes = [
  { id: "Savings", label: "Savings", icon: PiggyBank, color: "bg-blue-100 text-blue-600" },
  { id: "Current", label: "Current", icon: Building2, color: "bg-emerald-100 text-emerald-600" },
  { id: "Fixed Deposit", label: "Fixed Deposit", icon: TrendingUp, color: "bg-violet-100 text-violet-600" },
  { id: "Recurring Deposit", label: "Recurring Deposit", icon: Wallet, color: "bg-amber-100 text-amber-600" },
] as const

const BACKEND_TYPE_MAP: Record<string, "bank" | "investment"> = {
  Savings: "bank",
  Current: "bank",
  "Fixed Deposit": "investment",
  "Recurring Deposit": "investment",
}

export default function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    accountType: "Savings" as typeof accountTypes[number]["id"],
    accountNumber: "",
    balance: "",
    institution: "",
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
        description: "Please enter account name",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createAccount({
        name: formData.name,
        type: BACKEND_TYPE_MAP[formData.accountType] || "bank",
        balance: parseFloat(formData.balance) || 0,
        currency: "INR",
        institution: formData.institution || undefined,
        accountNumber: formData.accountNumber || undefined,
      })

      toast({
        title: "Success",
        description: "Account added successfully!",
      })

      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      accountType: "Savings",
      accountNumber: "",
      balance: "",
      institution: "",
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
            className="fixed left-4 right-4 top-1/2 z-50 mx-auto w-full max-w-lg -translate-y-1/2 overflow-hidden rounded-[1.5rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] shadow-2xl backdrop-blur-xl md:left-1/2 md:-translate-x-1/2"
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
                  <Landmark className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Add Bank Account</h2>
                  <p className="text-xs text-foreground/60">Add a new account to track</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-foreground/70 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Account Type Selection */}
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-foreground">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {accountTypes.map((type, index) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange("accountType", type.id)}
                        className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3.5 transition ${
                          formData.accountType === type.id
                            ? "border-emerald-500/60 bg-emerald-50/80"
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
                        {formData.accountType === type.id && (
                          <motion.div
                            layoutId="check"
                            className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500"
                          >
                            <Check className="h-2.5 w-2.5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Account Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Account Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Landmark className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., HDFC Salary Account"
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Institution / Bank Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Bank / Institution
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value)}
                      placeholder="e.g., HDFC Bank"
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Account Number */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Account Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      placeholder="Last 4 digits or full number"
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
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
                      placeholder="Add any notes about this account..."
                      rows={3}
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
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
                  className="flex-1 rounded-2xl border border-border/60 bg-background/50 px-5 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-background"
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
                    "Add Account"
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
