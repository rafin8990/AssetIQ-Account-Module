"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building2,
  CircleDollarSign,
  HandCoins,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DashboardKpi } from "./api/dashboard";
import { formatCurrency } from "./data";

const iconMap: Record<DashboardKpi["key"], LucideIcon> = {
  income: TrendingUp,
  expense: TrendingDown,
  profit: CircleDollarSign,
  cash: Wallet,
  bank: Building2,
  receivable: HandCoins,
  payable: Banknote,
};

const toneMap: Record<DashboardKpi["key"], string> = {
  income: "bg-emerald-500/10 text-emerald-600",
  expense: "bg-rose-500/10 text-rose-600",
  profit: "bg-primary/10 text-primary",
  cash: "bg-sky-500/10 text-sky-600",
  bank: "bg-teal-500/10 text-teal-700",
  receivable: "bg-amber-500/10 text-amber-700",
  payable: "bg-orange-500/10 text-orange-700",
};

export function DashboardKpis({
  metrics,
  loading,
}: {
  metrics: DashboardKpi[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card
            key={index}
            className="border-0 bg-card/90 shadow-sm ring-border/60"
          >
            <CardContent className="h-28 animate-pulse bg-muted/40 pt-1" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.key];
        const isProfit = metric.key === "profit";
        const isNegativeProfit = isProfit && metric.value < 0;
        const showChange =
          metric.key !== "receivable" && metric.key !== "payable";

        return (
          <Card
            key={metric.key}
            className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10"
          >
            <CardContent className="flex flex-col gap-3 pt-1">
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    toneMap[metric.key]
                  )}
                >
                  <Icon className="size-4" />
                </div>
                {showChange ? (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-0.5 border-0 font-medium",
                      metric.trend === "up"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    )}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {Math.abs(metric.change)}%
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="border-0 font-normal">
                    Live
                  </Badge>
                )}
              </div>

              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {metric.title}
                </p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-semibold tracking-tight",
                    isNegativeProfit && "text-rose-600",
                    isProfit && !isNegativeProfit && "text-emerald-700"
                  )}
                >
                  {metric.key === "profit" && metric.value > 0 ? "+" : ""}
                  {formatCurrency(metric.value)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <PiggyBank className="size-3 opacity-60" />
                  {metric.hint}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
