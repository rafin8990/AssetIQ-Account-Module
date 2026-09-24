"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import {
  budgetComparisons,
  formatCurrency,
  formatCurrencyCompact,
  getVariance,
  getVariancePct,
} from "./data";

const chartConfig = {
  budget: { label: "Budget", color: "oklch(0.55 0.11 195)" },
  actual: { label: "Actual", color: "oklch(0.65 0.12 25)" },
} satisfies ChartConfig;

type ReportKind = "vs-actual" | "variance";

export function BudgetReportView({ kind }: { kind: ReportKind }) {
  const totals = useMemo(() => {
    return budgetComparisons.reduce(
      (acc, row) => ({
        budget: acc.budget + row.budget,
        actual: acc.actual + row.actual,
      }),
      { budget: 0, actual: 0 }
    );
  }, []);

  const chartData = budgetComparisons.map((row) => ({
    category: row.category,
    budget: row.budget,
    actual: row.actual,
  }));

  const title = kind === "vs-actual" ? "Budget vs Actual" : "Variance Report";
  const description =
    kind === "vs-actual"
      ? "Compare planned budget against actual spend by category."
      : "Highlight favorable and unfavorable variances across categories.";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Budget</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(totals.budget)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Actual</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(totals.actual)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Variance</p>
            <p
              className={cn(
                "mt-1 text-xl font-semibold tabular-nums",
                totals.actual > totals.budget
                  ? "text-rose-600"
                  : "text-emerald-700"
              )}
            >
              {formatCurrency(totals.actual - totals.budget)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">
            {kind === "vs-actual" ? "Budget vs Actual chart" : "Variance by category"}
          </CardTitle>
          <CardDescription>Category-level comparison</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <BarChart data={chartData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
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
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="budget"
                fill="var(--color-budget)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="actual"
                fill="var(--color-actual)"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Detailed breakdown</CardTitle>
          <CardDescription>
            {kind === "variance"
              ? "Positive variance means overspend"
              : "Budget and actual side by side"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Category</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="pr-4 text-right">Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetComparisons.map((row) => {
                const variance = getVariance(row.budget, row.actual);
                const pct = getVariancePct(row.budget, row.actual);
                return (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4 font-medium">
                      {row.category}
                    </TableCell>
                    <TableCell>{row.scope}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.budget)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.actual)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "pr-4 text-right font-semibold tabular-nums",
                        variance > 0 ? "text-rose-600" : "text-emerald-700"
                      )}
                    >
                      {variance > 0 ? "+" : ""}
                      {formatCurrency(variance)}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        ({pct.toFixed(1)}%)
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
