"use client";

import {
  ResponsiveContainer as RechartsResponsiveContainer,
  type ResponsiveContainerProps,
} from "recharts";

import { useMounted } from "@/app/hooks/use-mounted";

export function ResponsiveContainer(props: ResponsiveContainerProps) {
  const mounted = useMounted();

  if (!mounted) return null;

  return <RechartsResponsiveContainer minWidth={1} minHeight={1} {...props} />;
}
