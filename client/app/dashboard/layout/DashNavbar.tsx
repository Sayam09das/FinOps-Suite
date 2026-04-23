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
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/features/auth";
import { cn } from "@/app/lib/utils/cn";

type DashNavbarProps = {
  onMenuClick?: () => void;
};

type PanelName = "notifications" | "quick-add" | "profile" | null;

const notifications = [
  {
    title: "Budget alert",
    detail: "Marketing spend is at 88% of the monthly budget.",
    icon: AlertTriangle,
    accent: "text-amber-700 bg-amber-100/80",
  },
  {
    title: "AI insight",
    detail: "Food expenses are 13% above your four-week baseline.",
    icon: Bot,
    accent: "text-blue-700 bg-blue-100/80",
  },
  {
    title: "Reminder",
    detail: "Two recurring subscriptions renew in the next 48 hours.",
    icon: CreditCard,
    accent: "text-emerald-700 bg-emerald-100/80",
  },
];

const quickActions = [
  {
    title: "Add Expense",
    detail: "Capture a spend event instantly.",
    icon: Wallet,
  },
  {
    title: "Add Income",
    detail: "Log salary, invoices, or one-off credits.",
    icon: Landmark,
  },
  {
    title: "Create Budget",
    detail: "Start a new control plan for a category.",
    icon: PiggyBank,
  },
];

function panelClassName(isOpen: boolean) {
  return cn(
    "absolute right-0 top-[calc(100%+0.9rem)] z-40 w-[min(92vw,23rem)] rounded-[1.7rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.42))] p-3 shadow-[0_28px_80px_rgba(33,49,43,0.14)] backdrop-blur-2xl transition",
    isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
  );
}

export default function DashNavbar({ onMenuClick }: DashNavbarProps) {
  const { user, logout, isLoading } = useAuth();
  const [openPanel, setOpenPanel] = useState<PanelName>(null);
  const [currency, setCurrency] = useState("USD");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const userInitials = useMemo(() => {
    const source = user?.name?.trim() || "Finance Operator";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [user?.name]);

  const envLabel = process.env.NODE_ENV === "production" ? "Prod" : "Dev";

  const togglePanel = (panel: Exclude<PanelName, null>) => {
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="sticky top-3 z-30 px-3 pt-3 md:px-4">
      <div
        ref={navRef}
        className="nav-frame relative mx-auto flex w-full max-w-[1600px] flex-col gap-3 rounded-[2rem] px-3 py-3 md:px-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="nav-mobile-toggle flex h-11 w-11 items-center justify-center rounded-2xl lg:hidden"
              aria-label="Open dashboard navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
              <div className="primary-wash flex h-11 w-11 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                <Sparkles className="h-5 w-5 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">FinOps Suite</p>
                <p className="hidden truncate text-xs text-foreground/58 sm:block">
                  Quick control layer for finance operations
                </p>
              </div>
            </Link>

            <Badge variant="outline" className="hidden border-border/75 bg-background/70 text-xs md:flex">
              {envLabel}
            </Badge>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => togglePanel("notifications")}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-background/75 text-foreground shadow-[0_12px_30px_rgba(33,49,43,0.08)] transition hover:-translate-y-0.5 hover:bg-white/85"
                aria-label="Open notifications"
                aria-expanded={openPanel === "notifications"}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {notifications.length}
                </span>
              </button>

              <div className={panelClassName(openPanel === "notifications")}>
                <div className="rounded-[1.35rem] border border-border/70 bg-white/45 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow text-foreground/45">Notifications</p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">Budget signals and reminders</h3>
                    </div>
                    <Badge variant="accent">{notifications.length} new</Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {notifications.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="flex items-start gap-3 rounded-[1.2rem] border border-border/65 bg-background/72 p-3"
                        >
                          <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", item.accent)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                            <p className="mt-1 text-xs leading-5 text-foreground/62">{item.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Button
                variant="primary"
                size="sm"
                className="rounded-2xl px-4 py-2.5"
                onClick={() => togglePanel("quick-add")}
                aria-expanded={openPanel === "quick-add"}
              >
                <CirclePlus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Add</span>
              </Button>

              <div className={panelClassName(openPanel === "quick-add")}>
                <div className="rounded-[1.35rem] border border-border/70 bg-white/45 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow text-foreground/45">Quick Add</p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">Instant money movement tools</h3>
                    </div>
                    <Badge variant="subtle">Fast path</Badge>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {quickActions.map((action) => {
                      const Icon = action.icon;

                      return (
                        <button
                          key={action.title}
                          type="button"
                          onClick={() => setOpenPanel(null)}
                          className="flex w-full items-start gap-3 rounded-[1.2rem] border border-border/70 bg-background/72 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/90"
                        >
                          <div className="primary-wash flex h-10 w-10 items-center justify-center rounded-2xl">
                            <Icon className="h-4 w-4 text-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">{action.title}</p>
                            <p className="mt-1 text-xs leading-5 text-foreground/62">{action.detail}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <label className="hidden items-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-3 py-2 shadow-[0_12px_30px_rgba(33,49,43,0.08)] lg:flex">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">FX</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="bg-transparent text-sm font-medium text-foreground outline-none"
                aria-label="Select currency"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => togglePanel("profile")}
                className="flex items-center gap-2 rounded-2xl border border-border/80 bg-background/75 px-2 py-2 pr-3 shadow-[0_12px_30px_rgba(33,49,43,0.08)] transition hover:-translate-y-0.5 hover:bg-white/90"
                aria-label="Open user profile menu"
                aria-expanded={openPanel === "profile"}
              >
                <div className="primary-wash flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-semibold text-foreground">
                  {userInitials}
                </div>
                <div className="hidden text-left md:block">
                  <p className="max-w-[10rem] truncate text-sm font-semibold text-foreground">
                    {user?.name || "Finance Operator"}
                  </p>
                  <p className="max-w-[10rem] truncate text-xs text-foreground/55">
                    {user?.email || "Operator console"}
                  </p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-foreground/55 md:block" />
              </button>

              <div className={panelClassName(openPanel === "profile")}>
                <div className="rounded-[1.35rem] border border-border/70 bg-white/45 p-4">
                  <div className="rounded-[1.2rem] border border-border/70 bg-background/72 p-4">
                    <p className="text-sm font-semibold text-foreground">{user?.name || "Finance Operator"}</p>
                    <p className="mt-1 text-xs text-foreground/58">{user?.email || "Signed into FinOps Suite"}</p>
                  </div>

                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-[1.15rem] border border-border/65 bg-background/72 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-white/90"
                    >
                      <span className="flex items-center gap-3">
                        <UserRound className="h-4 w-4" />
                        Profile
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        Soon
                      </Badge>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-[1.15rem] border border-border/65 bg-background/72 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-white/90"
                    >
                      <span className="flex items-center gap-3">
                        <Settings2 className="h-4 w-4" />
                        Settings
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        Soon
                      </Badge>
                    </button>

                    <button
                      type="button"
                      onClick={logout}
                      disabled={isLoading}
                      className="flex w-full items-center gap-3 rounded-[1.15rem] border border-destructive/25 bg-destructive/8 px-4 py-3 text-left text-sm font-medium text-destructive transition hover:bg-destructive/12 disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/38" />
            <Input
              aria-label="Search transactions, accounts, and users"
              placeholder="Search transactions, accounts, users, budgets..."
              className="h-12 rounded-[1.4rem] border-border/75 bg-background/76 pl-11 pr-24"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-border/75 bg-white/65 px-2.5 py-1 text-[11px] font-semibold text-foreground/48 md:inline-flex">
              Ctrl K
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="bg-accent/20">
              AI insights live
            </Badge>
            <Badge variant="subtle" className="hidden sm:flex">
              3 alerts need attention
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
