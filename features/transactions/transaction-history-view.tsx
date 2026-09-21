"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Paperclip, Search } from "lucide-react";

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
  formatCurrency,
  formatDate,
  transactionKindLabels,
  transactions,
  type TransactionKind,
} from "./data";

const kindTone: Record<TransactionKind, string> = {
  income: "bg-emerald-50 text-emerald-700",
  expense: "bg-rose-50 text-rose-700",
  cash: "bg-amber-50 text-amber-700",
  bank: "bg-sky-50 text-sky-700",
  transfer: "bg-teal-50 text-teal-700",
};

export function TransactionHistoryView() {
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("all");

  const rows = useMemo(() => {
    return transactions.filter((txn) => {
      if (kindFilter !== "all" && txn.kind !== kindFilter) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        txn.txnNo.toLowerCase().includes(q) ||
        txn.account.toLowerCase().includes(q) ||
        txn.category.toLowerCase().includes(q) ||
        (txn.party ?? "").toLowerCase().includes(q) ||
        txn.reference.toLowerCase().includes(q) ||
        txn.narration.toLowerCase().includes(q)
      );
    });
  }, [kindFilter, query]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, txn) => {
        if (txn.kind === "income") acc.inflow += txn.amount;
        else if (txn.kind === "expense") acc.outflow += txn.amount;
        else acc.other += txn.amount;
        return acc;
      },
      { inflow: 0, outflow: 0, other: 0 }
    );
  }, [rows]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Transaction History
        </h2>
        <p className="text-sm text-muted-foreground">
          Review all income, expense, cash, bank, and transfer movements.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Inflow</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700 tabular-nums">
              {formatCurrency(totals.inflow)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Outflow</p>
            <p className="mt-1 text-xl font-semibold text-rose-600 tabular-nums">
              {formatCurrency(totals.outflow)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Cash / Bank / Transfer
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(totals.other)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">History</CardTitle>
              <CardDescription>{rows.length} transaction(s)</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-56">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search transactions…"
                  className="h-8 pl-8"
                />
              </div>
              <Select value={kindFilter} onValueChange={setKindFilter}>
                <SelectTrigger className="h-8 w-full sm:w-44">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {(Object.keys(transactionKindLabels) as TransactionKind[]).map(
                    (kind) => (
                      <SelectItem key={kind} value={kind}>
                        {transactionKindLabels[kind]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Txn No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Account</TableHead>
                <TableHead className="hidden lg:table-cell">Party</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-4 text-right">Docs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="pl-4 font-medium">
                      {txn.txnNo}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatDate(txn.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("border-0 capitalize", kindTone[txn.kind])}
                      >
                        {txn.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span>{txn.account}</span>
                        {txn.contraAccount ? (
                          <span className="text-xs text-muted-foreground">
                            → {txn.contraAccount}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {txn.category}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {txn.party ?? "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        txn.kind === "income" && "text-emerald-700",
                        txn.kind === "expense" && "text-rose-600"
                      )}
                    >
                      {txn.kind === "income"
                        ? "+"
                        : txn.kind === "expense"
                          ? "−"
                          : ""}
                      {formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      {txn.hasAttachment ? (
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link
                            href="/transactions/attachments"
                            aria-label="View attachments"
                          >
                            <Paperclip className="size-4 text-primary" />
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
