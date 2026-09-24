"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  listTransactionHistory,
  type TransactionHistoryItem,
  type TransactionHistoryTotals,
} from "@/features/transactions/api/transaction-history";
import {
  formatCurrency,
  formatDate,
  transactionKindLabels,
  type TransactionKind,
} from "./data";

const kindTone: Record<TransactionKind, string> = {
  income: "bg-emerald-50 text-emerald-700",
  expense: "bg-rose-50 text-rose-700",
  cash: "bg-amber-50 text-amber-700",
  bank: "bg-sky-50 text-sky-700",
  transfer: "bg-teal-50 text-teal-700",
};

const emptyTotals: TransactionHistoryTotals = {
  inflow: 0,
  outflow: 0,
  other: 0,
};

export function TransactionHistoryView() {
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<TransactionKind | "all">("all");
  const [rows, setRows] = useState<TransactionHistoryItem[]>([]);
  const [totals, setTotals] = useState<TransactionHistoryTotals>(emptyTotals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listTransactionHistory({
        kind: kindFilter,
        searchTerm: query.trim() || undefined,
      });
      setRows(result.items);
      setTotals(result.totals);
    } catch (err) {
      setRows([]);
      setTotals(emptyTotals);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load transaction history"
      );
    } finally {
      setLoading(false);
    }
  }, [kindFilter, query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHistory();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [loadHistory]);

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

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

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
              <CardDescription>
                {loading
                  ? "Loading…"
                  : `${rows.length} transaction(s)`}
              </CardDescription>
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
              <Select
                value={kindFilter}
                onValueChange={(value) =>
                  setKindFilter(value as TransactionKind | "all")
                }
              >
                <SelectTrigger className="h-8 w-full sm:w-44">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {(
                    Object.keys(transactionKindLabels) as TransactionKind[]
                  ).map((kind) => (
                    <SelectItem key={kind} value={kind}>
                      {transactionKindLabels[kind]}
                    </SelectItem>
                  ))}
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
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
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
                      <div>{txn.txnNo}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {txn.status}
                        {txn.sourceOrderCode
                          ? ` · ${txn.sourceOrderCode}`
                          : txn.reference && txn.kind === "income"
                            ? ` · ${txn.reference}`
                            : ""}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatDate(txn.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 capitalize",
                          kindTone[txn.kind]
                        )}
                      >
                        {txn.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span>{txn.account ?? "—"}</span>
                        {txn.contraAccount ? (
                          <span className="text-xs text-muted-foreground">
                            → {txn.contraAccount}
                          </span>
                        ) : txn.category ? (
                          <span className="text-xs text-muted-foreground">
                            {txn.category}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {txn.party ?? "—"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold tabular-nums",
                        txn.kind === "income" && "text-emerald-700",
                        txn.kind === "expense" && "text-rose-600",
                        txn.direction === "in" &&
                          txn.kind !== "income" &&
                          "text-emerald-700",
                        txn.direction === "out" &&
                          txn.kind !== "expense" &&
                          "text-rose-600"
                      )}
                    >
                      {txn.kind === "income" || txn.direction === "in"
                        ? "+"
                        : txn.kind === "expense" || txn.direction === "out"
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
