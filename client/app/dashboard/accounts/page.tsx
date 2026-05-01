"use client"

import { useState } from "react"
import { useBankAccounts, useTotalBalance, useDeleteAccount, useUpdateAccount } from "@/app/features/accounts"
import { useToast } from "@/app/components/ui/use-toast"

import Header from "./BankAccountsPage/Header"
import TotalBalance from "./BankAccountsPage/TotalBalance"
import AccountsList from "./BankAccountsPage/AccountsList"
import Activity from "./BankAccountsPage/Activity"
import DetailsDrawer from "./BankAccountsPage/DetailsDrawer"

import type { BankAccount } from "./types"

export default function BankAccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { toast } = useToast()

  // Fetch real data from backend
  const { data: accounts, isLoading, refetch } = useBankAccounts()
  const { data: balanceData } = useTotalBalance()
  const deleteAccount = useDeleteAccount()
  const updateAccount = useUpdateAccount()

  // Transform backend data to frontend format
  const bankAccounts: BankAccount[] = (accounts || []).map((acc) => ({
    id: acc.id,
    bankName: acc.institution || acc.name,
    accountType: acc.type === "bank" ? "Savings" : 
                acc.type === "cash" ? "Current" :
                acc.type === "investment" ? "Fixed Deposit" : "Savings" as const,
    accountNumber: acc.accountNumber || "",
    balance: acc.balance,
    currency: acc.currency,
    status: acc.isActive ? "active" : "inactive" as const,
    lastUpdated: acc.updatedAt,
    notes: undefined,
    history: [],
  }))

  const totalBalance = balanceData?.totalBalance ?? bankAccounts.reduce((sum, a) => sum + a.balance, 0)
  
  // Generate mock history for chart (in production, this would come from backend)
  const totalHistory = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i) * 7)
    return {
      date: d.toISOString().split("T")[0],
      balance: totalBalance * (0.85 + Math.random() * 0.3),
    }
  })

  const handleView = (account: BankAccount) => {
    setSelectedAccount(account)
    setIsDrawerOpen(true)
  }

  const handleEdit = async (account: BankAccount) => {
    // For now just show a toast - in production would open edit modal
    toast({
      title: "Edit Account",
      description: `Editing ${account.bankName}`,
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount.mutateAsync(id)
        toast({
          title: "Success",
          description: "Account deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account",
          variant: "destructive",
        })
      }
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header
        onAddAccount={() => alert("Add Account - Coming soon!")}
        onRefresh={handleRefresh}
      />

      <TotalBalance
        total={totalBalance}
        changePercent={3.2}
        history={totalHistory}
        currency="INR"
      />

      <AccountsList
        accounts={bankAccounts}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Activity section would need API endpoint for transactions */}
      <Activity activities={[]} />

      <DetailsDrawer
        account={selectedAccount}
        activities={[]}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

