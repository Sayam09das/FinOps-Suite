"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  CreditCard,
  Landmark,
  Hash,
  DollarSign,
  Calendar,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react"
import { useCreateAccount } from "@/app/features/accounts/hooks/use-accounts"
import { useToast } from "@/app/components/ui/use-toast"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    cardName: "",
    bankName: "",
    cardNumberLast4: "",
    limit: "",
    dueDate: "",
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
        description: "Please enter card name",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Create as credit_card type account
      await createAccount({
        name: formData.cardName || formData.name,
        type: "credit_card",
        balance: parseFloat(formData.limit) || 0, // Used amount starts at 0
        currency: formData.currency,
        institution: formData.bankName || undefined,
        accountNumber: formData.cardNumberLast4 || undefined,
      })

      toast({
        title: "Success",
        description: "Credit card added successfully!",
      })

      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add credit card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      cardName: "",
      bankName: "",
      cardNumberLast4: "",
      limit: "",
      dueDate: "",
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
            className="fixed left-4 right-4 top-1/2 z-50 mx-auto w-full max-w-lg -translate-y-1/2 overflow-hidden rounded-[1.5rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] shadow-2xl backdrop-blur-xl md:left-1/2 md:-translate-x-1/2 dark:bg-[linear-gradient(180deg,rgba(15,15,20,0.98),rgba(15,15,20,0.92))]"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between border-b border-border/60 bg-background/50 px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30">
                  <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Add Credit Card</h2>
                  <p className="text-xs text-foreground/60">Track a new credit card</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-foreground/70 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Card Nickname */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Card Nickname <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., My HDFC Card"
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                {/* Bank Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Issuing Bank
                  </label>
                  <div className="relative">
                    <Landmark className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      placeholder="e.g., HDFC Bank"
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                {/* Card Number (Last 4 digits) */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Card Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      value={formData.cardNumberLast4}
                      onChange={(e) => handleInputChange("cardNumberLast4", e.target.value)}
                      placeholder="Last 4 digits"
                      maxLength={4}
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                {/* Credit Limit */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Credit Limit
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="number"
                      value={formData.limit}
                      onChange={(e) => handleInputChange("limit", e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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
                      placeholder="Add any notes about this card..."
                      rows={3}
                      className="w-full rounded-2xl border border-border/60 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
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
                  className="flex-1 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60 dark:shadow-violet-900/30"
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
                    "Add Card"
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
