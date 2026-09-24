"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import {
  getCashBankBook,
  type CashBankBook,
} from "@/features/cash-bank/api/cash-bank-books";
import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/features/cash-bank/data";

type BookKind = "cash" | "bank";

type AccountOption = {
  id: string;
  name: string;
  code: string;
};

export function CashBankBookView({ kind }: { kind: BookKind }) {
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [accountId, setAccountId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [book, setBook] = useState<CashBankBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const rows = await listAccounts({ type: kind, status: "active" });
        if (cancelled) return;
        const options = rows.map((row) => ({
          id: String(row.id),
          name: String(row.name),
          code: String(row.code ?? ""),
        }));
        setAccounts(options);
        setAccountId((prev) => prev || options[0]?.id || "");
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load accounts"
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [kind]);

  useEffect(() => {
    if (!accountId) {
      setBook(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const result = await getCashBankBook({
          accountId,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        });
        if (cancelled) return;
        setBook(result);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setBook(null);
        setError(
          err instanceof Error ? err.message : "Failed to load book"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accountId, dateFrom, dateTo]);

  const selectedName =
    accounts.find((item) => item.id === accountId)?.name ?? "Account";
  const rows = book?.entries ?? [];
  const totalDebit = book?.totals.debit ?? 0;
  const totalCredit = book?.totals.credit ?? 0;
  const closing = book?.closingBalance ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {kind === "cash" ? "Cash Book" : "Bank Book"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {kind === "cash"
              ? "Day book of cash receipts and payments."
              : "Day book of bank deposits and withdrawals."}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="grid gap-1">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full sm:w-40"
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full sm:w-40"
            />
          </div>
          <Select
            value={accountId || undefined}
            onValueChange={setAccountId}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.code ? `${item.name} (${item.code})` : item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Receipts</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700 tabular-nums">
              {formatCurrency(totalDebit)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Payments</p>
            <p className="mt-1 text-xl font-semibold text-rose-600 tabular-nums">
              {formatCurrency(totalCredit)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Closing balance
            </p>
            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">
              {formatCurrency(closing)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{selectedName}</CardTitle>
              <CardDescription>
                {loading
                  ? "Loading…"
                  : `${rows.length} entr${rows.length === 1 ? "y" : "ies"} · Opening ${formatCurrency(book?.openingBalance ?? 0)}`}
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {kind === "cash" ? "Cash Book" : "Bank Book"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
                <TableHead className="text-right">Payment</TableHead>
                <TableHead className="pr-4 text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No entries for this account.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4 text-muted-foreground tabular-nums">
                      {formatDate(row.date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.reference || row.voucherNo || "—"}
                    </TableCell>
                    <TableCell>{row.description || "—"}</TableCell>
                    <TableCell className="text-right text-emerald-700 tabular-nums">
                      {row.debit ? formatCurrency(row.debit) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-rose-600 tabular-nums">
                      {row.credit ? formatCurrency(row.credit) : "—"}
                    </TableCell>
                    <TableCell className="pr-4 text-right font-semibold tabular-nums">
                      {formatCurrency(row.balance)}
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
