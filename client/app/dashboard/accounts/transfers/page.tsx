"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Header from "../../accounts/TransfersPage/Header"
import Form from "../../accounts/TransfersPage/Form"
import BalancePreview from "../../accounts/TransfersPage/BalancePreview"
import RecentTransfers from "../../accounts/TransfersPage/RecentTransfers"
import DetailsDrawer from "../../accounts/TransfersPage/DetailsDrawer"

export default function TransfersPage() {
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    fromId: "",
    toId: "",
    amount: "",
  })

  const handleFormChange = (fromId: string, toId: string, amount: string) => {
    setFormState({ fromId, toId, amount })
  }

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <Header
        onNewTransfer={() => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        onRefresh={() => window.location.reload()}
      />

      {/* Form + Balance Preview Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Form
          onSubmit={(transfer) => {
            console.log("Transfer submitted:", transfer)
            alert("Transfer submitted! (Demo mode)")
          }}
        />
        <BalancePreview
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
              console.log("Edit transfer:", id)
              alert("Edit transfer (Demo mode)")
            }}
            onDelete={(id) => {
              console.log("Delete transfer:", id)
              if (confirm("Are you sure you want to delete this transfer?")) {
                setSelectedTransferId(null)
                alert("Transfer deleted (Demo mode)")
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

