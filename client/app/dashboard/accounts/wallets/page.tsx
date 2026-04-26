"use client"

import { useState } from "react"

import Header from "../WalletsPage/Header"
import Summary from "../WalletsPage/Summary"
import List from "../WalletsPage/List"
import QuickUpdate from "../WalletsPage/QuickUpdate"

import { demoWallets } from "../demo-data"

export default function WalletsPage() {
  const [wallets, setWallets] = useState(demoWallets)

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  const handleQuickUpdate = (id: string, newBalance: number) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, balance: newBalance, lastUpdated: new Date().toISOString() } : w))
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header
        onAddWallet={() => alert("Add Wallet — demo mode")}
        onRefresh={() => window.location.reload()}
      />

      <Summary total={totalBalance} count={wallets.length} currency="INR" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <List
            wallets={wallets}
            onEdit={(w) => alert(`Edit ${w.name} — demo mode`)}
            onDelete={(id) => {
              if (confirm("Delete this wallet?")) {
                setWallets((prev) => prev.filter((w) => w.id !== id))
              }
            }}
          />
        </div>
        <div>
          <QuickUpdate wallets={wallets} onUpdate={handleQuickUpdate} />
        </div>
      </div>
    </div>
  )
}

