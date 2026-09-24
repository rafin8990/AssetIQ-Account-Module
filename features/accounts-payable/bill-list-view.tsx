"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Banknote, Search } from "lucide-react";

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
  listSupplierBills,
  type SupplierBill,
  type SupplierBillStatus,
} from "@/features/accounts-payable/api/supplier-bills";
import { formatCurrency, formatDate } from "./data";

const statusTone: Record<SupplierBillStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  open: "bg-sky-50 text-sky-700",
  partial: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-rose-50 text-rose-700",
};

type BillListVariant = "outstanding" | "due-overdue";

function daysPastDue(dueDate: string) {
  const due = new Date(`${dueDate}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(
    0,
    Math.floor((today.getTime() - due) / (1000 * 60 * 60 * 24))
  );
}

export function BillListView({ variant }: { variant: BillListVariant }) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<SupplierBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title =
    variant === "outstanding" ? "Outstanding Payables" : "Due / Overdue Bills";
  const description =
    variant === "outstanding"
      ? "Open supplier bills with remaining balance (live from Accounts API)."
      : "Open supplier bills due today or already past due (live from Accounts API).";

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSupplierBills({
        outstanding: variant === "outstanding" ? true : undefined,
        dueOverdue: variant === "due-overdue" ? true : undefined,
        searchTerm: query.trim() || undefined,
      });
      const openOnly = data.filter((bill) => bill.balance > 0);
      const sorted =
        variant === "due-overdue"
          ? [...openOnly].sort(
              (a, b) => daysPastDue(b.dueDate) - daysPastDue(a.dueDate)
            )
          : openOnly;
      setRows(sorted);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "Failed to load bills");
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
  const overdueCount = rows.filter((row) => row.status === "overdue").length;
  const colSpan = variant === "due-overdue" ? 8 : 7;

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
            <p className="text-xs text-muted-foreground uppercase">Bills</p>
            <p className="mt-1 text-xl font-semibold">
              {loading ? "…" : rows.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Open payable
            </p>
            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">
              {loading ? "…" : formatCurrency(totalBalance)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Overdue</p>
            <p className="mt-1 text-xl font-semibold text-rose-600">
              {loading ? "…" : overdueCount}
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
                    ? `${rows.length} due/overdue bill(s)`
                    : `${rows.length} open bill(s)`}
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bill, PO, or vendor…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Bill</TableHead>
                <TableHead>PO</TableHead>
                <TableHead>Vendor</TableHead>
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
                      ? "due or overdue"
                      : "open"}{" "}
                    supplier bills found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((bill) => {
                  const overdueDays = daysPastDue(bill.dueDate);
                  return (
                    <TableRow key={bill.id}>
                      <TableCell className="pl-4 font-medium">
                        {bill.billNo}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {bill.sourcePoCode || "—"}
                      </TableCell>
                      <TableCell>{bill.vendor}</TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {formatDate(bill.dueDate)}
                      </TableCell>
                      {variant === "due-overdue" ? (
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "border-0",
                              overdueDays > 0
                                ? "bg-rose-50 text-rose-700"
                                : "bg-sky-50 text-sky-700"
                            )}
                          >
                            {overdueDays > 0 ? `${overdueDays}d` : "Due soon"}
                          </Badge>
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border-0 capitalize",
                            statusTone[bill.status]
                          )}
                        >
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatCurrency(bill.balance)}
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link
                            href="/accounts-payable/supplier-payments"
                            aria-label={`Pay ${bill.billNo}`}
                            title="Pay bill"
                          >
                            <Banknote className="size-4" />
                          </Link>
                        </Button>
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
