"use client";

import { ChevronRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { formatAmount } from "@/app/lib/utils/currency";
import { cn } from "@/app/lib/utils/cn";

import type { AccountItem } from "../types";

export default function AccountsList({ items }: { items: AccountItem[] }) {
  return (
    <Card className="surface-card rounded-[1.95rem] border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.3))] p-0 backdrop-blur-xl">
      <CardHeader className="border-b border-border/70 px-5 py-5">
        <CardTitle className="text-xl">Accounts Snapshot</CardTitle>
        <CardDescription>Linked balance positions across bank, wallet, and credit facilities.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-5 py-5">
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-background/55 px-6 py-10 text-center">
            <p className="text-base font-semibold text-foreground">No linked accounts yet</p>
            <p className="mt-2 text-sm text-foreground/58">
              Account balances will appear here after an accounts backend is connected.
            </p>
          </div>
        ) : items.map((item) => (
          <button
            key={item.name}
            type="button"
            className="flex w-full items-center gap-4 rounded-[1.35rem] border border-border/70 bg-background/72 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:bg-white/90"
          >
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold", item.accent)}>
              {item.type.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-xs text-foreground/58">{item.type}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${item.balance >= 0 ? "text-foreground" : "text-rose-700"}`}>
                {formatAmount(item.balance)}
              </p>
              <p className={`mt-1 text-xs ${item.change >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(1)}%
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-foreground/38" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
