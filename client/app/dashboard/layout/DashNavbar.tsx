"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/features/auth";
import { useDashboardCurrency } from "@/app/features/currency";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationRealtime,
  useNotifications,
} from "@/app/features/notifications";
import { cn } from "@/app/lib/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashNavbarProps = {
  /** Called when hamburger is clicked — parent decides which state to toggle */
  onMenuClick?: () => void;
  /** Reflects desktop sidebar collapsed state — used to show correct icon */
  sidebarCollapsed?: boolean;
};

type PanelName = "notifications" | "profile" | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEARCH_ITEMS = [
  { label: "Dashboard", description: "Overview and quick insights", href: "/dashboard" },
  { label: "Finance Summary", description: "Cash flow and account distribution", href: "/dashboard/finance-summary" },
  { label: "Net Worth", description: "Assets, liabilities, and health score", href: "/dashboard/networth" },
  { label: "Accounts", description: "Bank accounts and balances", href: "/dashboard/accounts" },
  { label: "Credit Cards", description: "Cards, billing, and utilization", href: "/dashboard/accounts/credit-cards" },
  { label: "Transfers", description: "Move money between accounts", href: "/dashboard/accounts/transfers" },
  { label: "Wallets", description: "Cash and wallet balances", href: "/dashboard/accounts/wallets" },
  { label: "Transactions", description: "Browse all recorded transactions", href: "/dashboard/transactions/AllTransactions" },
  { label: "Add Transaction", description: "Create a new income or expense", href: "/dashboard/transactions/add" },
  { label: "Categories", description: "Manage transaction categories", href: "/dashboard/transactions/categories" },
  { label: "Recurring", description: "Upcoming recurring transactions", href: "/dashboard/transactions/recurring" },
  { label: "Monthly Budget", description: "Monthly budget tracking", href: "/dashboard/budgeting/monthly" },
  { label: "Create Budget", description: "Build a new budget plan", href: "/dashboard/budgeting/create" },
  { label: "Budget vs Actual", description: "Compare planned and actual spend", href: "/dashboard/budgeting/vs-actual" },
  { label: "Cash Flow", description: "Analyze inflow and outflow", href: "/dashboard/analytics/cash-flow" },
  { label: "Spending", description: "Spending trends and categories", href: "/dashboard/analytics/spending" },
  { label: "Income vs Expense", description: "Compare earnings and expenses", href: "/dashboard/analytics/income-vs-expense" },
  { label: "Custom Reports", description: "Build custom analytics reports", href: "/dashboard/analytics/custom-reports" },
  { label: "Savings Goals", description: "Track savings targets", href: "/dashboard/goals/savings" },
  { label: "Debt Tracker", description: "Track debt balances and payments", href: "/dashboard/goals/debt" },
  { label: "Investments", description: "Monitor investment performance", href: "/dashboard/goals/investments" },
  { label: "Shared Accounts", description: "Collaboration account balances", href: "/dashboard/collaboration/shared-accounts" },
  { label: "Group Expenses", description: "Shared expenses and settlements", href: "/dashboard/collaboration/group-expenses" },
  { label: "Invite Users", description: "Team invites and member access", href: "/dashboard/collaboration/invite-users" },
  { label: "Login Activity", description: "Security login events", href: "/dashboard/security/login-activity" },
  { label: "Audit Logs", description: "Security and admin activity trail", href: "/dashboard/security/audit-logs" },
  { label: "Permissions", description: "Roles and access control", href: "/dashboard/security/permissions" },
] as const;

function dropdownCn(open: boolean) {
  return cn(
    "absolute right-0 top-[calc(100%+0.75rem)] z-40",
    "w-[min(calc(100vw-1.5rem),22rem)]",
    "rounded-[1.6rem] border border-border/80",
    "bg-[linear-gradient(160deg,rgba(255,255,255,0.80),rgba(255,255,255,0.48))]",
    "p-3 shadow-[0_24px_72px_rgba(33,49,43,0.14)] backdrop-blur-2xl",
    "transition-all duration-200 ease-out",
    open
      ? "pointer-events-auto translate-y-0 opacity-100"
      : "pointer-events-none translate-y-2 opacity-0",
  );
}

function getNotificationDisplay(type: string) {
  switch (type) {
    case "budget_exceeded":
    case "budget_warning":
      return { icon: AlertTriangle, accent: "text-amber-700 bg-amber-100/80" };
    case "low_balance":
      return { icon: Bell, accent: "text-rose-700 bg-rose-100/80" };
    case "analytics_insight":
      return { icon: Sparkles, accent: "text-blue-700 bg-blue-100/80" };
    case "new_transaction":
      return { icon: Bell, accent: "text-emerald-700 bg-emerald-100/80" };
    default:
      return { icon: Bell, accent: "text-slate-700 bg-slate-100/80" };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashNavbar({
  onMenuClick,
  sidebarCollapsed = false,
}: DashNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const {
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    isLoadingRates,
    lastUpdated,
  } = useDashboardCurrency()
  const { data: notificationsData } = useNotifications()
  const markNotificationRead = useMarkNotificationRead()
  const markAllNotificationsRead = useMarkAllNotificationsRead()
  useNotificationRealtime()

  const [openPanel, setOpenPanel] = useState<PanelName>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);

  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Effects ── */

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenPanel(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => searchRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setOpenPanel(null);
        return;
      }

      if (e.key === "Escape") {
        setOpenPanel(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ── Derived ── */

  const userInitials = useMemo(() => {
    const src = user?.name?.trim() || "Finance Operator";
    return src
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  }, [user?.name]);

  const envLabel = process.env.NODE_ENV === "production" ? "Prod" : "Dev";
  const notifications = notificationsData?.notifications ?? []
  const unreadCount = notificationsData?.unreadCount ?? 0
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return SEARCH_ITEMS.slice(0, 8);
    }

    return SEARCH_ITEMS.filter((item) => {
      const haystack = `${item.label} ${item.description} ${item.href}`.toLowerCase();
      return haystack.includes(query);
    }).slice(0, 8);
  }, [searchQuery]);

  const togglePanel = (panel: Exclude<PanelName, null>) =>
    setOpenPanel((cur) => (cur === panel ? null : panel));

  useEffect(() => {
    setSelectedSearchIndex(0);
  }, [searchQuery]);

  const handleSearchSelect = (href: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedSearchIndex(0);
    router.push(href);
  };

  /* ── Render ── */

  return (
    <div className="sticky top-3 z-30 px-3 pt-3 md:px-4">
      <div
        ref={navRef}
        className="nav-frame relative mx-auto flex w-full max-w-[1600px] flex-col rounded-[2rem] px-3 py-3 md:px-4"
      >
        {/* ── Top bar ── */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* Hamburger / collapse toggle */}
          <button
            type="button"
            onClick={onMenuClick}
            className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-background/75 text-foreground shadow-[0_8px_22px_rgba(33,49,43,0.07)] transition hover:-translate-y-0.5 hover:bg-white/88"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {/* Desktop: shows collapse/expand icon */}
            <span className="hidden lg:block transition-all duration-200">
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </span>
            {/* Mobile: always hamburger */}
            <Menu className="h-5 w-5 lg:hidden" />
          </button>

          {/* Brand */}
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <div className="primary-wash flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold leading-tight text-foreground">
                FinOps Suite
              </p>
              <p className="mt-0.5 hidden truncate text-[11px] leading-none text-foreground/50 md:block">
                Finance control layer
              </p>
            </div>
          </Link>

          <Badge
            variant="outline"
            className="hidden shrink-0 border-border/68 bg-background/62 text-[10px] md:flex"
          >
            {envLabel}
          </Badge>

          {/* ── Right actions ── */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">

            {/* Search toggle */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setOpenPanel(null);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-background/75 text-foreground shadow-[0_8px_22px_rgba(33,49,43,0.07)] transition hover:-translate-y-0.5 hover:bg-white/88"
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              {searchOpen ? (
                <X className="h-[18px] w-[18px]" />
              ) : (
                <Search className="h-[18px] w-[18px]" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePanel("notifications")}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-background/75 text-foreground shadow-[0_8px_22px_rgba(33,49,43,0.07)] transition hover:-translate-y-0.5 hover:bg-white/88"
                aria-label="Notifications"
                aria-expanded={openPanel === "notifications"}
                aria-haspopup="true"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-accent-foreground">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              <div
                className={dropdownCn(openPanel === "notifications")}
                role="dialog"
                aria-label="Notifications panel"
              >
                <div className="rounded-[1.3rem] border border-border/62 bg-white/38 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
                        Inbox
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-foreground">
                        Signals &amp; reminders
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="accent" className="shrink-0 text-[10px]">
                        {unreadCount} new
                      </Badge>
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => markAllNotificationsRead.mutate()}
                          className="text-[10px] font-semibold uppercase tracking-wider text-foreground/45 transition hover:text-foreground"
                        >
                          Mark all read
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="rounded-[1.1rem] border border-border/58 bg-background/65 p-4 text-center">
                        <p className="text-[13px] font-semibold text-foreground">No notifications yet</p>
                        <p className="mt-1 text-[11px] leading-[1.6] text-foreground/56">
                          Live alerts from budgets, analytics, and transactions will appear here.
                        </p>
                      </div>
                    ) : notifications.map((item) => {
                      const { icon: Icon, accent } = getNotificationDisplay(item.type);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => {
                            if (!item.read) {
                              markNotificationRead.mutate(item.id)
                            }
                          }}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-[1.1rem] border border-border/58 bg-background/65 p-3 text-left transition",
                            item.read ? "opacity-75" : "ring-1 ring-accent/18",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                              accent,
                            )}
                          >
                            <Icon className="h-[14px] w-[14px]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[13px] font-semibold text-foreground">
                                {item.title}
                              </p>
                              {!item.read ? (
                                <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-foreground">
                                  New
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-0.5 text-[11px] leading-[1.6] text-foreground/56">
                              {item.message}
                            </p>
                            <p className="mt-1 text-[10px] text-foreground/40">
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* FX selector — desktop */}
            <label className="hidden cursor-pointer items-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-3 py-[0.58rem] shadow-[0_8px_22px_rgba(33,49,43,0.07)] lg:flex">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/40">
                FX
              </span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as (typeof currencies)[number])}
                disabled={isLoadingRates}
                className="bg-transparent text-sm font-medium text-foreground outline-none"
                aria-label="Display currency"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePanel("profile")}
                className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/75 p-2 shadow-[0_8px_22px_rgba(33,49,43,0.07)] transition hover:-translate-y-0.5 hover:bg-white/88 md:pr-3"
                aria-label="Profile menu"
                aria-expanded={openPanel === "profile"}
                aria-haspopup="true"
              >
                <div className="primary-wash flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-[13px] font-bold text-foreground">
                  {userInitials}
                </div>
                <div className="hidden min-w-0 text-left md:block">
                  <p className="max-w-[9rem] truncate text-[13px] font-semibold leading-tight text-foreground">
                    {user?.name || "Finance Operator"}
                  </p>
                  <p className="mt-0.5 max-w-[9rem] truncate text-[11px] leading-none text-foreground/50">
                    {user?.email || "Operator console"}
                  </p>
                </div>
                <ChevronDown
                  className="hidden h-4 w-4 shrink-0 text-foreground/48 transition-transform duration-200 md:block"
                  style={{
                    transform:
                      openPanel === "profile"
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
              </button>

              <div
                className={dropdownCn(openPanel === "profile")}
                role="dialog"
                aria-label="Profile panel"
              >
                <div className="rounded-[1.3rem] border border-border/62 bg-white/38 p-4">
                  {/* Identity */}
                  <div className="flex items-center gap-3 rounded-[1.1rem] border border-border/58 bg-background/65 p-3">
                    <div className="primary-wash flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-foreground">
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-foreground">
                        {user?.name || "Finance Operator"}
                      </p>
                      <p className="truncate text-[11px] text-foreground/52">
                        {user?.email || "Signed into FinOps Suite"}
                      </p>
                    </div>
                  </div>

                  {/* FX (mobile/tablet only) */}
                  <div className="mt-2.5 rounded-[1.1rem] border border-border/55 bg-background/62 px-4 py-3 lg:hidden">
                    <label className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
                        Currency
                      </span>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value as (typeof currencies)[number])}
                        disabled={isLoadingRates}
                        className="ml-auto bg-transparent text-sm font-medium text-foreground outline-none"
                        aria-label="Display currency"
                      >
                        {currencies.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                    {lastUpdated ? (
                      <p className="mt-2 text-[10px] text-foreground/45">
                        Live FX rates synced on {lastUpdated}
                      </p>
                    ) : null}
                  </div>

                  {/* Menu actions */}
                  <div className="mt-2.5 space-y-1.5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-[1.1rem] border border-border/55 bg-background/62 px-4 py-3 text-left text-[13px] font-medium text-foreground transition hover:bg-white/85"
                    >
                      <span className="flex items-center gap-3">
                        <UserRound className="h-4 w-4 shrink-0 text-foreground/65" />
                        Profile
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase tracking-wider"
                      >
                        Soon
                      </Badge>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-[1.1rem] border border-border/55 bg-background/62 px-4 py-3 text-left text-[13px] font-medium text-foreground transition hover:bg-white/85"
                    >
                      <span className="flex items-center gap-3">
                        <Settings2 className="h-4 w-4 shrink-0 text-foreground/65" />
                        Settings
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase tracking-wider"
                      >
                        Soon
                      </Badge>
                    </button>

                    <button
                      type="button"
                      onClick={logout}
                      disabled={isLoading}
                      className="flex w-full items-center gap-3 rounded-[1.1rem] border border-destructive/20 bg-destructive/6 px-4 py-3 text-left text-[13px] font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-55"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Collapsible search ── */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            searchOpen ? "mt-3 max-h-[4rem] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/34" />
            <Input
              ref={searchRef}
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedSearchIndex((cur) =>
                    Math.min(cur + 1, Math.max(searchResults.length - 1, 0)),
                  );
                }

                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedSearchIndex((cur) => Math.max(cur - 1, 0));
                }

                if (e.key === "Enter" && searchResults[selectedSearchIndex]) {
                  e.preventDefault();
                  handleSearchSelect(searchResults[selectedSearchIndex].href);
                }
              }}
              placeholder="Search transactions, accounts, budgets, users…"
              className="h-12 rounded-[1.35rem] border-border/70 bg-background/72 pl-11 pr-[4.5rem] text-sm placeholder:text-foreground/38"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded-lg border border-border/68 bg-white/60 px-2 py-1 text-[10px] font-semibold text-foreground/42 md:inline-flex">
              Ctrl K
            </kbd>
          </div>

          <div className="mt-2 overflow-hidden rounded-[1.35rem] border border-border/70 bg-background/72">
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleSearchSelect(item.href)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 border-b border-border/40 px-4 py-3 text-left transition last:border-b-0",
                    index === selectedSearchIndex
                      ? "bg-white/85"
                      : "hover:bg-white/65",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="mt-0.5 text-xs text-foreground/50">{item.description}</p>
                  </div>
                  {pathname === item.href ? (
                    <Badge variant="outline" className="shrink-0 text-[9px] uppercase tracking-wider">
                      Here
                    </Badge>
                  ) : null}
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-foreground/50">
                No dashboard pages match “{searchQuery}”.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
