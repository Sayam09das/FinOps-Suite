"use client"

import { ResponsiveContainer } from "@/app/components/charts/MountedResponsiveContainer";
import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Sector } from 'recharts';

import { Card } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils/number"

import type { AssetDistributionSlice } from "./types"

interface AssetDistributionChartProps {
  data: AssetDistributionSlice[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderActiveShape(props: any) {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props

  return (
    <g>
      <text x={cx} y={cy - 8} dy={0} textAnchor="middle" fill="#21312b" className="text-base font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 14} dy={0} textAnchor="middle" fill="#5b6b64" className="text-xs">
        {formatCurrency(value, "INR", "en-IN")}
      </text>
      <text x={cx} y={cy + 32} dy={0} textAnchor="middle" fill="#5b6b64" className="text-xs">
        {(percent * 100).toFixed(0)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 14}
        fill={fill}
      />
    </g>
  )
}

export default function AssetDistributionChart({ data }: AssetDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
    >
      <Card variant="surface" padding="lg">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            Asset Distribution
          </h3>
          <p className="mt-0.5 text-sm text-foreground/55">
            Where your money is sitting
          </p>
        </div>

        <div className="relative mt-4 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={onPieEnter}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: index === activeIndex ? "brightness(1.05)" : "brightness(1)",
                      transition: "filter 0.2s ease",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">{data[activeIndex]?.name}</p>
              <p className="text-xs text-foreground/60">
                {formatCurrency(data[activeIndex]?.value ?? 0, "INR", "en-IN")}
              </p>
              <p className="text-xs text-foreground/50">{data[activeIndex]?.percentage}%</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {data.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.08 }}
              onMouseEnter={() => setActiveIndex(index)}
              className="flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm"
              style={{
                borderColor: index === activeIndex ? item.color : undefined,
                backgroundColor: index === activeIndex ? `${item.color}12` : undefined,
              }}
            >
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground/80">{item.name}</span>
              <span className="text-foreground/50">{item.percentage}%</span>
            </motion.button>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
