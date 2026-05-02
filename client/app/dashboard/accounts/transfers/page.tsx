"use client"

import { useState, useMemo, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Header from "../TransfersPage/Header"
import Form from "../TransfersPage/Form"
import BalancePreview from "../TransfersPage/BalancePreview"
import RecentTransfers from "../TransfersPage/RecentTransfers"
import DetailsDrawer from "../TransfersPage/DetailsDrawer"
import { useBankAccounts, useWalletAccounts } from "@/app/features/accounts"
import { useCreateTransfer, useRecentTransfers } from "@/app/features/transfers"
import { useToast } from "@/app/components/ui/use-toast"
import type { TransferAccount } from "../TransfersPage/BalancePreview"

export default function TransfersPage() {
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    fromId: "",
    toId: "",
    amount: "",
  })
  const { toast } = useToast()

// Fetch accounts from backend - skip if data is cached to ensure fresh
  const { data: bankAccounts, isLoading: banksLoading, refetch: refetchBanks } = useBankAccounts()
  const { data: walletAccounts, isLoading: walletsLoading, refetch: refetchWallets } = useWalletAccounts()
  
  // Fetch recent transfers
  const { refetch: refetchTransfers } = useRecentTransfers(5)

  // Ensure real-time data on first load by refetching accounts
  useEffect(() => {
    refetchBanks()
    refetchWallets()
  }, [])

  // Combine banks and wallets into single accounts list
  const accounts: TransferAccount[] = useMemo(() => {
    const combined: TransferAccount[] = [
      ...(bankAccounts || []).map((acc) => ({
        id: acc.id,
        name: acc.name,
        type: "bank" as const,
        balance: acc.balance,
        currency: acc.currency,
      })),
      ...(walletAccounts || []).map((acc) => ({
        id: acc.id,
        name: acc.name,
        type: "wallet" as const,
        balance: acc.balance,
        currency: acc.currency,
      })),
    ]
    return combined
  }, [bankAccounts, walletAccounts])

  // Create transfer mutation
  const createTransfer = useCreateTransfer()
  const isLoading = banksLoading || walletsLoading || createTransfer.isPending

  const handleFormChange = (fromId: string, toId: string, amount: string) => {
    setFormState({ fromId, toId, amount })
  }

  const handleSubmit = async (transfer: {
    fromAccountId: string
    toAccountId: string
    amount: number
    currency?: string
    notes?: string
  }) => {
    try {
      await createTransfer.mutateAsync({
        fromAccountId: transfer.fromAccountId,
        toAccountId: transfer.toAccountId,
        amount: transfer.amount,
        currency: transfer.currency || "INR",
        notes: transfer.notes,
      })
      
      toast({
        title: "Transfer successful",
        description: `Successfully transferred ₹${transfer.amount.toLocaleString("en-IN")}`,
      })
      
      // Refresh transfers list
      refetchTransfers()
      
      // Reset form state
      setFormState({ fromId: "", toId: "", amount: "" })
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: "Failed to process transfer. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header
        onNewTransfer={() => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onRefresh={() => refetchTransfers()}
      />

      {/* Form + Balance Preview Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Form
          accounts={accounts}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        <BalancePreview
          accounts={accounts}
          fromId={formState.fromId}
          toId={formState.toId}
          amount={formState.amount}
        />
      </div>

      {/* Recent Transfers */}
      <RecentTransfers onSelectTransfer={(id) => setSelectedTransferId(id)} />

      {/* Details Drawer */}
      <AnimatePresence>
        {selectedTransferId && (
          <DetailsDrawer
            transferId={selectedTransferId}
            onClose={() => setSelectedTransferId(null)}
            onEdit={(id) => {
              toast({
                title: "Edit transfer",
                description: "Edit functionality coming soon!",
              })
            }}
            onDelete={(id) => {
              toast({
                title: "Transfer deleted",
                description: "Delete functionality coming soon!",
              })
              setSelectedTransferId(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

