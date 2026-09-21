"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  bankAccounts,
  bankBookEntries,
  cashAccounts,
  cashBookEntries,
  formatCurrency,
  formatDate,
  type BookEntry,
  type MoneyAccount,
} from "./data";

type BookKind = "cash" | "bank";

export function CashBankBookView({ kind }: { kind: BookKind }) {
  const accounts: MoneyAccount[] = kind === "cash" ? cashAccounts : bankAccounts;
  const entries: BookEntry[] =
    kind === "cash" ? cashBookEntries : bankBookEntries;

  const [account, setAccount] = useState(accounts[0]?.name ?? "");

  const rows = useMemo(
    () => entries.filter((entry) => entry.account === account),
    [account, entries]
  );

  const totalDebit = rows.reduce((sum, row) => sum + row.debit, 0);
  const totalCredit = rows.reduce((sum, row) => sum + row.credit, 0);
  const closing = rows.at(-1)?.balance ?? 0;

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
        <Select value={account} onValueChange={setAccount}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
              <CardTitle className="text-base">{account}</CardTitle>
              <CardDescription>{rows.length} entr(y/ies)</CardDescription>
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
              {rows.length === 0 ? (
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
                    <TableCell className="font-medium">{row.reference}</TableCell>
                    <TableCell>{row.description}</TableCell>
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
