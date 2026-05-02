"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import Header from "../CreditCardsPage/Header"
import Utilization from "../CreditCardsPage/Utilization"
import CardsList from "../CreditCardsPage/CardsList"
import Billing from "../CreditCardsPage/Billing"
import Payments from "../CreditCardsPage/Payments"
import AddCardModal from "../CreditCardsPage/AddCardModal"

import { useCreditCardAccounts, useUpdateBalance, useDeleteAccount } from "@/app/features/accounts"
import { useToast } from "@/app/components/ui/use-toast"
import type { CreditCard } from "../types"

export default function CreditCardsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: cardsData, isLoading, refetch } = useCreditCardAccounts()
  const updateBalance = useUpdateBalance()
  const deleteAccount = useDeleteAccount()
  const { toast } = useToast()

  // Transform backend data to CreditCard format
  const cards: CreditCard[] = (cardsData || []).map((acc) => ({
    id: acc.id,
    cardName: acc.name,
    bankName: acc.institution || "Unknown Bank",
    cardNumberLast4: acc.accountNumber || "0000",
    limit: acc.balance + (acc.balance > 0 ? 100000 : 0), // Approximate limit if balance = used
    used: acc.balance,
    currency: acc.currency,
    dueDate: acc.asOfDate.split("T")[0],
    minimumDue: acc.balance * 0.05, // 5% minimum
    status: "active" as const,
  }))

  const totalLimit = cards.reduce((sum, c) => sum + c.limit, 0)
  const totalUsed = cards.reduce((sum, c) => sum + c.used, 0)
  const totalAvailable = totalLimit - totalUsed
  const overallUtilization = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0

  const handleRefresh = () => {
    refetch()
    toast({ title: "Data refreshed", description: "Credit cards data updated from server." })
  }

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Delete this credit card?")) return
    try {
      await deleteAccount.mutateAsync(id)
      toast({ title: "Card deleted", description: "Credit card has been removed." })
    } catch {
      toast({ title: "Delete failed", description: "Could not delete card.", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="space-y-6 p-4 md:p-6 xl:p-8">
          <div className="animate-pulse">
            <div className="h-16 w-64 rounded-2xl bg-muted" />
            <div className="mt-6 h-32 rounded-2xl bg-muted" />
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="h-48 rounded-2xl bg-muted" />
              <div className="h-48 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        {/* Header */}
        <Header
          onAddCard={() => setIsAddModalOpen(true)}
          onRefresh={handleRefresh}
        />

        {/* Utilization Summary */}
        <Utilization
          totalLimit={totalLimit}
          totalUsed={totalUsed}
          totalAvailable={totalAvailable}
          utilization={overallUtilization}
          cardCount={cards.length}
        />

        {/* Cards List */}
        <CardsList cards={cards} onDelete={handleDeleteCard} />

{/* Billing & Due Section */}
        {cards.length > 0 && <Billing cards={cards} />}

        {/* Payment Actions */}
        <Payments
          onPayBill={() => console.log("Pay Bill clicked")}
          onRecordPayment={() => console.log("Record Payment clicked")}
          onEditLimit={() => console.log("Edit Limit clicked")}
        />
      </div>

      {/* Add Card Modal */}
      <AddCardModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}

