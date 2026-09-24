"use client";

import Link from "next/link";
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
  listCustomerInvoices,
  type CustomerInvoice,
} from "@/features/accounts-receivable/api/customer-invoices";
import { listCustomers } from "@/features/accounts-receivable/api/customers";
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

function buildLedger(invoices: CustomerInvoice[]): LedgerRow[] {
  const orderInvoices = invoices.filter(
    (invoice) => invoice.invoiceKind !== "payment"
  );
  const paymentInvoices = invoices.filter(
    (invoice) => invoice.invoiceKind === "payment"
  );

  const events: Omit<LedgerRow, "balance">[] = [];

  for (const invoice of orderInvoices) {
    events.push({
      id: `${invoice.id}-order`,
      date: invoice.issueDate,
      reference: invoice.invoiceNo,
      description: invoice.sourceOrderCode
        ? `Sales invoice · ${invoice.sourceOrderCode}`
        : "Sales invoice",
      debit: invoice.amount,
      credit: 0,
    });
  }

  for (const invoice of paymentInvoices) {
    events.push({
      id: `${invoice.id}-payment`,
      date: invoice.issueDate,
      reference: invoice.invoiceNo,
      description: invoice.sourceOrderCode
        ? `Payment received · ${invoice.sourceOrderCode}`
        : "Payment received",
      debit: 0,
      credit: invoice.amount,
    });
  }

  // Legacy fallback: order paid with no payment invoices
  for (const invoice of orderInvoices) {
    if (!(invoice.paid > 0)) continue;
    const linkedPayments = paymentInvoices.filter(
      (payment) =>
        payment.sourceOrderId &&
        invoice.sourceOrderId &&
        payment.sourceOrderId === invoice.sourceOrderId
    );
    const linkedPaid = linkedPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const remainder = Math.max(invoice.paid - linkedPaid, 0);
    if (remainder > 0.0001) {
      events.push({
        id: `${invoice.id}-legacy-pay`,
        date: invoice.dueDate || invoice.issueDate,
        reference: `RCPT-${invoice.invoiceNo}`,
        description: "Payment received",
        debit: 0,
        credit: remainder,
      });
    }
  }

  events.sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return a.reference.localeCompare(b.reference);
  });

  let running = 0;
  return events.map((event) => {
    running += event.debit - event.credit;
    return { ...event, balance: running };
  });
}

export function CustomerLedgerView() {
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [customerNames, setCustomerNames] = useState<string[]>([]);
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoiceRows, customerRows] = await Promise.all([
        listCustomerInvoices(),
        listCustomers().catch(() => [] as Awaited<ReturnType<typeof listCustomers>>),
      ]);

      setInvoices(invoiceRows);

      const fromMaster = customerRows
        .filter((row) => String(row.status ?? "active") !== "inactive")
        .map((row) => String(row.customer_name ?? "").trim())
        .filter(Boolean);
      const fromInvoices = invoiceRows
        .map((row) => row.customer.trim())
        .filter(Boolean);
      const names = Array.from(
        new Set([...fromMaster, ...fromInvoices])
      ).sort((a, b) => a.localeCompare(b));

      setCustomerNames(names);
      setCustomer((current) => {
        if (current && names.includes(current)) return current;
        const withActivity = names.find((name) =>
          invoiceRows.some((invoice) => invoice.customer === name)
        );
        return withActivity ?? names[0] ?? "";
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load customer ledger"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const customerInvoices = useMemo(
    () => invoices.filter((row) => row.customer === customer),
    [customer, invoices]
  );

  const rows = useMemo(
    () => buildLedger(customerInvoices),
    [customerInvoices]
  );

  const closing = rows.at(-1)?.balance ?? 0;
  const totalDebit = rows.reduce((sum, row) => sum + row.debit, 0);
  const totalCredit = rows.reduce((sum, row) => sum + row.credit, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Customer Ledger
          </h2>
          <p className="text-sm text-muted-foreground">
            Live AR statement from order invoices and payment invoices.
          </p>
        </div>
        <Select
          value={customer || undefined}
          onValueChange={setCustomer}
          disabled={loading || !customerNames.length}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customerNames.map((name) => (
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
            <p className="text-xs text-muted-foreground uppercase">Debits</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(totalDebit)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Credits</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700 tabular-nums">
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
              <CardTitle className="text-base">
                {customer || "Select a customer"}
              </CardTitle>
              <CardDescription>
                {loading ? "Loading…" : `${rows.length} ledger entr(y/ies)`}
              </CardDescription>
            </div>
            <Badge variant="secondary">AR Ledger</Badge>
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
                    No ledger entries for this customer.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4 text-muted-foreground tabular-nums">
                      {formatDate(row.date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.reference.startsWith("INV-") ? (
                        <Link
                          href={`/accounts-receivable/customer-invoices/print?no=${encodeURIComponent(row.reference)}`}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {row.reference}
                        </Link>
                      ) : (
                        row.reference
                      )}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.debit ? formatCurrency(row.debit) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-emerald-700 tabular-nums">
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
