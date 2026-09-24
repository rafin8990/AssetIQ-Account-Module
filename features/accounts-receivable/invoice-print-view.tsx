"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
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
import { formatCurrency, formatDate } from "./data";

function InvoicePrintInner() {
  const searchParams = useSearchParams();
  const queryNo = searchParams.get("no") ?? "";
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [selectedNo, setSelectedNo] = useState(queryNo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const rows = await listCustomerInvoices();
        if (cancelled) return;
        setInvoices(rows);
        setSelectedNo((current) => {
          if (current && rows.some((item) => item.invoiceNo === current)) {
            return current;
          }
          if (queryNo && rows.some((item) => item.invoiceNo === queryNo)) {
            return queryNo;
          }
          return rows[0]?.invoiceNo ?? "";
        });
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load invoices"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryNo]);

  const invoice = useMemo(
    () =>
      invoices.find((item) => item.invoiceNo === selectedNo) ?? invoices[0],
    [invoices, selectedNo]
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Loading invoices…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No customer invoices to print.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Print Customer Invoice
          </h2>
          <p className="text-sm text-muted-foreground">
            Print Accounts invoice with INV and linked OUT order codes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedNo} onValueChange={setSelectedNo}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select invoice" />
            </SelectTrigger>
            <SelectContent>
              {invoices.map((item) => (
                <SelectItem key={item.id} value={item.invoiceNo}>
                  {item.invoiceNo}
                  {item.invoiceKind === "payment" ? " · Payment" : ""}
                  {item.sourceOrderCode ? ` · ${item.sourceOrderCode}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" asChild>
            <Link href="/accounts-receivable/customer-invoices">Back</Link>
          </Button>
          <Button className="gap-1.5" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="border bg-white shadow-none print:border-0 print:shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Customer Invoice</CardTitle>
              <CardDescription>{invoice.invoiceNo}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className="capitalize">{invoice.status}</Badge>
              <Badge variant="outline" className="capitalize">
                {invoice.invoiceKind === "payment" ? "Payment" : "Order"}
              </Badge>
              {invoice.sourceOrderCode ? (
                <Badge variant="secondary">{invoice.sourceOrderCode}</Badge>
              ) : null}
            </div>
          </div>
          <Separator />
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Issue date: </span>
              {formatDate(invoice.issueDate)}
            </div>
            <div>
              <span className="text-muted-foreground">Due date: </span>
              {formatDate(invoice.dueDate)}
            </div>
            <div>
              <span className="text-muted-foreground">Customer: </span>
              {invoice.customer}
            </div>
            <div>
              <span className="text-muted-foreground">Customer code: </span>
              {invoice.customerCode || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Order No: </span>
              {invoice.sourceOrderCode || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Income entry: </span>
              {invoice.incomeEntryNo || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Reference: </span>
              {invoice.reference || "—"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {invoice.invoiceKind === "payment"
                    ? "Payment received"
                    : "Invoice amount"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(invoice.amount)}
                </TableCell>
              </TableRow>
              {invoice.invoiceKind !== "payment" ? (
                <>
                  <TableRow>
                    <TableCell>Paid</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(invoice.paid)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Balance due</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(invoice.balance)}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell className="text-right font-semibold capitalize">
                    Paid in full
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {invoice.narration ? (
            <p className="text-sm text-muted-foreground">{invoice.narration}</p>
          ) : null}

          <div className="grid gap-8 pt-10 sm:grid-cols-2">
            <div className="border-t pt-2 text-sm">Prepared by</div>
            <div className="border-t pt-2 text-sm">Authorized by</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InvoicePrintView() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <InvoicePrintInner />
    </Suspense>
  );
}
