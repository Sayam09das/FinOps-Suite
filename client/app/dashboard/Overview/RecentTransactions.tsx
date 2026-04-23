"use client";

import { Edit3, Plane, Receipt, ShoppingBag, Trash2, UtensilsCrossed, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { formatAmount } from "@/app/lib/utils/currency";
import { getRelativeTime } from "@/app/lib/utils/date";

type RecentTransactionItem = {
  id: string;
  category: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  date: string;
};

const categoryIcons: Record<string, typeof UtensilsCrossed> = {
  "Food & Dining": UtensilsCrossed,
  Transport: Plane,
  Shopping: ShoppingBag,
  Income: Wallet,
};

export default function RecentTransactions({ items }: { items: RecentTransactionItem[] }) {
  return (
    <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-5 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>
              Last transactions across spending, income, and account movement.
            </CardDescription>
          </div>
          <Button variant="secondary" size="sm" className="rounded-2xl">
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-4 sm:px-5">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/55 px-6 py-10 text-center">
            <p className="text-base font-semibold text-foreground">No transactions yet</p>
            <p className="mt-2 text-sm text-foreground/58">
              Add your first expense or income entry to start seeing live activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const Icon = categoryIcons[item.category] || Receipt;

              return (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-[1.35rem] border border-border/70 bg-background/72 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white/90 md:grid-cols-[1.5fr_1fr_0.9fr_0.9fr_0.9fr]"
                >
                  <div className="flex items-start gap-3">
                    <div className="primary-wash flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{item.description}</p>
                      <p className="mt-1 text-xs text-foreground/58">{item.category}</p>
                    </div>
                  </div>

                  <div className="text-sm text-foreground/72">
                    <p className="text-xs uppercase tracking-[0.16em] text-foreground/42">Category</p>
                    <p className="mt-1 font-medium text-foreground">{item.category}</p>
                  </div>

                  <div className="text-sm text-foreground/72">
                    <p className="text-xs uppercase tracking-[0.16em] text-foreground/42">Amount</p>
                    <p className={`mt-1 font-semibold ${item.type === "income" ? "text-emerald-700" : "text-rose-700"}`}>
                      {item.type === "income" ? "+" : "-"}
                      {formatAmount(item.amount)}
                    </p>
                  </div>

                  <div className="text-sm text-foreground/72">
                    <p className="text-xs uppercase tracking-[0.16em] text-foreground/42">Date</p>
                    <p className="mt-1 font-medium text-foreground">{getRelativeTime(item.date)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="rounded-2xl px-3 text-foreground/72">
                      <Edit3 className="h-4 w-4" />
                      Quick Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-2xl px-3 text-rose-700 hover:bg-rose-50">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
