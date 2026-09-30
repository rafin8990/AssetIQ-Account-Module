"use client";

import { useEffect, useState } from "react";

import {
  loadDashboardData,
  type DashboardData,
} from "@/features/dashboard/api/dashboard";
import {
  CashFlowChart,
  IncomeExpenseChart,
} from "@/features/dashboard/dashboard-charts";
import { DashboardKpis } from "@/features/dashboard/dashboard-kpis";
import { ExpenseBreakdownChart } from "@/features/dashboard/expense-breakdown-chart";
import { RecentTransactions } from "@/features/dashboard/recent-transactions";
import { UpcomingPayments } from "@/features/dashboard/upcoming-payments";

const emptyData: DashboardData = {
  kpis: [],
  monthlyIncomeExpense: [],
  cashFlowTrend: [],
  expenseBreakdown: [],
  recentTransactions: [],
  upcomingPayments: [],
};

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const result = await loadDashboardData();
        if (cancelled) return;
        setData(result);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setData(emptyData);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Income, expenses, and cash.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <DashboardKpis metrics={data.kpis} loading={loading} />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <IncomeExpenseChart
            data={data.monthlyIncomeExpense}
            loading={loading}
          />
        </div>
        <div className="xl:col-span-2">
          <ExpenseBreakdownChart
            data={data.expenseBreakdown}
            loading={loading}
          />
        </div>
      </div>

      <CashFlowChart data={data.cashFlowTrend} loading={loading} />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentTransactions
            items={data.recentTransactions}
            loading={loading}
          />
        </div>
        <div className="xl:col-span-2">
          <UpcomingPayments items={data.upcomingPayments} loading={loading} />
        </div>
      </div>
    </div>
  );
}
