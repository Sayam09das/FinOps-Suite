import {
  Landmark,
  Wallet,
  TrendingUp,
  CreditCard,
  Banknote,
  Receipt,
  PiggyBank,
  Home,
  Car,
  Gem,
  AlertTriangle,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Target,
  Lightbulb,
} from "lucide-react";

import type {
  AssetDistributionSlice,
  AssetItem,
  LiabilityItem,
  NetWorthData,
  NetWorthInsight,
  NetWorthTimeRange,
  NetWorthViewModel,
  TrendPoint,
} from "./types";

// --- Color palette matching existing design system ---
const COLORS = {
  emerald: "#2f7d67",
  rose: "#d27768",
  amber: "#d0a24d",
  blue: "#5687cc",
  violet: "#8d6ad8",
  teal: "#4f9e96",
};

// --- Demo net worth data ---
const netWorthData: NetWorthData = {
  totalNetWorth: 425000,
  totalAssets: 500000,
  totalLiabilities: 75000,
  changeAmount: 25000,
  changePercent: 6.2,
  changeDirection: "up",
  currency: "INR",
};

// --- Assets ---
const assets: AssetItem[] = [
  {
    id: "a1",
    name: "Bank Accounts",
    category: "bank",
    amount: 200000,
    percentage: 40,
    icon: Landmark,
    color: COLORS.emerald,
    change: 3.5,
  },
  {
    id: "a2",
    name: "Investments",
    category: "investments",
    amount: 225000,
    percentage: 45,
    icon: TrendingUp,
    color: COLORS.blue,
    change: 8.2,
  },
  {
    id: "a3",
    name: "Cash",
    category: "cash",
    amount: 75000,
    percentage: 15,
    icon: Wallet,
    color: COLORS.amber,
    change: 1.2,
  },
];

// --- Liabilities ---
const liabilities: LiabilityItem[] = [
  {
    id: "l1",
    name: "Credit Card",
    category: "credit_card",
    amount: 30000,
    percentage: 40,
    icon: CreditCard,
    color: COLORS.rose,
    interestRate: 18.5,
    dueDate: "2025-07-15",
    dueInDays: 12,
    change: -2.4,
  },
  {
    id: "l2",
    name: "Personal Loan",
    category: "loan",
    amount: 45000,
    percentage: 60,
    icon: Banknote,
    color: COLORS.violet,
    interestRate: 11.2,
    dueDate: "2025-07-05",
    dueInDays: 2,
    change: -5.1,
  },
];

// --- Asset Distribution (donut data) ---
const assetDistribution: AssetDistributionSlice[] = [
  { name: "Investments", value: 225000, percentage: 45, color: COLORS.blue },
  { name: "Bank Accounts", value: 200000, percentage: 40, color: COLORS.emerald },
  { name: "Cash", value: 75000, percentage: 15, color: COLORS.amber },
];

// --- Trend Series Generation ---
function generateTrendSeries(): Record<NetWorthTimeRange, TrendPoint[]> {
  const baseValue = 425000;
  const baseAssets = 500000;
  const baseLiabilities = 75000;

  const ranges: Record<NetWorthTimeRange, number> = {
    "1M": 4,
    "3M": 12,
    "6M": 24,
    "1Y": 12,
  };

  const generatePoints = (count: number, range: NetWorthTimeRange): TrendPoint[] => {
    const points: TrendPoint[] = [];
    for (let i = 0; i <= count; i++) {
      const progress = i / count;
      // Add some noise and upward drift
      const drift = progress * 35000 + Math.sin(progress * Math.PI * 3) * 8000;
      const assetsVal = baseAssets - (count - i) * 2000 + drift * 1.1;
      const liabilitiesVal = baseLiabilities - (count - i) * 500 + Math.sin(progress * Math.PI * 2) * 3000;

      let label: string;
      if (range === "1M") {
        label = `Week ${i + 1}`;
      } else if (range === "3M" || range === "6M") {
        label = `W${i + 1}`;
      } else {
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        label = months[i];
      }

      points.push({
        label,
        value: Math.round(assetsVal - liabilitiesVal),
        assets: Math.round(assetsVal),
        liabilities: Math.round(Math.max(liabilitiesVal, 10000)),
      });
    }
    return points;
  };

  return {
    "1M": generatePoints(4, "1M"),
    "3M": generatePoints(12, "3M"),
    "6M": generatePoints(24, "6M"),
    "1Y": generatePoints(11, "1Y"),
  };
}

// --- Insights ---
const insights: NetWorthInsight[] = [
  {
    id: "i1",
    title: "Salary drove growth",
    detail: "Net worth increased mainly due to salary income this month. Your income streams are stable.",
    tone: "positive",
    icon: ArrowUpRight,
    metric: "+65%",
  },
  {
    id: "i2",
    title: "Debt reduced by 12%",
    detail: "You paid off ₹5,400 in liabilities this month. Keep the momentum going.",
    tone: "positive",
    icon: TrendingDown,
    metric: "-12%",
  },
  {
    id: "i3",
    title: "Investments leading growth",
    detail: "Investments contributed 65% of your net worth growth. Diversification is paying off.",
    tone: "neutral",
    icon: Sparkles,
    metric: "65%",
  },
  {
    id: "i4",
    title: "Credit card due soon",
    detail: "Your credit card bill is due in 12 days. Consider paying early to avoid interest.",
    tone: "warning",
    icon: AlertTriangle,
    metric: "12 days",
  },
];

// --- Financial Health Score ---
function calculateHealthScore(): number {
  const assetLiabilityRatio = netWorthData.totalAssets / netWorthData.totalLiabilities;
  const changeScore = Math.min(netWorthData.changePercent * 3, 30);
  const ratioScore = Math.min(assetLiabilityRatio * 10, 40);
  return Math.round(Math.min(60 + changeScore + ratioScore, 98));
}

// --- Future Projection ---
function calculateProjection(): NetWorthViewModel["projection"] {
  const monthlyGrowth = netWorthData.changeAmount;
  const months = 6;
  const futureValue = netWorthData.totalNetWorth + monthlyGrowth * months;
  return {
    futureValue: Math.round(futureValue),
    months,
    confidence: 78,
  };
}

// --- Build View Model ---
export function buildNetWorthViewModel(): NetWorthViewModel {
  return {
    netWorth: netWorthData,
    assets,
    liabilities,
    assetDistribution,
    trendSeries: generateTrendSeries(),
    insights,
    healthScore: calculateHealthScore(),
    projection: calculateProjection(),
  };
}

// --- Loading state helper ---
export function useNetWorthData() {
  // In a real app, this would use React Query
  // For now, return demo data immediately
  return {
    data: buildNetWorthViewModel(),
    isLoading: false,
  };
}

