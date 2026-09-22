"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import {
  formatIncomeCurrency,
  listIncomeEntries,
  type IncomeEntry,
} from "@/features/transactions/api/income-entries";

function IncomePrintInner() {
  const searchParams = useSearchParams();
  const queryNo = searchParams.get("no") ?? "";
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [selectedNo, setSelectedNo] = useState(queryNo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const rows = await listIncomeEntries();
        if (cancelled) return;
        setEntries(rows);
        setSelectedNo((current) => {
          if (current && rows.some((item) => item.entryNo === current)) {
            return current;
          }
          if (queryNo && rows.some((item) => item.entryNo === queryNo)) {
            return queryNo;
          }
          return rows[0]?.entryNo ?? "";
        });
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load income entries"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryNo]);

  const entry = useMemo(
    () => entries.find((item) => item.entryNo === selectedNo) ?? entries[0],
    [selectedNo, entries]
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Loading income entries…
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

  if (!entry) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No income entries to print.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Print Income Entry
          </h2>
          <p className="text-sm text-muted-foreground">
            Print voucher-style income receipt for manual or order income.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedNo} onValueChange={setSelectedNo}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select entry" />
            </SelectTrigger>
            <SelectContent>
              {entries.map((item) => (
                <SelectItem key={item.id} value={item.entryNo}>
                  {item.entryNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {entry.voucherNo ? (
            <Button variant="outline" asChild>
              <Link
                href={`/vouchers/print?no=${encodeURIComponent(entry.voucherNo)}`}
              >
                Open voucher
              </Link>
            </Button>
          ) : null}
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
              <CardTitle className="text-xl">Income Voucher</CardTitle>
              <CardDescription>{entry.entryNo}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className="capitalize">{entry.status}</Badge>
              <Badge variant="outline" className="capitalize">
                {entry.paymentStatus}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Date: </span>
              {entry.date}
            </div>
            <div>
              <span className="text-muted-foreground">Party: </span>
              {entry.party || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Source: </span>
              {entry.source}
              {entry.sourceOrderCode ? ` (${entry.sourceOrderCode})` : ""}
            </div>
            <div>
              <span className="text-muted-foreground">Reference: </span>
              {entry.reference || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Cash account: </span>
              {entry.cashAccount || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Income account: </span>
              {entry.incomeAccount || "—"}
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
                <TableCell>Invoice / order amount</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatIncomeCurrency(entry.amount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Received</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatIncomeCurrency(entry.receivedAmount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pending</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatIncomeCurrency(entry.pendingAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {entry.payments && entry.payments.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Payment history</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entry.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {String(payment.paidAt).slice(0, 10)}
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell className="capitalize">
                        {payment.origin}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatIncomeCurrency(payment.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          {entry.narration ? (
            <p className="text-sm text-muted-foreground">{entry.narration}</p>
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

export function IncomePrintView() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <IncomePrintInner />
    </Suspense>
  );
}
