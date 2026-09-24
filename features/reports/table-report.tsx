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
  badge?: string;
  dataBadge?: string;
  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (value: string) => void;
  onToDateChange?: (value: string) => void;
  showDates?: boolean;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
};

export function TableReport({
  title,
  description,
  columns,
  rows,
  currencyKeys = [],
  badge,
  dataBadge,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  showDates,
  loading,
  error,
  emptyMessage,
}: TableReportProps) {
  return (
    <ReportShell
      title={title}
      description={description}
      badge={badge}
      dataBadge={dataBadge}
      fromDate={fromDate}
      toDate={toDate}
      onFromDateChange={onFromDateChange}
      onToDateChange={onToDateChange}
      showDates={showDates}
      loading={loading}
      error={error}
      emptyMessage={emptyMessage}
      isEmpty={!loading && !error && rows.length === 0}
    >
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
