"use client";

import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
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
  formatCurrency,
  formatDate,
  vouchers,
  voucherTypeLabels,
} from "./data";

export function VoucherPrintView() {
  const searchParams = useSearchParams();
  const initialNo = searchParams.get("no") ?? vouchers[0]?.voucherNo ?? "";
  const [selectedNo, setSelectedNo] = useState(initialNo);

  const voucher = useMemo(
    () => vouchers.find((item) => item.voucherNo === selectedNo) ?? vouchers[0],
    [selectedNo]
  );

  if (!voucher) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No voucher available to print.
      </div>
    );
  }

  const totalDebit = voucher.lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = voucher.lines.reduce((sum, line) => sum + line.credit, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:hidden">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Voucher Print
          </h2>
          <p className="text-sm text-muted-foreground">
            Preview and print an accounting voucher for records or audit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedNo} onValueChange={setSelectedNo}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select voucher" />
            </SelectTrigger>
            <SelectContent>
              {vouchers.map((item) => (
                <SelectItem key={item.id} value={item.voucherNo}>
                  {item.voucherNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            onClick={() => window.print()}
          >
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-3xl border-0 bg-white shadow-sm ring-border/60 print:max-w-none print:shadow-none print:ring-0">
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
              <p className="font-medium">{voucher.narration}</p>
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
    </div>
  );
}
