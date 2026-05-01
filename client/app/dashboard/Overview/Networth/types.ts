import type { LucideIcon } from "lucide-react";

export type NetWorthTimeRange = "1M" | "3M" | "6M" | "1Y";
export type NetWorthTone = "positive" | "warning" | "danger" | "neutral";

export interface TrendPoint {
  label: string;
  value: number;
  assets?: number;
  liabilities?: number;
}

export interface AssetItem {
  id: string;
  name: string;
  category: "bank" | "cash" | "investments" | "real_estate" | "other";
  amount: number;
  percentage: number;
  icon: LucideIcon;
  color: string;
  change?: number;
}

export interface LiabilityItem {
  id: string;
  name: string;
  category: "credit_card" | "loan" | "emi" | "mortgage" | "other";
  amount: number;
  percentage: number;
  icon: LucideIcon;
  color: string;
  interestRate?: number;
  dueDate?: string;
  dueInDays?: number;
  change?: number;
}

export interface AssetDistributionSlice {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface NetWorthInsight {
  id: string;
  title: string;
  detail: string;
  tone: NetWorthTone;
  icon: LucideIcon;
  metric?: string;
}

export interface NetWorthData {
  // Core net worth data
  totalNetWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  changeAmount: number;
  changePercent: number;
  changeDirection: "up" | "down";
  currency?: string;
  
  // Extended data from API
  assets?: AssetItem[];
  liabilities?: LiabilityItem[];
  assetDistribution?: AssetDistributionSlice[];
  trendSeries?: TrendPoint[];
  insights?: NetWorthInsight[];
  healthScore?: number;
  projection?: {
    futureValue: number;
    months: number;
    confidence: number;
  };
}

export interface NetWorthViewModel {
  netWorth: NetWorthData;
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  assetDistribution: AssetDistributionSlice[];
  trendSeries: Record<NetWorthTimeRange, TrendPoint[]>;
  insights: NetWorthInsight[];
  healthScore: number;
  projection: {
    futureValue: number;
    months: number;
    confidence: number;
  };
}

