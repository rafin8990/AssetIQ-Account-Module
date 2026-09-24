"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  listSupplierBills,
  type SupplierBill,
} from "@/features/accounts-payable/api/supplier-bills";
import { listVendors } from "@/features/accounts-payable/api/vendors";
import { formatCurrency, formatDate } from "./data";

type LedgerRow = {
  id: string;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

function buildLedger(bills: SupplierBill[]): LedgerRow[] {
  const events: Omit<LedgerRow, "balance">[] = [];

  for (const bill of bills) {
    events.push({
      id: `${bill.id}-bill`,
      date: bill.issueDate,
      reference: bill.billNo,
      description: bill.sourcePoCode
        ? `Purchase bill · ${bill.sourcePoCode}`
        : "Purchase bill",
      debit: 0,
      credit: bill.amount,
    });

    if (bill.paid > 0) {
      events.push({
        id: `${bill.id}-pay`,
        date: bill.dueDate || bill.issueDate,
        reference: `PAY-${bill.billNo}`,
        description: bill.sourcePoCode
          ? `Payment · ${bill.sourcePoCode}`
          : "Payment",
        debit: bill.paid,
        credit: 0,
      });
    }
  }

  events.sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return a.reference.localeCompare(b.reference);
  });

  // AP party ledger: bills credit liability, payments debit it down
  let running = 0;
  return events.map((event) => {
    running += event.credit - event.debit;
    return { ...event, balance: running };
  });
}

export function VendorLedgerView() {
  const [bills, setBills] = useState<SupplierBill[]>([]);
  const [vendorNames, setVendorNames] = useState<string[]>([]);
  const [vendor, setVendor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [billRows, vendorRows] = await Promise.all([
        listSupplierBills(),
        listVendors().catch(() => [] as Awaited<ReturnType<typeof listVendors>>),
      ]);

      setBills(billRows);

      const fromMaster = vendorRows
        .map((row) => String(row.vendor_name ?? "").trim())
        .filter(Boolean);
      const fromBills = billRows
        .map((row) => row.vendor.trim())
        .filter(Boolean);
      const names = Array.from(new Set([...fromMaster, ...fromBills])).sort(
        (a, b) => a.localeCompare(b)
      );

      setVendorNames(names);
      setVendor((current) => {
        if (current && names.includes(current)) return current;
        const withActivity = names.find((name) =>
          billRows.some((bill) => bill.vendor === name)
        );
        return withActivity ?? names[0] ?? "";
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load vendor ledger"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const vendorBills = useMemo(
    () => bills.filter((row) => row.vendor === vendor),
    [bills, vendor]
  );

  const rows = useMemo(() => buildLedger(vendorBills), [vendorBills]);

  const closing = rows.at(-1)?.balance ?? 0;
  const totalDebit = rows.reduce((sum, row) => sum + row.debit, 0);
  const totalCredit = rows.reduce((sum, row) => sum + row.credit, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Vendor Ledger
          </h2>
          <p className="text-sm text-muted-foreground">
            Live AP statement from supplier bills and payments (Accounts API).
          </p>
        </div>
        <Select
          value={vendor || undefined}
          onValueChange={setVendor}
          disabled={loading || !vendorNames.length}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendorNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Payments (Debit)
            </p>
            <p className="mt-1 text-xl font-semibold text-emerald-700 tabular-nums">
              {loading ? "…" : formatCurrency(totalDebit)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Bills (Credit)
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {loading ? "…" : formatCurrency(totalCredit)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Closing payable
            </p>
            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">
              {loading ? "…" : formatCurrency(closing)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                {vendor || "Select a vendor"}
              </CardTitle>
              <CardDescription>
                {loading ? "Loading…" : `${rows.length} ledger entr(y/ies)`}
              </CardDescription>
            </div>
            <Badge variant="secondary">AP Ledger</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="pr-4 text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No ledger entries for this vendor.
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
                    <TableCell className="text-right tabular-nums">
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
