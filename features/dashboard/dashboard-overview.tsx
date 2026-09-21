import {
  CashFlowChart,
  IncomeExpenseChart,
} from "@/features/dashboard/dashboard-charts";
import { DashboardKpis } from "@/features/dashboard/dashboard-kpis";
import { ExpenseBreakdownChart } from "@/features/dashboard/expense-breakdown-chart";
import { RecentTransactions } from "@/features/dashboard/recent-transactions";
import { UpcomingPayments } from "@/features/dashboard/upcoming-payments";

export function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Income, expenses, balances, and payment health at a glance.
        </p>
      </div>

      <DashboardKpis />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <IncomeExpenseChart />
        </div>
        <div className="xl:col-span-2">
          <ExpenseBreakdownChart />
        </div>
      </div>

      <CashFlowChart />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentTransactions />
        </div>
        <div className="xl:col-span-2">
          <UpcomingPayments />
        </div>
      </div>
    </div>
  );
}
