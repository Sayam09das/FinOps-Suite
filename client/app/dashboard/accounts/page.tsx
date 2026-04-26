"use client"

import { useState } from "react"

import Header from "./BankAccountsPage/Header"
import TotalBalance from "./BankAccountsPage/TotalBalance"
import AccountsList from "./BankAccountsPage/AccountsList"
import Activity from "./BankAccountsPage/Activity"
import DetailsDrawer from "./BankAccountsPage/DetailsDrawer"

import { demoBankAccounts, demoActivities } from "./demo-data"
import type { BankAccount } from "./types"

export default function BankAccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const totalBalance = demoBankAccounts.reduce((sum, a) => sum + a.balance, 0)
  const totalHistory = demoBankAccounts[0]?.history || []

  const handleView = (account: BankAccount) => {
    setSelectedAccount(account)
    setIsDrawerOpen(true)
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header
        onAddAccount={() => alert("Add Account — demo mode")}
        onRefresh={() => window.location.reload()}
      />

      <TotalBalance
        total={totalBalance}
        changePercent={3.2}
        history={totalHistory}
        currency="INR"
      />

      <AccountsList
        accounts={demoBankAccounts}
        onView={handleView}
        onEdit={(acc) => alert(`Edit ${acc.bankName} — demo mode`)}
        onDelete={(id) => {
          if (confirm("Delete this account?")) {
            alert(`Deleted ${id} — demo mode`)
          }
        }}
      />

      <Activity activities={demoActivities} />

      <DetailsDrawer
        account={selectedAccount}
        activities={demoActivities}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}

