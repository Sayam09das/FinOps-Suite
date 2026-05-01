import {
  Landmark,
  Wallet,
  TrendingUp,
  CreditCard,
  Banknote,
  AlertTriangle,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  Home,
  Car,
} from "lucide-react";
import { ENDPOINTS } from "@/app/lib/api/endpoints";
import api from "@/app/lib/api/client";

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

// Icon mapping for backend category data
const getIconForCategory = (category: string) => {
  const iconMap: Record<string, any> = {
    bank: Landmark,
    cash: Wallet,
    investments: TrendingUp,
    credit_card: CreditCard,
    loan: Banknote,
    salary: Landmark,
    freelance: TrendingUp,
    rent: Home,
    utilities: Wallet,
    food: Wallet,
    transport: Car,
    entertainment: Sparkles,
    shopping: Wallet,
    health: AlertTriangle,
    other: Wallet,
  };
  return iconMap[category.toLowerCase()] || Wallet;
};

// Map backend response to frontend types
export function mapBackendToViewModel(data: any): NetWorthViewModel {
  const backendNetWorth = data;

  // Map assets
  const assets: AssetItem[] = (backendNetWorth.assets || []).map((asset: any, index: number) => ({
    id: asset.id || `asset-${index}`,
    name: asset.name,
    category: asset.category,
    amount: asset.amount || 0,
    percentage: asset.percentage || 0,
    icon: getIconForCategory(asset.category),
    color: COLORS[Object.keys(COLORS)[index % Object.keys(COLORS).length] as keyof typeof COLORS] || COLORS.emerald,
    change: asset.change,
  }));

  // Map liabilities
  const liabilities: LiabilityItem[] = (backendNetWorth.liabilities || []).map((liability: any, index: number) => ({
    id: liability.id || `liability-${index}`,
    name: liability.name,
    category: liability.category,
    amount: liability.amount || 0,
    percentage: liability.percentage || 0,
    icon: getIconForCategory(liability.category),
    color: COLORS.rose,
    interestRate: liability.interestRate,
    dueDate: liability.dueDate,
    dueInDays: liability.dueInDays,
    change: liability.change,
  }));

  // Map asset distribution
  const assetDistribution: AssetDistributionSlice[] = (backendNetWorth.assetDistribution || []).map(
    (item: any, index: number) => ({
      name: item.name,
      value: item.value || 0,
      percentage: item.percentage || 0,
      color: Object.values(COLORS)[index % Object.values(COLORS).length] as string,
    })
  );

  // Map trend series - ensure proper structure
  const trendSeries: Record<NetWorthTimeRange, TrendPoint[]> = {
    "1M": (backendNetWorth.trendSeries || []).slice(0, 5).map((point: any) => ({
      label: point.label || "W1",
      value: point.value || 0,
      assets: point.assets || 0,
      liabilities: point.liabilities || 0,
    })),
    "3M": (backendNetWorth.trendSeries || []).slice(0, 13).map((point: any) => ({
      label: point.label || "W1",
      value: point.value || 0,
      assets: point.assets || 0,
      liabilities: point.liabilities || 0,
    })),
    "6M": (backendNetWorth.trendSeries || []).slice(0, 25).map((point: any) => ({
      label: point.label || "W1",
      value: point.value || 0,
      assets: point.assets || 0,
      liabilities: point.liabilities || 0,
    })),
    "1Y": (backendNetWorth.trendSeries || []).map((point: any) => ({
      label: point.label || "Jan",
      value: point.value || 0,
      assets: point.assets || 0,
      liabilities: point.liabilities || 0,
    })),
  };

  // Map insights with icons
  const insights: NetWorthInsight[] = (backendNetWorth.insights || []).map((insight: any) => {
    const iconMap: Record<string, any> = {
      ArrowUpRight,
      TrendingDown,
      Sparkles,
      AlertTriangle,
    };
    return {
      id: insight.id,
      title: insight.title,
      detail: insight.detail,
      tone: insight.tone || "neutral",
      icon: iconMap[insight.icon] || Sparkles,
      metric: insight.metric,
    };
  });

  // Build NetWorthData
  const netWorth: NetWorthData = {
    totalNetWorth: backendNetWorth.totalNetWorth || 0,
    totalAssets: backendNetWorth.totalAssets || 0,
    totalLiabilities: backendNetWorth.totalLiabilities || 0,
    changeAmount: backendNetWorth.changeAmount || 0,
    changePercent: backendNetWorth.changePercent || 0,
    changeDirection: backendNetWorth.changeDirection || "up",
    currency: backendNetWorth.currency || "INR",
  };

  return {
    netWorth,
    assets,
    liabilities,
    assetDistribution,
    trendSeries,
    insights,
    healthScore: backendNetWorth.healthScore || 0,
    projection: {
      futureValue: backendNetWorth.projection?.futureValue || 0,
      months: backendNetWorth.projection?.months || 6,
      confidence: backendNetWorth.projection?.confidence || 75,
    },
  };
}

// --- Build View Model from demo data (fallback) ---
export function buildNetWorthViewModel(): NetWorthViewModel {
  // Demo net worth data - empty when no data
  const netWorthData: NetWorthData = {
    totalNetWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    changeAmount: 0,
    changePercent: 0,
    changeDirection: "up",
    currency: "INR",
  };

  const assets: AssetItem[] = [];
  const liabilities: LiabilityItem[] = [];
  const assetDistribution: AssetDistributionSlice[] = [];

  const generateTrendSeries = (): Record<NetWorthTimeRange, TrendPoint[]> => ({
    "1M": [],
    "3M": [],
    "6M": [],
    "1Y": [],
  });

  const insights: NetWorthInsight[] = [
    {
      id: "i1",
      title: "No data yet",
      detail: "Add transactions to see your net worth insights.",
      tone: "neutral",
      icon: Sparkles,
    },
  ];

  return {
    netWorth: netWorthData,
    assets,
    liabilities,
    assetDistribution,
    trendSeries: generateTrendSeries(),
    insights,
    healthScore: 0,
    projection: {
      futureValue: 0,
      months: 6,
      confidence: 0,
    },
  };
}

// --- Fetch Net Worth data from API ---
export async function fetchNetWorthData(): Promise<NetWorthViewModel> {
  try {
    const data = await api.get(ENDPOINTS.DASHBOARD.NETWORTH);
    return mapBackendToViewModel(data);
  } catch (error) {
    console.error("Failed to fetch net worth data:", error);
    return buildNetWorthViewModel();
  }
}

// --- Loading state helper ---
export function useNetWorthData() {
  // This function now returns data from the API
  // For React Query integration, use useNetWorthQuery from @/app/lib/api/queries
  return {
    data: fetchNetWorthData(),
    isLoading: false,
    refetch: fetchNetWorthData,
  };
}
