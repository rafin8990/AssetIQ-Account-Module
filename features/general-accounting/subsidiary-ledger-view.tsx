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
  formatCurrency,
  formatDate,
  subsidiaryLedger,
} from "./data";

export function SubsidiaryLedgerView() {
  const [ledgerType, setLedgerType] = useState<"Customer" | "Vendor">(
    "Customer"
  );
  const parties = useMemo(() => {
    return Array.from(
      new Set(
        subsidiaryLedger
          .filter((line) => line.ledger === ledgerType)
          .map((line) => line.party)
      )
    );
  }, [ledgerType]);

  const [party, setParty] = useState(parties[0] ?? "");

  const rows = useMemo(
    () =>
      subsidiaryLedger.filter(
        (line) => line.ledger === ledgerType && line.party === party
      ),
    [ledgerType, party]
  );

  const closing = rows.at(-1)?.balance ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Subsidiary Ledger
          </h2>
          <p className="text-sm text-muted-foreground">
            Party-level detail for customers (AR) and vendors (AP).
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select
            value={ledgerType}
            onValueChange={(value) => {
              const next = value as "Customer" | "Vendor";
              setLedgerType(next);
              const nextParties = Array.from(
                new Set(
                  subsidiaryLedger
                    .filter((line) => line.ledger === next)
                    .map((line) => line.party)
                )
              );
              setParty(nextParties[0] ?? "");
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={party} onValueChange={setParty}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Select party" />
            </SelectTrigger>
            <SelectContent>
              {parties.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{party || "No party selected"}</CardTitle>
              <CardDescription>
                {ledgerType} subsidiary · closing {formatCurrency(closing)}
              </CardDescription>
            </div>
            <Badge variant="secondary">{ledgerType}</Badge>
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
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No subsidiary entries found.
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
                    <TableCell className="text-right tabular-nums">
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
