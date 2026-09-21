"use client";

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
  formatCurrency,
  type ReportColumn,
  type ReportRow,
} from "./data";
import { ReportShell } from "./report-shell";

type TableReportProps = {
  title: string;
  description: string;
  columns: ReportColumn[];
  rows: ReportRow[];
  currencyKeys?: string[];
};

export function TableReport({
  title,
  description,
  columns,
  rows,
  currencyKeys = [],
}: TableReportProps) {
  return (
    <ReportShell title={title} description={description}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  column.align === "right" && "text-right",
                  column.key === columns[0]?.key && "pl-0"
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(row.emphasize && "bg-muted/40 font-semibold")}
            >
              {columns.map((column) => {
                const value = row[column.key];
                const isCurrency = currencyKeys.includes(column.key);
                const display =
                  isCurrency && typeof value === "number"
                    ? formatCurrency(value)
                    : String(value ?? "—");

                return (
                  <TableCell
                    key={column.key}
                    className={cn(
                      column.align === "right" && "text-right tabular-nums",
                      column.key === columns[0]?.key && "pl-0",
                      typeof value === "number" &&
                        currencyKeys.includes(column.key) &&
                        value > 0 &&
                        column.key === "variance" &&
                        "text-rose-600",
                      typeof value === "number" &&
                        currencyKeys.includes(column.key) &&
                        value < 0 &&
                        column.key === "variance" &&
                        "text-emerald-700"
                    )}
                  >
                    {column.key === "variance" &&
                    typeof value === "number" &&
                    value > 0
                      ? `+${display}`
                      : display}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ReportShell>
  );
}
