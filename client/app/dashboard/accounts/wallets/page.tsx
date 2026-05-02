"use client"

import { useState } from "react"

import Header from "../WalletsPage/Header"
import Summary from "../WalletsPage/Summary"
import List from "../WalletsPage/List"
import QuickUpdate from "../WalletsPage/QuickUpdate"
import AddWalletModal from "../WalletsPage/AddWalletModal"
import EditWalletModal from "../WalletsPage/EditWalletModal"

import { useWalletAccounts, useUpdateBalance, useDeleteAccount } from "@/app/features/accounts"
import { useToast } from "@/app/components/ui/use-toast"
import type { Wallet } from "../types"

export default function WalletsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null)

  const { data: walletsData, isLoading, refetch } = useWalletAccounts()
  const updateBalance = useUpdateBalance()
  const deleteAccount = useDeleteAccount()
  const { toast } = useToast()

  // Transform backend data to Wallet format
  const wallets: Wallet[] = (walletsData || []).map((acc) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type as Wallet["type"],
    balance: acc.balance,
    currency: acc.currency,
    lastUpdated: acc.asOfDate,
    notes: acc.institution || undefined,
  }))

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  const handleQuickUpdate = async (id: string, newBalance: number) => {
    const wallet = wallets.find((w) => w.id === id)
    if (!wallet) return

    const diff = newBalance - wallet.balance
    try {
      await updateBalance.mutateAsync({
        id,
        amount: Math.abs(diff),
        operation: diff > 0 ? "add" : "subtract",
      })
      toast({ title: "Wallet updated", description: `${wallet.name} balance updated successfully.` })
    } catch {
      toast({ title: "Update failed", description: "Could not update wallet balance.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this wallet?")) return
    try {
      await deleteAccount.mutateAsync(id)
      toast({ title: "Wallet deleted", description: "Wallet has been removed." })
    } catch {
      toast({ title: "Delete failed", description: "Could not delete wallet.", variant: "destructive" })
    }
  }

  const handleRefresh = () => {
    refetch()
    toast({ title: "Data refreshed", description: "Wallets data updated from server." })
  }

  const handleEditWallet = (wallet: Wallet) => {
    setEditingWalletId(wallet.id)
  }

  const handleCloseEditModal = () => {
    setEditingWalletId(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        <div className="animate-pulse">
          <div className="h-16 w-64 rounded-2xl bg-muted" />
          <div className="mt-6 h-24 rounded-2xl bg-muted" />
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-muted" />
              ))}
            </div>
            <div className="h-64 rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header onAddWallet={() => setIsAddModalOpen(true)} onRefresh={handleRefresh} />

      <Summary total={totalBalance} count={wallets.length} currency="INR" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <List wallets={wallets} onEdit={handleEditWallet} onDelete={handleDelete} />
        </div>
        <div>
          <QuickUpdate wallets={wallets} onUpdate={handleQuickUpdate} />
        </div>
      </div>

      {/* Add Wallet Modal */}
      <AddWalletModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Edit Wallet Modal */}
      <EditWalletModal
        isOpen={!!editingWalletId}
        walletId={editingWalletId}
        onClose={handleCloseEditModal}
      />
    </div>
  )
}

