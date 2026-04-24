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

type NavItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  badge?: string;
  tone?: "live" | "soon";
};

type NavSection = {
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  items: NavItem[];
};

type DashSidebarProps = {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
};

const navSections: NavSection[] = [
  {
    title: "Overview",
    eyebrow: "Dashboard",
    icon: LayoutDashboard,
    items: [
      {
        title: "Dashboard",
        description: "Main analytics and activity pulse",
        icon: LayoutDashboard,
        href: "/dashboard",
        badge: "Live",
        tone: "live",
      },
      {
        title: "Financial Summary",
        description: "Revenue, expenses, and balances",
        icon: Wallet,
        href: "/dashboard/finance-summary",
        badge: "Live",
        tone: "live",
      },
      {
        title: "Net Worth Snapshot",
        description: "Assets versus liabilities",
        icon: Landmark,
        href: "/dashboard/networth",
        badge: "Live",
        tone: "live",
      },
    ],
  },
  {
    title: "Transactions",
    eyebrow: "Cash Movement",
    icon: ReceiptText,
    items: [
      {
        title: "All Transactions",
        description: "Browse every money event",
        icon: ReceiptText,
        badge: "Soon",
      },
      {
        title: "Add Transaction",
        description: "Log income or expense quickly",
        icon: Wallet,
        badge: "Soon",
      },
      {
        title: "Categories",
        description: "Keep spend grouped cleanly",
        icon: PieChart,
        badge: "Soon",
      },
      {
        title: "Recurring Transactions",
        description: "Track renewals and subscriptions",
        icon: Repeat,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Accounts",
    eyebrow: "Money Stores",
    icon: Landmark,
    items: [
      {
        title: "Bank Accounts",
        description: "Current and savings accounts",
        icon: Landmark,
        badge: "Soon",
      },
      {
        title: "Wallets",
        description: "Cash and digital balances",
        icon: Wallet,
        badge: "Soon",
      },
      {
        title: "Credit Cards",
        description: "Cards, limits, and due cycles",
        icon: CreditCard,
        badge: "Soon",
      },
      {
        title: "Account Transfers",
        description: "Move funds between sources",
        icon: ArrowRightLeft,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Budgeting",
    eyebrow: "Control Plans",
    icon: PiggyBank,
    items: [
      {
        title: "Create Budget",
        description: "Start a category budget plan",
        icon: PiggyBank,
        badge: "Soon",
      },
      {
        title: "Monthly Budgets",
        description: "Track month-by-month limits",
        icon: TrendingUp,
        badge: "Soon",
      },
      {
        title: "Budget vs Actual",
        description: "See plan versus reality",
        icon: BarChart3,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Analytics / Reports",
    eyebrow: "Insight Layer",
    icon: PieChart,
    items: [
      {
        title: "Spending Analysis",
        description: "See where cash is flowing",
        icon: PieChart,
        badge: "Soon",
      },
      {
        title: "Income vs Expense",
        description: "Balance inflow and outflow",
        icon: TrendingUp,
        badge: "Soon",
      },
      {
        title: "Cash Flow",
        description: "Understand liquidity trends",
        icon: BarChart3,
        badge: "Soon",
      },
      {
        title: "Custom Reports",
        description: "Build reusable finance views",
        icon: FileText,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Goals & Planning",
    eyebrow: "Standout",
    icon: Target,
    items: [
      {
        title: "Savings Goals",
        description: "Track milestones and pace",
        icon: Target,
        badge: "Soon",
      },
      {
        title: "Investment Tracking",
        description: "Monitor growth over time",
        icon: TrendingUp,
        badge: "Soon",
      },
      {
        title: "Debt Tracker",
        description: "Reduce liabilities deliberately",
        icon: ShieldCheck,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Collaboration",
    eyebrow: "Multi-user",
    icon: Users,
    items: [
      {
        title: "Shared Accounts",
        description: "Coordinate shared money sources",
        icon: Users,
        badge: "Soon",
      },
      {
        title: "Group Expenses",
        description: "Split and reconcile team spend",
        icon: ReceiptText,
        badge: "Soon",
      },
      {
        title: "Invite Users",
        description: "Add teammates or family members",
        icon: UserPlus,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Security & Audit",
    eyebrow: "Trust Layer",
    icon: ShieldCheck,
    items: [
      {
        title: "Login Activity",
        description: "Review recent access events",
        icon: ShieldCheck,
        badge: "Soon",
      },
      {
        title: "Audit Logs",
        description: "See a trail of key actions",
        icon: History,
        badge: "Soon",
      },
      {
        title: "Permissions",
        description: "Control who can do what",
        icon: LockKeyhole,
        badge: "Soon",
      },
    ],
  },
  {
    title: "Settings",
    eyebrow: "System Setup",
    icon: Settings2,
    items: [
      {
        title: "Profile Settings",
        description: "Personal information and identity",
        icon: Settings2,
        badge: "Soon",
      },
      {
        title: "Currency & Locale",
        description: "Regional finance preferences",
        icon: Globe2,
        badge: "Soon",
      },
      {
        title: "Notifications",
        description: "Alert channels and thresholds",
        icon: BellRing,
        badge: "Soon",
      },
      {
        title: "Integrations",
        description: "Banks, exports, and APIs",
        icon: PlugZap,
        badge: "Soon",
      },
    ],
  },
];

function isRouteActive(pathname: string, href?: string) {
  if (!href) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function statusClassName(tone: NavItem["tone"] = "soon") {
  if (tone === "live") {
    return "border-emerald-200/80 bg-emerald-100/80 text-emerald-800";
  }

  return "border-border/75 bg-white/55 text-foreground/55";
}

function SidebarItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const isActive = isRouteActive(pathname, item.href);

  const content = (
    <>
      <div
        className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition",
          isActive
            ? "border-primary/70 bg-primary text-primary-foreground"
            : "border-border/75 bg-white/60 text-foreground/75",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          {item.badge ? (
            <span
              className={cn(
                "rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                statusClassName(item.tone),
              )}
            >
              {item.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs leading-5 text-foreground/60">{item.description}</p>
      </div>
    </>
  );

  const className = cn(
    "group flex w-full items-start gap-3 rounded-[1.35rem] border px-3 py-3 text-left transition",
    isActive
      ? "border-primary/80 bg-primary/46 shadow-[0_18px_42px_rgba(33,49,43,0.08)]"
      : "border-border/70 bg-background/70 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-white/88",
  );

  if (item.href) {
    return (
      <Link href={item.href} className={className} onClick={onNavigate}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="rounded-[1.8rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(255,255,255,0.28))] p-4 shadow-[0_18px_55px_rgba(33,49,43,0.08)]">
        <div className="flex items-start gap-3">
          <div className="primary-wash flex h-12 w-12 items-center justify-center rounded-2xl">
            <Sparkles className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="eyebrow text-foreground/45">System navigation</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Finance control center</h2>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-foreground/62">
          Built as a full command surface for daily operations, planning, reporting, and audit readiness.
        </p>
      </div>

      <div className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1">
        {navSections.map((section) => {
          const SectionIcon = section.icon;

          return (
            <section key={section.title} className="rounded-[1.7rem] border border-border/75 bg-white/42 p-3 shadow-[0_16px_45px_rgba(33,49,43,0.06)] backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-3 px-1">
                <div className="accent-wash flex h-10 w-10 items-center justify-center rounded-2xl text-foreground">
                  <SectionIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="eyebrow text-foreground/42">{section.eyebrow}</p>
                  <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                </div>
              </div>

              <div className="space-y-2">
                {section.items.map((item) => (
                  <SidebarItem key={item.title} item={item} pathname={pathname} onNavigate={onNavigate} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-5 rounded-[1.8rem] border border-foreground/10 bg-foreground p-4 text-background shadow-[0_28px_80px_rgba(33,49,43,0.2)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-background/46">Pro add-ons</p>
            <h3 className="mt-1 text-lg font-semibold">AI insight deck</h3>
          </div>
          <Badge variant="contrast" className="border-white/15 bg-white/10 text-background">
            Live concept
          </Badge>
        </div>

        <div className="mt-4 space-y-3 text-sm text-background/72">
          <div className="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/6 p-3">
            <Bot className="mt-0.5 h-4 w-4 shrink-0" />
            <p>You overspent on dining this week compared with your four-week average.</p>
          </div>
          <div className="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/6 p-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Smart categorization can auto-tag low-confidence transactions for review.</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="light" size="sm" className="rounded-2xl">
            <Sparkles className="h-4 w-4" />
            Generate insight
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-2xl border-white/14 bg-white/8 text-background hover:bg-white/14"
          >
            <FileDown className="h-4 w-4" />
            Export CSV / PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DashSidebar({ mobile = false, open = false, onClose }: DashSidebarProps) {
  if (!mobile) {
    return (
      <aside className="panel-frost hidden max-h-[calc(100vh-8rem)] rounded-[2rem] p-4 lg:sticky lg:top-28 lg:block">
        <SidebarBody />
      </aside>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close dashboard navigation"
        className="absolute inset-0 bg-foreground/22 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 left-0 flex w-[92vw] max-w-[370px] flex-col bg-transparent p-3">
        <div className="panel-frost flex h-full flex-col rounded-[2rem] p-4 shadow-[0_28px_90px_rgba(33,49,43,0.18)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-foreground/42">Navigation</p>
              <h2 className="mt-1 text-base font-semibold text-foreground">Dashboard modules</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/80 bg-white/55 text-foreground"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <SidebarBody onNavigate={onClose} />
        </div>
      </aside>
    </div>
  );
}
