"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "@/app/components/ui/use-toast"
import { api } from "@/app/lib/api/client"
import { ENDPOINTS } from "@/app/lib/api/endpoints"
import { useTransactionsQuery } from "@/app/lib/api/queries"

import {
  TransactionsHeader,
  TransactionsFilters,
  TransactionsSummary,
  TransactionsTable,
  TransactionDrawer,
  BulkActionsBar,
  Pagination,
  TransactionsSkeleton,
} from "."
import { useAuth } from "@/app/features/auth"

import type { Transaction, TransactionFilterState } from "./types"
import {
  defaultFilters,
  filterTransactions,
  computeSummary,
  mapApiTransaction,
} from "./view-model"

const PAGE_SIZE = 15

export default function TransactionsPage() {
  const { isAuthenticated, isInitializing } = useAuth()
  const queryClient = useQueryClient()
  const router = useRouter()

  const [filters, setFilters] = useState<TransactionFilterState>(defaultFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [drawerTxn, setDrawerTxn] = useState<Transaction | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { data: transactionsResponse, isLoading } = useTransactionsQuery(1, isAuthenticated, 50)
  const transactions = useMemo(() => {
    const source = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse?.data || []

    return source.map(mapApiTransaction)
  }, [transactionsResponse])

  // Filter & paginate
  const filtered = useMemo(() => filterTransactions(transactions, filters), [transactions, filters])
  const summary = useMemo(() => computeSummary(filtered), [filtered])
  const categories = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.category))).sort(),
    [transactions],
  )

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
    async (id: string) => {
      try {
        await api.del(ENDPOINTS.TRANSACTION.DELETE(id))
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["transactions"] }),
          queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        ])
        setSelectedIds((prev) => prev.filter((i) => i !== id))
        toast({ title: "Deleted", description: "Transaction removed successfully" })
      } catch (error) {
        toast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Could not delete transaction",
          variant: "destructive",
        })
      }
    },
    [queryClient]
  )

  const handleBulkDelete = useCallback(async () => {
    try {
      await Promise.all(selectedIds.map((id) => api.del(ENDPOINTS.TRANSACTION.DELETE(id))))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ])
      toast({ title: "Deleted", description: `${selectedIds.length} transactions removed` })
      setSelectedIds([])
    } catch (error) {
      toast({
        title: "Bulk delete failed",
        description: error instanceof Error ? error.message : "Could not delete selected transactions",
        variant: "destructive",
      })
    }
  }, [queryClient, selectedIds])

  const handleSave = useCallback(async (txn: Transaction) => {
    try {
      await api.put(ENDPOINTS.TRANSACTION.UPDATE(txn.id), {
        amount: txn.amount,
        type: txn.type,
        category: txn.category,
        note: txn.note || txn.description,
        date: txn.date,
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ])
      toast({ title: "Saved", description: "Transaction updated successfully" })
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not update transaction",
        variant: "destructive",
      })
    }
  }, [queryClient])

  const handleView = useCallback((txn: Transaction) => {
    setDrawerTxn(txn)
    setIsDrawerOpen(true)
  }, [])

  const handleEdit = useCallback((txn: Transaction) => {
    setDrawerTxn(txn)
    setIsDrawerOpen(true)
  }, [])

  const handleExportCSV = useCallback(() => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"]
    const rows = filtered.map((t) => [
      t.date,
      t.description,
      t.category,
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
    toast({ title: "Unavailable", description: "PDF export is not backed by the API yet" })
  }, [])

  const handleAddTransaction = useCallback(() => {
    router.push("/dashboard/transactions/add")
  }, [router])

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

        <TransactionsFilters filters={filters} onChange={setFilters} categories={categories} />

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
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
