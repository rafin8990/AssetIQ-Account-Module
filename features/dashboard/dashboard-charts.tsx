"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { CashTrendPoint, MonthlyPoint } from "./api/dashboard";
import { formatCurrency, formatCurrencyCompact } from "./data";

const incomeExpenseConfig = {
  income: {
    label: "Income",
    color: "oklch(0.62 0.12 170)",
  },
  expense: {
    label: "Expense",
    color: "oklch(0.65 0.14 25)",
  },
} satisfies ChartConfig;

const cashFlowConfig = {
  balance: {
    label: "Cash & Bank",
    color: "oklch(0.55 0.11 195)",
  },
} satisfies ChartConfig;

export function IncomeExpenseChart({
  data,
  loading,
}: {
  data: MonthlyPoint[];
  loading?: boolean;
}) {
  return (
    <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle>Monthly Income vs Expense</CardTitle>
        <CardDescription>
          Year-to-date comparison from approved vouchers
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="h-[280px] animate-pulse rounded-xl bg-muted/40" />
        ) : data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No income/expense activity this year yet.
          </p>
        ) : (
          <ChartContainer
            config={incomeExpenseConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
                tickFormatter={(value) => formatCurrencyCompact(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="income"
                fill="var(--color-income)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="expense"
                fill="var(--color-expense)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function CashFlowChart({
  data,
  loading,
}: {
  data: CashTrendPoint[];
  loading?: boolean;
}) {
  return (
    <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle>Cash & Bank Trend</CardTitle>
        <CardDescription>Combined liquidity over the year</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="h-[280px] animate-pulse rounded-xl bg-muted/40" />
        ) : data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No cash/bank book activity this year yet.
          </p>
        ) : (
          <ChartContainer
            config={cashFlowConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-balance)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-balance)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={52}
                tickFormatter={(value) => formatCurrencyCompact(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--color-balance)"
                strokeWidth={2.5}
                fill="url(#fillBalance)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
