"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/app/components/ui/use-toast"

import {
  TransactionsHeader,
  TransactionsFilters,
  TransactionsSummary,
  TransactionsTable,
  TransactionDrawer,
  BulkActionsBar,
  Pagination,
  TransactionsSkeleton,
} from "../Transactions"
import { useAuth } from "@/app/features/auth"

import type { Transaction, TransactionFilterState } from "../Transactions/types"
import {
  allTransactions,
  defaultFilters,
  filterTransactions,
  computeSummary,
} from "../Transactions/view-model"

const PAGE_SIZE = 15

export default function TransactionsPage() {
  const { isAuthenticated, isInitializing } = useAuth()
  const router = useRouter()

  const [filters, setFilters] = useState<TransactionFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [drawerTxn, setDrawerTxn] = useState<Transaction | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [transactions, setTransactions] = useState(allTransactions)
  const [isLoading] = useState(false)

  // Filter & paginate
  const filtered = useMemo(() => filterTransactions(transactions, filters), [transactions, filters])
  const summary = useMemo(() => computeSummary(filtered), [filtered])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
    setSelectedIds([])
  }, [filters])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.length === paginated.length ? [] : paginated.map((t) => t.id)
    )
  }, [paginated])

  const clearSelection = useCallback(() => setSelectedIds([]), [])

  const handleDelete = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
      setSelectedIds((prev) => prev.filter((i) => i !== id))
      toast({ title: "Deleted", description: "Transaction removed successfully" })
    },
    []
  )

  const handleBulkDelete = useCallback(() => {
    setTransactions((prev) => prev.filter((t) => !selectedIds.includes(t.id)))
      toast({ title: "Deleted", description: `${selectedIds.length} transactions removed` })
    setSelectedIds([])
  }, [selectedIds])

  const handleView = useCallback((txn: Transaction) => {
    setDrawerTxn(txn)
    setIsDrawerOpen(true)
  }, [])

  const handleEdit = useCallback((txn: Transaction) => {
    setDrawerTxn(txn)
    setIsDrawerOpen(true)
  }, [])

  const handleExportCSV = useCallback(() => {
    const headers = ["Date", "Description", "Category", "Account", "Type", "Amount"]
    const rows = filtered.map((t) => [
      t.date,
      t.description,
      t.category,
      t.account,
      t.type,
      t.amount,
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported", description: "CSV file downloaded" })
  }, [filtered])

  const handleExportPDF = useCallback(() => {
    toast({ title: "Coming soon", description: "PDF export will be available shortly" })
  }, [])

  const handleAddTransaction = useCallback(() => {
    toast({ title: "Coming soon", description: "Add Transaction modal will be available shortly" })
  }, [])

  if (isInitializing) return <TransactionsSkeleton />
  if (!isAuthenticated) {
    router.replace("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-4 md:p-6 xl:p-8">
        <TransactionsHeader
          onAddTransaction={handleAddTransaction}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />

        <TransactionsFilters filters={filters} onChange={setFilters} />

        <TransactionsSummary summary={summary} />

        {isLoading ? (
          <TransactionsSkeleton />
        ) : (
          <>
            <TransactionsTable
              transactions={paginated}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onDeleteAll={handleBulkDelete}
        onClear={clearSelection}
      />

      <TransactionDrawer
        transaction={drawerTxn}
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setDrawerTxn(null) }}
        onDelete={handleDelete}
      />
    </div>
  )
}

