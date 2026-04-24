"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Bot,
  ChevronDown,
  CirclePlus,
  CreditCard,
  Landmark,
  LogOut,
  Menu,
  PiggyBank,
  Search,
  Settings2,
  Sparkles,
  UserRound,
  Wallet,
  X,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/features/auth";
import { cn } from "@/app/lib/utils/cn";

type DashNavbarProps = {
  onMenuClick?: () => void;
};

type PanelName = "notifications" | "quick-add" | "profile" | "search" | null;

const notifications = [
  {
    title: "Budget alert",
    detail: "Marketing spend is at 88% of the monthly budget.",
    icon: AlertTriangle,
    accent: "text-amber-600",
    bg: "bg-amber-50 border-amber-200/60",
    time: "2m ago",
  },
  {
    title: "AI insight",
    detail: "Food expenses are 13% above your four-week baseline.",
    icon: Bot,
    accent: "text-sky-600",
    bg: "bg-sky-50 border-sky-200/60",
    time: "18m ago",
  },
  {
    title: "Subscription renewal",
    detail: "Two recurring subscriptions renew in the next 48 hours.",
    icon: CreditCard,
    accent: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200/60",
    time: "1h ago",
  },
];

const quickActions = [
  {
    title: "Add Expense",
    detail: "Capture a spend event instantly.",
    icon: Wallet,
    color: "from-rose-400 to-orange-400",
    shadow: "shadow-rose-200",
  },
  {
    title: "Add Income",
    detail: "Log salary, invoices, or one-off credits.",
    icon: Landmark,
    color: "from-emerald-400 to-teal-400",
    shadow: "shadow-emerald-200",
  },
  {
    title: "Create Budget",
    detail: "Start a new control plan for a category.",
    icon: PiggyBank,
    color: "from-violet-400 to-purple-400",
    shadow: "shadow-violet-200",
  },
];

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function Panel({
  isOpen,
  children,
  align = "right",
  width = "w-[min(92vw,22rem)]",
}: {
  isOpen: boolean;
  children: React.ReactNode;
  align?: "right" | "left";
  width?: string;
}) {
  return (
    <div
      className={cn(
        "absolute top-[calc(100%+0.65rem)] z-50 rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-200",
        width,
        align === "right" ? "right-0" : "left-0",
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
          : "pointer-events-none translate-y-2 opacity-0 scale-[0.97]",
      )}
    >
      {children}
    </div>
  );
}

export default function DashNavbar({ onMenuClick }: DashNavbarProps) {
  const { user, logout, isLoading } = useAuth();
  const [openPanel, setOpenPanel] = useState<PanelName>(null);
  const [currency, setCurrency] = useState("USD");
  const [searchFocused, setSearchFocused] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useOutsideClick(navRef, () => setOpenPanel(null));

  const userInitials = useMemo(() => {
    const source = user?.name?.trim() || "Finance Operator";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }, [user?.name]);

  const toggle = (panel: Exclude<PanelName, null>) =>
    setOpenPanel((cur) => (cur === panel ? null : panel));

  return (
    <div className="sticky top-0 z-30 w-full">
      {/* Soft background blur fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-50/90 to-transparent" />

      <div className="relative px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          ref={navRef}
          className="relative mx-auto flex max-w-[1600px] flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/85 px-3 py-2.5 shadow-lg shadow-slate-900/[0.06] backdrop-blur-xl sm:px-4 sm:py-3"
        >

          {/* ═══ TOP ROW ═══ */}
          <div className="flex items-center gap-2">

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200/60">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-bold tracking-tight text-slate-800">FinOps Suite</p>
                <p className="truncate text-[11px] text-slate-400">Finance control layer</p>
              </div>
            </Link>

            {/* Env badge */}
            <span className="hidden rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:inline-flex">
              {process.env.NODE_ENV === "production" ? "Prod" : "Dev"}
            </span>

            {/* ─── RIGHT CLUSTER ─── */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">

              {/* Mobile search toggle */}
              <button
                type="button"
                onClick={() => toggle("search")}
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 sm:hidden"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {/* Currency selector — xl+ */}
              <label className="hidden cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 transition hover:bg-white xl:flex">
                <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 outline-none"
                  aria-label="Select currency"
                >
                  <option>USD</option>
                  <option>INR</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </label>

              {/* ── Notifications ── */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggle("notifications")}
                  aria-label="Notifications"
                  aria-expanded={openPanel === "notifications"}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-px hover:bg-slate-50 hover:shadow"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white shadow-sm">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <Panel isOpen={openPanel === "notifications"} width="w-[min(92vw,24rem)]">
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Inbox</p>
                        <h3 className="mt-0.5 text-base font-bold text-slate-800">Notifications</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
                          {notifications.length} new
                        </span>
                        <button
                          onClick={() => setOpenPanel(null)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {notifications.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.title}
                            type="button"
                            className={cn(
                              "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition hover:brightness-[0.97]",
                              item.bg,
                            )}
                          >
                            <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm", item.accent)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                <span className="shrink-0 text-[10px] text-slate-400">{item.time}</span>
                              </div>
                              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.detail}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">
                      View all
                    </button>
                  </div>
                </Panel>
              </div>

              {/* ── Quick Add ── */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggle("quick-add")}
                  aria-expanded={openPanel === "quick-add"}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-3 text-xs font-bold text-white shadow-md shadow-indigo-200/60 transition hover:-translate-y-px hover:shadow-lg"
                >
                  <CirclePlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Quick Add</span>
                </button>

                <Panel isOpen={openPanel === "quick-add"} width="w-[min(92vw,22rem)]">
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</p>
                        <h3 className="mt-0.5 text-base font-bold text-slate-800">Quick Add</h3>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-600">
                        <Zap className="h-3 w-3" /> Fast
                      </span>
                    </div>

                    <div className="space-y-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.title}
                            type="button"
                            onClick={() => setOpenPanel(null)}
                            className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition hover:-translate-y-px hover:bg-white hover:shadow-md"
                          >
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
                                action.color,
                                action.shadow,
                              )}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800">{action.title}</p>
                              <p className="text-xs text-slate-400">{action.detail}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Panel>
              </div>

              {/* ── Profile ── */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggle("profile")}
                  aria-label="Profile menu"
                  aria-expanded={openPanel === "profile"}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 shadow-sm transition hover:-translate-y-px hover:shadow"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white">
                    {userInitials}
                  </div>
                  <span className="hidden max-w-[7rem] truncate text-xs font-semibold text-slate-700 md:block">
                    {user?.name?.split(" ")[0] || "Operator"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "hidden h-3.5 w-3.5 text-slate-400 transition-transform duration-200 md:block",
                      openPanel === "profile" && "rotate-180",
                    )}
                  />
                </button>

                <Panel isOpen={openPanel === "profile"} width="w-[min(92vw,20rem)]">
                  <div className="p-3">
                    {/* User card */}
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-bold text-white shadow-md shadow-indigo-200">
                        {userInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {user?.name || "Finance Operator"}
                        </p>
                        <p className="truncate text-xs text-slate-500">{user?.email || "Signed in"}</p>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      {[
                        { label: "Profile", icon: UserRound },
                        { label: "Settings", icon: Settings2 },
                      ].map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4 text-slate-400" />
                            {label}
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-400">
                            Soon
                          </span>
                        </button>
                      ))}

                      <div className="my-1 h-px bg-slate-100" />

                      <button
                        type="button"
                        onClick={logout}
                        disabled={isLoading}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </div>

          {/* ═══ SEARCH ROW ═══ */}
          {/* Desktop: always visible. Mobile: shown when search toggled. */}
          <div
            className={cn(
              "flex flex-col gap-2 sm:flex-row sm:items-center",
              openPanel === "search" ? "flex" : "hidden sm:flex",
            )}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Global search"
                placeholder="Search transactions, budgets, accounts…"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={cn(
                  "h-10 w-full rounded-xl border bg-slate-50 pl-10 pr-[4.5rem] text-sm text-slate-800 placeholder-slate-400 outline-none transition",
                  searchFocused
                    ? "border-indigo-300 bg-white ring-2 ring-indigo-100"
                    : "border-slate-200 hover:border-slate-300",
                )}
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 md:flex">
                ⌘K
              </kbd>
            </div>

            {/* Status pills */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                AI live
              </span>
              <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 sm:flex">
                3 alerts
              </span>

              {/* Close search on mobile */}
              <button
                type="button"
                onClick={() => setOpenPanel(null)}
                aria-label="Close search"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 sm:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}