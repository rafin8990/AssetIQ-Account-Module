"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Banknote, Printer, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  listCustomerInvoices,
  type CustomerInvoice,
  type InvoiceStatus,
} from "@/features/accounts-receivable/api/customer-invoices";
import { formatCurrency, formatDate } from "./data";

const statusTone: Record<InvoiceStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-sky-50 text-sky-700",
  partial: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-rose-50 text-rose-700",
};

type InvoiceListVariant = "outstanding" | "due-overdue";

type InvoiceListViewProps = {
  variant: InvoiceListVariant;
};

function daysUntilDue(dueDate: string) {
  const due = new Date(`${dueDate}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((due - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function InvoiceListView({ variant }: InvoiceListViewProps) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<CustomerInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title =
    variant === "outstanding"
      ? "Outstanding Receivables"
      : "Due / Overdue Invoices";
  const description =
    variant === "outstanding"
      ? "Open order invoices with a remaining balance."
      : "Open order invoices that still have a balance, including upcoming due dates.";

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCustomerInvoices({
        outstanding: variant === "outstanding" ? true : undefined,
        dueOverdue: variant === "due-overdue" ? true : undefined,
        searchTerm: query.trim() || undefined,
        invoiceKind: "order",
      });
      const orderOnly = data.filter(
        (invoice) => invoice.invoiceKind !== "payment" && invoice.balance > 0
      );
      const sorted =
        variant === "due-overdue"
          ? [...orderOnly].sort(
              (a, b) => daysUntilDue(a.dueDate) - daysUntilDue(b.dueDate)
            )
          : orderOnly;
      setRows(sorted);
    } catch (err) {
      setRows([]);
      setError(
        err instanceof Error ? err.message : "Failed to load invoices"
      );
    } finally {
      setLoading(false);
    }
  }, [query, variant]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRows();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadRows]);

  const totalBalance = useMemo(
    () => rows.reduce((sum, row) => sum + row.balance, 0),
    [rows]
  );
  const overdueCount = rows.filter((row) => daysUntilDue(row.dueDate) < 0).length;
  const colSpan = variant === "due-overdue" ? 10 : 9;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Invoices</p>
            <p className="mt-1 text-xl font-semibold">
              {loading ? "…" : rows.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Open balance
            </p>
            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">
              {formatCurrency(totalBalance)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Overdue</p>
            <p className="mt-1 text-xl font-semibold text-rose-600">
              {overdueCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>
                {loading
                  ? "Loading…"
                  : variant === "due-overdue"
                    ? `${rows.length} due/overdue order invoice(s)`
                    : `${rows.length} order invoice(s)`}
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search invoice, order, or customer…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Invoice</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Due date</TableHead>
                {variant === "due-overdue" ? (
                  <TableHead>Days past due</TableHead>
                ) : null}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={colSpan}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={colSpan}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No{" "}
                    {variant === "due-overdue"
                      ? "due or overdue order invoices"
                      : "open order invoices"}{" "}
                    found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((invoice) => {
                  const daysLeft = daysUntilDue(invoice.dueDate);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="pl-4 font-medium">
                        {invoice.invoiceNo}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="border-0 capitalize"
                        >
                          {invoice.invoiceKind}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {invoice.sourceOrderCode || "—"}
                      </TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {formatDate(invoice.dueDate)}
                      </TableCell>
                      {variant === "due-overdue" ? (
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "border-0",
                              daysLeft < 0
                                ? "bg-rose-50 text-rose-700"
                                : daysLeft === 0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-sky-50 text-sky-700"
                            )}
                          >
                            {daysLeft < 0
                              ? `${Math.abs(daysLeft)}d overdue`
                              : daysLeft === 0
                                ? "Due today"
                                : `Due in ${daysLeft}d`}
                          </Badge>
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border-0 capitalize",
                            statusTone[invoice.status]
                          )}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatCurrency(invoice.balance)}
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link
                              href="/accounts-receivable/receive-payment"
                              aria-label={`Receive payment for ${invoice.invoiceNo}`}
                              title="Receive payment"
                            >
                              <Banknote className="size-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link
                              href={`/accounts-receivable/customer-invoices/print?no=${encodeURIComponent(invoice.invoiceNo)}`}
                              aria-label={`Print ${invoice.invoiceNo}`}
                              title="Print"
                            >
                              <Printer className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
