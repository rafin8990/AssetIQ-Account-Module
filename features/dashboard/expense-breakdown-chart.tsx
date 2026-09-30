"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { ExpenseSlice } from "./api/dashboard";
import { formatCurrency } from "./data";

export function ExpenseBreakdownChart({
  data,
  loading,
}: {
  data: ExpenseSlice[];
  loading?: boolean;
}) {
  const chartConfig = Object.fromEntries(
    data.map((item) => [
      item.key,
      { label: item.category, color: item.fill },
    ])
  ) satisfies ChartConfig;

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Share of approved spending by expense account</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="h-[220px] animate-pulse rounded-xl bg-muted/40" />
        ) : data.length === 0 || total === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No approved expenses yet.
          </p>
        ) : (
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[220px] w-full max-w-[240px]"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="category"
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={58}
                  outerRadius={88}
                  strokeWidth={3}
                  stroke="var(--card)"
                >
                  {data.map((entry) => (
                    <Cell key={entry.key} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul className="flex min-w-[180px] flex-col gap-2.5">
              {data.map((item) => {
                const pct = Math.round((item.amount / total) * 100);
                return (
                  <li
                    key={item.key}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: item.fill }}
                      />
                      <span className="truncate text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-medium tabular-nums">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
