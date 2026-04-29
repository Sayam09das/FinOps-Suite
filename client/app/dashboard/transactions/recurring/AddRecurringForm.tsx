"use client"

export default function AddRecurringForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-[4px]">
      <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-white/95 p-6 text-center shadow-[0_28px_80px_rgba(33,49,43,0.18)]">
        <h2 className="text-lg font-bold text-foreground">Recurring API not available</h2>
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          Add backend support for recurring transactions before creating recurring records from this screen.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-2xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
        >
          Close
        </button>
      </div>
    </div>
  )
}
