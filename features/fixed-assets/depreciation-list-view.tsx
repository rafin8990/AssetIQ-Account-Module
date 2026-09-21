"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  accumulatedDepreciation,
  depreciationSchedule,
  formatCurrency,
} from "./data";

type ListKind = "depreciation" | "accumulated";

export function DepreciationListView({ kind }: { kind: ListKind }) {
  const [query, setQuery] = useState("");

  const title =
    kind === "depreciation" ? "Depreciation" : "Accumulated Depreciation";
  const description =
    kind === "depreciation"
      ? "Period depreciation schedule by asset."
      : "Accumulated depreciation and remaining book value by asset.";

  const depRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return depreciationSchedule;
    return depreciationSchedule.filter(
      (row) =>
        row.assetCode.toLowerCase().includes(q) ||
        row.assetName.toLowerCase().includes(q) ||
        row.period.toLowerCase().includes(q)
    );
  }, [query]);

  const accRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accumulatedDepreciation;
    return accumulatedDepreciation.filter(
      (row) =>
        row.assetCode.toLowerCase().includes(q) ||
        row.assetName.toLowerCase().includes(q)
    );
  }, [query]);

  const total =
    kind === "depreciation"
      ? depRows.reduce((sum, row) => sum + row.amount, 0)
      : accRows.reduce((sum, row) => sum + row.accumulated, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Records</p>
            <p className="mt-1 text-xl font-semibold">
              {kind === "depreciation" ? depRows.length : accRows.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              {kind === "depreciation" ? "Period total" : "Accumulated total"}
            </p>
            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">
              {formatCurrency(total)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>Dummy fixed-asset figures</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          {kind === "depreciation" ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Asset</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="pr-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{row.assetName}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.assetCode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{row.period}</TableCell>
                    <TableCell>{row.method}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(row.amount)}
                    </TableCell>
                    <TableCell className="pr-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0",
                          row.status === "Posted"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Asset</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Accumulated</TableHead>
                  <TableHead className="text-right">Book Value</TableHead>
                  <TableHead className="pr-4">Remaining Life</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{row.assetName}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.assetCode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(row.cost)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">
                      {formatCurrency(row.accumulated)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(row.bookValue)}
                    </TableCell>
                    <TableCell className="pr-4">{row.remainingLife}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
