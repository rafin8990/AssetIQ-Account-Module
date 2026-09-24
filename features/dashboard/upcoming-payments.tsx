"use client";

import { AlertCircle, CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DashboardPayment } from "./api/dashboard";
import { formatCurrency, formatDate } from "./data";

export function UpcomingPayments({
  items,
  loading,
}: {
  items: DashboardPayment[];
  loading?: boolean;
}) {
  const overdueCount = items.filter((p) => p.status === "overdue").length;

  return (
    <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Upcoming / Overdue</CardTitle>
            <CardDescription>
              Receivables and payables due soon or past due
            </CardDescription>
          </div>
          {overdueCount > 0 ? (
            <Badge className="gap-1 border-0 bg-rose-50 text-rose-700 hover:bg-rose-50">
              <AlertCircle className="size-3" />
              {overdueCount} overdue
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 pt-4">
        {loading ? (
          <div className="h-40 animate-pulse rounded-xl bg-muted/40" />
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No upcoming or overdue items.
          </p>
        ) : (
          items.map((payment) => (
            <div
              key={payment.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
                payment.status === "overdue"
                  ? "border-rose-200/80 bg-rose-50/50"
                  : "border-border/70 bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                  payment.status === "overdue"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-primary/10 text-primary"
                )}
              >
                {payment.status === "overdue" ? (
                  <AlertCircle className="size-4" />
                ) : (
                  <CalendarClock className="size-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium">{payment.party}</p>
                  <p
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      payment.type === "receivable"
                        ? "text-emerald-700"
                        : "text-foreground"
                    )}
                  >
                    {payment.type === "receivable" ? "+" : "−"}
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Due {formatDate(payment.dueDate)}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 border-0 px-1.5 text-[10px] capitalize",
                      payment.status === "overdue"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-sky-50 text-sky-700"
                    )}
                  >
                    {payment.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="h-5 border-0 bg-background/80 px-1.5 text-[10px] capitalize text-muted-foreground"
                  >
                    {payment.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
