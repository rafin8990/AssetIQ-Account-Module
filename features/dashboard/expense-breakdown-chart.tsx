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

import { expenseBreakdown, formatCurrency } from "./data";

const chartConfig = {
  operations: { label: "Operations", color: "oklch(0.55 0.11 195)" },
  payroll: { label: "Payroll", color: "oklch(0.62 0.12 170)" },
  vendors: { label: "Vendors", color: "oklch(0.7 0.1 85)" },
  utilities: { label: "Utilities", color: "oklch(0.65 0.1 230)" },
  other: { label: "Other", color: "oklch(0.7 0.05 220)" },
} satisfies ChartConfig;

const total = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);

export function ExpenseBreakdownChart() {
  return (
    <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Share of spending by category</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
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
                data={expenseBreakdown}
                dataKey="amount"
                nameKey="category"
                innerRadius={58}
                outerRadius={88}
                strokeWidth={3}
                stroke="var(--card)"
              >
                {expenseBreakdown.map((entry) => (
                  <Cell key={entry.category} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <ul className="flex min-w-[180px] flex-col gap-2.5">
            {expenseBreakdown.map((item) => {
              const key = item.category.toLowerCase() as keyof typeof chartConfig;
              const pct = Math.round((item.amount / total) * 100);

              return (
                <li
                  key={item.category}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: item.fill }}
                    />
                    <span className="text-muted-foreground">
                      {chartConfig[key]?.label ?? item.category}
                    </span>
                  </div>
                  <span className="font-medium tabular-nums">{pct}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
