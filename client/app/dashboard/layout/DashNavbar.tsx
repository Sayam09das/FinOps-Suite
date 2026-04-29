"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Bot,
  ChevronDown,
  CreditCard,
  LogOut,
  Menu,
  Search,
  Settings2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/features/auth";
import { cn } from "@/app/lib/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashNavbarProps = {
  /** Toggles the sidebar — wired from the parent layout */
  onMenuClick?: () => void;
};

type PanelName = "notifications" | "profile" | null;

// ─── Static data ──────────────────────────────────────────────────────────────

const NOTIFICATIONS = [
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
] as const;

const CURRENCIES = ["USD", "INR", "EUR", "GBP"] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashNavbar({ onMenuClick }: DashNavbarProps) {
  const { user, logout, isLoading } = useAuth();

  const [openPanel, setOpenPanel] = useState<PanelName>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("USD");

  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Side-effects ── */

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
      if (e.key === "Escape") {
        setOpenPanel(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ── Derived values ── */

  const userInitials = useMemo(() => {
    const src = user?.name?.trim() || "Finance Operator";
    return src
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  }, [user?.name]);

  const envLabel = process.env.NODE_ENV === "production" ? "Prod" : "Dev";

  const togglePanel = (panel: Exclude<PanelName, null>) =>
    setOpenPanel((cur) => (cur === panel ? null : panel));

  /* ── Render ── */

  return (
    <div className="sticky top-3 z-30 px-3 pt-3 md:px-4">
      <div
        ref={navRef}
        className="nav-frame relative mx-auto flex w-full max-w-[1600px] flex-col rounded-[2rem] px-3 py-3 md:px-4"
      >
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* Hamburger — always visible, controls sidebar open/close */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-background/75 text-foreground shadow-[0_8px_22px_rgba(33,49,43,0.07)] transition hover:-translate-y-0.5 hover:bg-white/88"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
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
              {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
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
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold leading-none text-accent-foreground">
                  {NOTIFICATIONS.length}
                </span>
              </button>

              <div className={dropdownCn(openPanel === "notifications")} role="dialog" aria-label="Notifications panel">
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
                    <Badge variant="accent" className="shrink-0 text-[10px]">
                      {NOTIFICATIONS.length} new
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    {NOTIFICATIONS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="flex items-start gap-3 rounded-[1.1rem] border border-border/58 bg-background/65 p-3"
                        >
                          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", item.accent)}>
                            <Icon className="h-[14px] w-[14px]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-foreground">{item.title}</p>
                            <p className="mt-0.5 text-[11px] leading-[1.6] text-foreground/56">{item.detail}</p>
                          </div>
                        </div>
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
                value={currency}
                onChange={(e) => setCurrency(e.target.value as typeof currency)}
                className="bg-transparent text-sm font-medium text-foreground outline-none"
                aria-label="Display currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
                  style={{ transform: openPanel === "profile" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              <div className={dropdownCn(openPanel === "profile")} role="dialog" aria-label="Profile panel">
                <div className="rounded-[1.3rem] border border-border/62 bg-white/38 p-4">

                  {/* Identity card */}
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

                  {/* FX — visible only below lg */}
                  <div className="mt-2.5 rounded-[1.1rem] border border-border/55 bg-background/62 px-4 py-3 lg:hidden">
                    <label className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
                        Currency
                      </span>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as typeof currency)}
                        className="ml-auto bg-transparent text-sm font-medium text-foreground outline-none"
                        aria-label="Display currency"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="mt-2.5 space-y-1.5">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-[1.1rem] border border-border/55 bg-background/62 px-4 py-3 text-left text-[13px] font-medium text-foreground transition hover:bg-white/85"
                    >
                      <span className="flex items-center gap-3">
                        <UserRound className="h-4 w-4 shrink-0 text-foreground/65" />
                        Profile
                      </span>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
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
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
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
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Collapsible search ───────────────────────────────────────── */}
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
              placeholder="Search transactions, accounts, budgets, users…"
              className="h-12 rounded-[1.35rem] border-border/70 bg-background/72 pl-11 pr-[4.5rem] text-sm placeholder:text-foreground/38"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded-lg border border-border/68 bg-white/60 px-2 py-1 text-[10px] font-semibold text-foreground/42 md:inline-flex">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}