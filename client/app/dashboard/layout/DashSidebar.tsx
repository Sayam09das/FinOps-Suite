"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  BarChart3,
  BellRing,
  Bot,
  CreditCard,
  FileDown,
  FileText,
  Globe2,
  History,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  PiggyBank,
  PieChart,
  PlugZap,
  ReceiptText,
  Repeat,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavTone = "live" | "soon";

type NavItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  badge?: string;
  tone?: NavTone;
};

type NavSection = {
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  items: NavItem[];
};

export type DashSidebarProps = {
  /** Renders as a mobile overlay drawer */
  mobile?: boolean;
  /** Controls drawer open state (mobile only) */
  open?: boolean;
  /** Called when drawer requests close (mobile only) */
  onClose?: () => void;
  /** When true, desktop sidebar shows icon-only rail */
  collapsed?: boolean;
};

// ─── Navigation data ──────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    eyebrow: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", description: "Main analytics and activity pulse", icon: LayoutDashboard, href: "/dashboard", badge: "Live", tone: "live" },
      { title: "Financial Summary", description: "Revenue, expenses, and balances", icon: Wallet, href: "/dashboard/finance-summary", badge: "Live", tone: "live" },
      { title: "Net Worth", description: "Assets versus liabilities", icon: Landmark, href: "/dashboard/networth", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Transactions",
    eyebrow: "Cash Movement",
    icon: ReceiptText,
    items: [
      { title: "All Transactions", description: "Browse every money event", icon: ReceiptText, href: "/dashboard/transactions", badge: "Live", tone: "live" },
      { title: "Add Transaction", description: "Log income or expense quickly", icon: Wallet, href: "/dashboard/transactions/add", badge: "Live", tone: "live" },
      { title: "Categories", description: "Keep spend grouped cleanly", icon: PieChart, href: "/dashboard/transactions/categories", badge: "Live", tone: "live" },
      { title: "Recurring", description: "Track renewals and subscriptions", icon: Repeat, href: "/dashboard/transactions/recurring", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Accounts",
    eyebrow: "Money Stores",
    icon: Landmark,
    items: [
      { title: "Bank Accounts", description: "Current and savings accounts", icon: Landmark, href: "/dashboard/accounts", badge: "Live", tone: "live" },
      { title: "Wallets", description: "Cash and digital balances", icon: Wallet, href: "/dashboard/accounts/wallets", badge: "Live", tone: "live" },
      { title: "Credit Cards", description: "Cards, limits, and due cycles", icon: CreditCard, href: "/dashboard/accounts/credit-cards", badge: "Live", tone: "live" },
      { title: "Transfers", description: "Move funds between sources", icon: ArrowRightLeft, href: "/dashboard/accounts/transfers", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Budgeting",
    eyebrow: "Control Plans",
    icon: PiggyBank,
    items: [
      { title: "Create Budget", description: "Start a category budget plan", icon: PiggyBank, href: "/dashboard/budgeting/create", badge: "Live", tone: "live" },
      { title: "Monthly Budgets", description: "Track month-by-month limits", icon: TrendingUp, href: "/dashboard/budgeting/monthly", badge: "Live", tone: "live" },
      { title: "Budget vs Actual", description: "See plan versus reality", icon: BarChart3, href: "/dashboard/budgeting/vs-actual", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Analytics",
    eyebrow: "Insight Layer",
    icon: PieChart,
    items: [
      { title: "Spending Analysis", description: "See where cash is flowing", icon: PieChart, href: "/dashboard/analytics/spending", badge: "Live", tone: "live" },
      { title: "Income vs Expense", description: "Balance inflow and outflow", icon: TrendingUp, href: "/dashboard/analytics/income-vs-expense", badge: "Live", tone: "live" },
      { title: "Cash Flow", description: "Understand liquidity trends", icon: BarChart3, href: "/dashboard/analytics/cash-flow", badge: "Soon", tone: "soon" },
      { title: "Custom Reports", description: "Build reusable finance views", icon: FileText, href: "/dashboard/analytics/custom-reports", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Goals & Planning",
    eyebrow: "Standout",
    icon: Target,
    items: [
      { title: "Savings Goals", description: "Track milestones and pace", icon: Target, href: "/dashboard/goals/savings", badge: "Live", tone: "live" },
      { title: "Investment Tracking", description: "Monitor growth over time", icon: TrendingUp, href: "/dashboard/goals/investments", badge: "Live", tone: "live" },
      { title: "Debt Tracker", description: "Reduce liabilities deliberately", icon: ShieldCheck, href: "/dashboard/goals/debt", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Collaboration",
    eyebrow: "Multi-user",
    icon: Users,
    items: [
      { title: "Shared Accounts", description: "Coordinate shared money sources", icon: Users, href: "/dashboard/collaboration/shared-accounts", badge: "Live", tone: "live" },
      { title: "Group Expenses", description: "Split and reconcile team spend", icon: ReceiptText, href: "/dashboard/collaboration/group-expenses", badge: "Live", tone: "live" },
      { title: "Invite Users", description: "Add teammates or family members", icon: UserPlus, href: "/dashboard/collaboration/invite-users", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Security & Audit",
    eyebrow: "Trust Layer",
    icon: ShieldCheck,
    items: [
      { title: "Login Activity", description: "Review recent access events", icon: ShieldCheck, href: "/dashboard/security/login-activity", badge: "Live", tone: "live" },
      { title: "Audit Logs", description: "See a trail of key actions", icon: History, href: "/dashboard/security/audit-logs", badge: "Live", tone: "live" },
      { title: "Permissions", description: "Control who can do what", icon: LockKeyhole, href: "/dashboard/security/permissions", badge: "Live", tone: "live" },
    ],
  },
  {
    title: "Settings",
    eyebrow: "System Setup",
    icon: Settings2,
    items: [
      { title: "Profile Settings", description: "Personal information and identity", icon: Settings2, badge: "Soon", tone: "soon" },
      { title: "Currency & Locale", description: "Regional finance preferences", icon: Globe2, badge: "Soon", tone: "soon" },
      { title: "Notifications", description: "Alert channels and thresholds", icon: BellRing, badge: "Soon", tone: "soon" },
      { title: "Integrations", description: "Banks, exports, and APIs", icon: PlugZap, badge: "Soon", tone: "soon" },
    ],
  },
];



function badgeCn(tone: NavTone = "soon") {
  return cn(
    "rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em]",
    tone === "live"
      ? "border-emerald-200/75 bg-emerald-50 text-emerald-700"
      : "border-border/68 bg-white/52 text-foreground/48",
  );
}

// ─── NavItemRow ───────────────────────────────────────────────────────────────
function isActive(pathname: string, href?: string) {
  if (!href) return false;

  const clean = (str: string) =>
    str.replace(/\/+$/, "") || "/";

  const current = clean(pathname);
  const target = clean(href);

  // exact match ONLY
  if (current === target) return true;

  // allow nested ONLY for non-root
  if (target !== "/" && current.startsWith(target + "/")) return true;

  return false;
}

function NavItemRow({
  item,
  pathname,
  collapsed = false,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);

  const inner = (
    <>
      {/* Icon */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
          collapsed ? "h-8 w-8" : "h-9 w-9",
          active
            ? "border-primary/68 bg-primary text-primary-foreground"
            : "border-border/68 bg-white/55 text-foreground/68",
        )}
      >
        <Icon className="h-[14px] w-[14px]" />
      </div>

      {/* Text */}
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[13px] font-semibold text-foreground">
              {item.title}
            </p>
            {item.badge && (
              <span className={badgeCn(item.tone)}>{item.badge}</span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] leading-[1.55] text-foreground/55">
            {item.description}
          </p>
        </div>
      )}
    </>
  );

  const cls = cn(
    "group relative flex w-full text-left transition-all duration-200",

    // ✅ collapsed spacing fix
    collapsed
      ? "justify-center py-1.5"
      : "items-center gap-3 rounded-[1.25rem] border px-3 py-2.5",

    // ✅ active state styling (ONLY when correct)
    !collapsed &&
    (active
      ? "border-primary/72 bg-primary/44 shadow-[0_12px_32px_rgba(33,49,43,0.09)]"
      : "border-border/65 bg-background/65 hover:-translate-y-0.5 hover:border-primary/38 hover:bg-white/85"),

    // ✅ collapsed active icon highlight
    collapsed && active && "text-primary"
  );

  const tooltip = collapsed ? (
    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-border/80 bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100">
      {item.title}
    </span>
  ) : null;

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={cls}
        onClick={onNavigate}
        title={collapsed ? item.title : undefined}
      >
        {inner}
        {tooltip}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} disabled>
      {inner}
      {tooltip}
    </button>
  );
}

// ─── SidebarContent ───────────────────────────────────────────────────────────

function SidebarContent({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">

      {/* Header card — hidden when collapsed */}
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-[1.7rem] border border-border/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.65),rgba(255,255,255,0.30))] shadow-[0_14px_48px_rgba(33,49,43,0.08)] transition-all duration-300",
          collapsed ? "max-h-0 border-transparent p-0 opacity-0 shadow-none" : "max-h-40 p-4 opacity-100",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="primary-wash flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
            <Sparkles className="h-5 w-5 text-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
              System navigation
            </p>
            <h2 className="mt-0.5 text-base font-semibold leading-snug text-foreground">
              Finance control center
            </h2>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-[1.65] text-foreground/58">
          Full command surface for operations, planning, reporting, and audit readiness.
        </p>
      </div>

      {/* Collapsed brand icon */}
      {collapsed && (
        <div className="flex shrink-0 justify-center py-1">
          <div className="primary-wash flex h-10 w-10 items-center justify-center rounded-2xl">
            <Sparkles className="h-5 w-5 text-foreground" />
          </div>
        </div>
      )}

      {/* Scrollable sections */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/40">
        {NAV_SECTIONS.map((section) => {
          const SectionIcon = section.icon;

          return (
            <section
              key={section.title}
              className={cn(
                "rounded-[1.6rem] border border-border/70 bg-white/38 shadow-[0_10px_36px_rgba(33,49,43,0.05)] backdrop-blur-xl transition-all duration-200",
                collapsed ? "p-2" : "p-3",
              )}
            >
              {/* Section header — hidden when collapsed */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  collapsed ? "mb-0 max-h-0 opacity-0" : "mb-2.5 max-h-16 px-1 opacity-100",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="accent-wash flex h-8 w-8 items-center justify-center rounded-xl">
                    <SectionIcon className="h-[14px] w-[14px] text-foreground/75" />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-foreground/38">
                      {section.eyebrow}
                    </p>
                    <h3 className="text-[13px] font-semibold leading-tight text-foreground">
                      {section.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className={cn("space-y-1", collapsed && "space-y-1.5")}>
                {section.items.map((item) => (
                  <NavItemRow
                    key={item.title}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DashSidebar({
  mobile = false,
  open = false,
  onClose,
  collapsed = false,
}: DashSidebarProps) {

  /* ── Desktop variant ── */
  if (!mobile) {
    return (
      <aside
        className="panel-frost flex h-full flex-col overflow-hidden rounded-[2rem] p-3 transition-all duration-300"
        aria-label="Dashboard navigation"
      >
        <SidebarContent collapsed={collapsed} />
      </aside>
    );
  }

  /* ── Mobile drawer variant ── */
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-200",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-foreground/20 backdrop-blur-[3px] transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-label="Close sidebar"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "absolute inset-y-0 left-0 flex w-[88vw] max-w-[360px] flex-col p-3",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Dashboard navigation"
      >
        <div className="panel-frost flex h-full flex-col overflow-hidden rounded-[2rem] p-4 shadow-[0_28px_90px_rgba(33,49,43,0.18)]">
          {/* Drawer header */}
          <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
                Navigation
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-foreground">
                Dashboard modules
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border/75 bg-white/52 text-foreground transition hover:bg-white/80"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile always shows full content (not collapsed) */}
          <SidebarContent collapsed={false} onNavigate={onClose} />
        </div>
      </aside>
    </div>
  );
}