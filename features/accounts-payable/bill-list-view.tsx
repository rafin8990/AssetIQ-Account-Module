"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  formatCurrency,
  formatDate,
  getDueOverdueBills,
  getOutstandingBills,
  type BillStatus,
  type SupplierBill,
} from "./data";

const statusTone: Record<BillStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  open: "bg-sky-50 text-sky-700",
  partial: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  overdue: "bg-rose-50 text-rose-700",
};

type BillListVariant = "outstanding" | "due-overdue";

function daysPastDue(dueDate: string) {
  const due = new Date(dueDate).getTime();
  const today = new Date("2026-03-21").getTime();
  return Math.max(0, Math.floor((today - due) / (1000 * 60 * 60 * 24)));
}

export function BillListView({ variant }: { variant: BillListVariant }) {
  const [query, setQuery] = useState("");
  const source =
    variant === "outstanding" ? getOutstandingBills() : getDueOverdueBills();

  const title =
    variant === "outstanding" ? "Outstanding Payables" : "Due / Overdue Bills";
  const description =
    variant === "outstanding"
      ? "All open supplier bills with remaining balances."
      : "Bills that are due soon or already past due.";

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list: SupplierBill[] = source;
    if (variant === "due-overdue") {
      list = [...source].sort(
        (a, b) => daysPastDue(b.dueDate) - daysPastDue(a.dueDate)
      );
    }
    if (!q) return list;
    return list.filter(
      (bill) =>
        bill.billNo.toLowerCase().includes(q) ||
        bill.supplier.toLowerCase().includes(q)
    );
  }, [query, source, variant]);

  const totalBalance = rows.reduce((sum, row) => sum + row.balance, 0);
  const overdueCount = rows.filter((row) => row.status === "overdue").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Bills</p>
            <p className="mt-1 text-xl font-semibold">{rows.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Open payable
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
              <CardDescription>{rows.length} bill(s)</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bill or supplier…"
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
                <TableHead>Supplier</TableHead>
                <TableHead>Due date</TableHead>
                {variant === "due-overdue" ? (
                  <TableHead>Days past due</TableHead>
                ) : null}
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((bill) => {
                const overdueDays = daysPastDue(bill.dueDate);
                return (
                  <TableRow key={bill.id}>
                    <TableCell className="pl-4 font-medium">
                      {bill.billNo}
                    </TableCell>
                    <TableCell>{bill.supplier}</TableCell>
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
                    <TableCell className="pr-4 text-right font-semibold tabular-nums">
                      {formatCurrency(bill.balance)}
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
