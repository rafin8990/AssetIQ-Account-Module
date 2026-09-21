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

import { formatCurrency, payableAging } from "./data";

const chartConfig = {
  current: { label: "Current", color: "oklch(0.55 0.11 195)" },
  days1to30: { label: "1-30", color: "oklch(0.7 0.1 85)" },
  days31to60: { label: "31-60", color: "oklch(0.68 0.12 55)" },
  days61to90: { label: "61-90", color: "oklch(0.65 0.14 35)" },
  over90: { label: "90+", color: "oklch(0.6 0.16 25)" },
} satisfies ChartConfig;

export function PayableAgingView() {
  const totals = useMemo(() => {
    return payableAging.reduce(
      (acc, row) => ({
        current: acc.current + row.current,
        days1to30: acc.days1to30 + row.days1to30,
        days31to60: acc.days31to60 + row.days31to60,
        days61to90: acc.days61to90 + row.days61to90,
        over90: acc.over90 + row.over90,
        total: acc.total + row.total,
      }),
      {
        current: 0,
        days1to30: 0,
        days31to60: 0,
        days61to90: 0,
        over90: 0,
        total: 0,
      }
    );
  }, []);

  const chartData = [
    { bucket: "Current", amount: totals.current, fill: "var(--color-current)" },
    { bucket: "1-30", amount: totals.days1to30, fill: "var(--color-days1to30)" },
    {
      bucket: "31-60",
      amount: totals.days31to60,
      fill: "var(--color-days31to60)",
    },
    {
      bucket: "61-90",
      amount: totals.days61to90,
      fill: "var(--color-days61to90)",
    },
    { bucket: "90+", amount: totals.over90, fill: "var(--color-over90)" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Payable Aging
        </h2>
        <p className="text-sm text-muted-foreground">
          Age supplier payables by current, 1–30, 31–60, 61–90, and 90+ days.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Current", value: totals.current },
          { label: "1-30 days", value: totals.days1to30 },
          { label: "31-60 days", value: totals.days31to60 },
          { label: "61-90 days", value: totals.days61to90 },
          { label: "90+ days", value: totals.over90 },
        ].map((item) => (
          <Card
            key={item.label}
            className="border-0 bg-card/90 shadow-sm ring-border/60"
          >
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatCurrency(item.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 xl:col-span-2">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Aging distribution</CardTitle>
            <CardDescription>
              Total payable {formatCurrency(totals.total)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <BarChart data={chartData} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 xl:col-span-3">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Supplier aging sheet</CardTitle>
            <CardDescription>Balances by aging bucket</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Supplier</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">1-30</TableHead>
                  <TableHead className="text-right">31-60</TableHead>
                  <TableHead className="text-right">61-90</TableHead>
                  <TableHead className="text-right">90+</TableHead>
                  <TableHead className="pr-4 text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payableAging.map((row) => (
                  <TableRow key={row.supplier}>
                    <TableCell className="pl-4 font-medium">
                      {row.supplier}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.current)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.days1to30)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.days31to60)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.days61to90)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.over90)}
                    </TableCell>
                    <TableCell className="pr-4 text-right font-semibold tabular-nums">
                      {formatCurrency(row.total)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/40 font-semibold hover:bg-muted/40">
                  <TableCell className="pl-4">Total</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(totals.current)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(totals.days1to30)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(totals.days31to60)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(totals.days61to90)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(totals.over90)}
                  </TableCell>
                  <TableCell className="pr-4 text-right tabular-nums">
                    {formatCurrency(totals.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
