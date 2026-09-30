"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { listVouchers } from "@/features/vouchers/api/vouchers";
import {
  formatCurrency,
  formatDate,
  voucherStatusLabels,
  voucherTypeLabels,
  type Voucher,
  type VoucherStatus,
} from "./data";

const statusTone: Record<VoucherStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
};

function VoucherSheet({ voucher }: { voucher: Voucher }) {
  const totalDebit = voucher.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = voucher.lines.reduce((sum, line) => sum + line.credit, 0);

  return (
    <Card className="mx-auto hidden w-full max-w-3xl border-0 bg-white shadow-none print:block print:max-w-none">
      <CardHeader className="space-y-4 border-b pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              AssetIQ Accounts
            </p>
            <CardTitle className="mt-1 text-xl">
              {voucherTypeLabels[voucher.type]}
            </CardTitle>
            <CardDescription className="mt-1">
              Official voucher copy
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{voucher.voucherNo}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(voucher.date)}
            </p>
            <Badge variant="secondary" className="mt-2 capitalize">
              {voucher.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Reference</p>
            <p className="font-medium">{voucher.reference || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prepared by</p>
            <p className="font-medium">{voucher.preparedBy}</p>
          </div>
          {voucher.party ? (
            <div>
              <p className="text-xs text-muted-foreground">Party</p>
              <p className="font-medium">{voucher.party}</p>
            </div>
          ) : null}
          {voucher.fromAccount ? (
            <div>
              <p className="text-xs text-muted-foreground">From account</p>
              <p className="font-medium">{voucher.fromAccount}</p>
            </div>
          ) : null}
          {voucher.toAccount ? (
            <div>
              <p className="text-xs text-muted-foreground">To account</p>
              <p className="font-medium">{voucher.toAccount}</p>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Narration</p>
            <p className="font-medium">{voucher.narration || "—"}</p>
          </div>
        </div>

        <Separator />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Narration</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voucher.lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell className="font-medium">{line.account}</TableCell>
                <TableCell className="text-muted-foreground">
                  {line.narration || "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {line.debit ? formatCurrency(line.debit) : "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {line.credit ? formatCurrency(line.credit) : "—"}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/40 font-semibold">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(totalDebit)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(totalCredit)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="grid gap-8 pt-8 text-sm sm:grid-cols-3">
          <div className="border-t border-dashed pt-2 text-center text-muted-foreground">
            Prepared by
          </div>
          <div className="border-t border-dashed pt-2 text-center text-muted-foreground">
            Checked by
          </div>
          <div className="border-t border-dashed pt-2 text-center text-muted-foreground">
            Approved by
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function VoucherPrintView() {
  const searchParams = useSearchParams();
  const queryNo = searchParams.get("no") ?? "";
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [query, setQuery] = useState(queryNo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printRequest, setPrintRequest] = useState<{
    voucher: Voucher;
    token: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const rows = await listVouchers();
        if (cancelled) return;
        setVouchers(rows);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load vouchers"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!printRequest) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => window.print());
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [printRequest]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return vouchers;
    return vouchers.filter((voucher) => {
      return (
        voucher.voucherNo.toLowerCase().includes(term) ||
        voucher.narration.toLowerCase().includes(term) ||
        (voucher.party ?? "").toLowerCase().includes(term) ||
        voucher.reference.toLowerCase().includes(term) ||
        voucher.type.toLowerCase().includes(term)
      );
    });
  }, [query, vouchers]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Voucher Print
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose a voucher from the list and print its official copy.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive print:hidden">
          {error}
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60 print:hidden">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Vouchers</CardTitle>
              <CardDescription>
                {loading ? "Loading…" : `${rows.length} record(s) shown`}
              </CardDescription>
            </div>
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search voucher…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Voucher No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Party</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-4 text-right">Print</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading vouchers…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No vouchers found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="pl-4 font-medium">
                      {voucher.voucherNo}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {formatDate(voucher.date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {voucherTypeLabels[voucher.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {voucher.party || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 capitalize",
                          statusTone[voucher.status]
                        )}
                      >
                        {voucherStatusLabels[voucher.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(voucher.amount)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          setPrintRequest({ voucher, token: Date.now() })
                        }
                      >
                        <Printer className="size-3.5" />
                        Print
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {printRequest ? <VoucherSheet voucher={printRequest.voucher} /> : null}
    </div>
  );
}
