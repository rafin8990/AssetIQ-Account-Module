"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  CircleAlert,
  CircleCheck,
  Clock3,
  Flame,
  Gauge,
  Percent,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  agingBuckets,
  analyticsKpis,
  cashPosition,
  departmentPerformance,
  formatCurrency,
  formatCurrencyCompact,
  formatPercent,
  incomeMix,
  insights,
  marginTrend,
  revenueExpenseTrend,
  topCustomers,
  topVendors,
} from "./data";

const iconMap: Record<(typeof analyticsKpis)[number]["key"], LucideIcon> = {
  revenue: TrendingUp,
  expense: TrendingDown,
  margin: Percent,
  burn: Flame,
  dso: Clock3,
  dpo: Clock3,
  liquidity: Gauge,
  runway: Wallet,
};

const toneMap: Record<(typeof analyticsKpis)[number]["key"], string> = {
  revenue: "bg-emerald-500/10 text-emerald-600",
  expense: "bg-rose-500/10 text-rose-600",
  margin: "bg-primary/10 text-primary",
  burn: "bg-orange-500/10 text-orange-700",
  dso: "bg-amber-500/10 text-amber-700",
  dpo: "bg-sky-500/10 text-sky-600",
  liquidity: "bg-teal-500/10 text-teal-700",
  runway: "bg-indigo-500/10 text-indigo-600",
};

const revenueConfig = {
  revenue: { label: "Revenue", color: "oklch(0.62 0.12 170)" },
  expense: { label: "Expense", color: "oklch(0.65 0.14 25)" },
  profit: { label: "Profit", color: "oklch(0.55 0.11 195)" },
} satisfies ChartConfig;

const marginConfig = {
  margin: { label: "Margin %", color: "oklch(0.55 0.11 195)" },
} satisfies ChartConfig;

const agingConfig = {
  receivable: { label: "Receivable", color: "oklch(0.7 0.1 85)" },
  payable: { label: "Payable", color: "oklch(0.65 0.1 230)" },
} satisfies ChartConfig;

const departmentConfig = {
  budget: { label: "Budget", color: "oklch(0.7 0.05 220)" },
  actual: { label: "Actual", color: "oklch(0.55 0.11 195)" },
} satisfies ChartConfig;

const incomeMixConfig = {
  product: { label: "Product Sales", color: "oklch(0.55 0.11 195)" },
  services: { label: "Services", color: "oklch(0.62 0.12 170)" },
  subs: { label: "Subscriptions", color: "oklch(0.7 0.1 85)" },
  other: { label: "Other", color: "oklch(0.7 0.05 220)" },
} satisfies ChartConfig;

function formatKpiValue(metric: (typeof analyticsKpis)[number]) {
  if ("isPercent" in metric && metric.isPercent) return `${metric.value}%`;
  if ("isDays" in metric && metric.isDays) return `${metric.value}d`;
  if ("isMonths" in metric && metric.isMonths) return `${metric.value} mo`;
  if ("isRatio" in metric && metric.isRatio) return metric.value.toFixed(2);
  return formatCurrency(metric.value);
}

const incomeTotal = incomeMix.reduce((sum, item) => sum + item.amount, 0);

export function AnalyticsOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Financial performance, cash health, and operational insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="ytd">
            <SelectTrigger className="w-[160px]" size="sm">
              <CalendarRange className="size-3.5 text-muted-foreground" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mtd">This month</SelectItem>
              <SelectItem value="qtd">This quarter</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="fy">Fiscal year</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsKpis.map((metric) => {
          const Icon = iconMap[metric.key];
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
                    {Math.abs(metric.change)}
                    {"isRatio" in metric && metric.isRatio ? "" : "%"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {metric.title}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                    {formatKpiValue(metric)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {metric.hint}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 xl:col-span-3">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Revenue, Expense & Profit</CardTitle>
            <CardDescription>
              Monthly performance across the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={revenueConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <ComposedChart
                data={revenueExpenseTrend}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-expense)"
                      stopOpacity={0.22}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-expense)"
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  fill="url(#fillRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--color-expense)"
                  strokeWidth={2}
                  fill="url(#fillExpense)"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--color-profit)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 xl:col-span-2">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Income Mix</CardTitle>
            <CardDescription>Revenue by source</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid items-center gap-4">
              <ChartContainer
                config={incomeMixConfig}
                className="mx-auto aspect-square h-[200px] w-full max-w-[220px]"
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="source"
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                    }
                  />
                  <Pie
                    data={incomeMix}
                    dataKey="amount"
                    nameKey="source"
                    innerRadius={52}
                    outerRadius={80}
                    strokeWidth={3}
                    stroke="var(--card)"
                  >
                    {incomeMix.map((entry) => (
                      <Cell key={entry.source} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <ul className="flex flex-col gap-2">
                {incomeMix.map((item) => {
                  const pct = Math.round((item.amount / incomeTotal) * 100);
                  return (
                    <li
                      key={item.source}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: item.fill }}
                        />
                        <span className="text-muted-foreground">
                          {item.source}
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
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Gross Margin Trend</CardTitle>
            <CardDescription>Monthly margin percentage</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={marginConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <LineChart
                data={marginTrend}
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
                  width={40}
                  domain={[0, 50]}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${Number(value).toFixed(1)}%`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke="var(--color-margin)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-margin)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>AR / AP Aging</CardTitle>
            <CardDescription>
              Outstanding receivables vs payables by age
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={agingConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <BarChart
                data={agingBuckets}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="bucket"
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
                  dataKey="receivable"
                  fill="var(--color-receivable)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="payable"
                  fill="var(--color-payable)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 xl:col-span-3">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Department Budget vs Actual</CardTitle>
            <CardDescription>
              Spend performance by cost center / department
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={departmentConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <BarChart
                data={departmentPerformance}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrencyCompact(Number(value))}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={88}
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
                  radius={[0, 4, 4, 0]}
                  maxBarSize={14}
                />
                <Bar
                  dataKey="actual"
                  fill="var(--color-actual)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={14}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 xl:col-span-2">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Cash Position</CardTitle>
            <CardDescription>Liquidity by account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            {cashPosition.map((item) => (
              <div key={item.account} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{item.account}</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(item.balance)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/80 transition-all"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {item.share}% of total liquidity
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest revenue contributors</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Customer</TableHead>
                  <TableHead className="text-right">Invoices</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="pr-6 text-right">Outstanding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="pl-6 font-medium">{row.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.invoices}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.revenue)}
                    </TableCell>
                    <TableCell className="pr-6 text-right tabular-nums">
                      {row.outstanding === 0 ? (
                        <Badge
                          variant="secondary"
                          className="border-0 bg-emerald-50 text-emerald-700"
                        >
                          Cleared
                        </Badge>
                      ) : (
                        formatCurrency(row.outstanding)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Highest spend suppliers</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Vendor</TableHead>
                  <TableHead className="text-right">Bills</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="pr-6 text-right">Outstanding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="pl-6 font-medium">{row.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.bills}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.spend)}
                    </TableCell>
                    <TableCell className="pr-6 text-right tabular-nums">
                      {formatCurrency(row.outstanding)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>
            Automated highlights from current financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4 sm:grid-cols-2">
          {insights.map((item) => (
            <div
              key={item.title}
              className={cn(
                "flex gap-3 rounded-xl border border-border/60 p-3.5",
                item.tone === "positive"
                  ? "bg-emerald-50/50"
                  : "bg-amber-50/50"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                  item.tone === "positive"
                    ? "bg-emerald-500/10 text-emerald-700"
                    : "bg-amber-500/10 text-amber-700"
                )}
              >
                {item.tone === "positive" ? (
                  <CircleCheck className="size-4" />
                ) : (
                  <CircleAlert className="size-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        Variance summary: Marketing {formatPercent(20)} over budget · Operations{" "}
        {formatPercent(-5)} under · Overall profit margin{" "}
        <span className="font-medium text-foreground">33.1%</span> YTD
      </div>
    </div>
  );
}
