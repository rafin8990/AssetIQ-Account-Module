"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { formatCurrency, type StatementSection } from "./data";
import { ReportShell } from "./report-shell";

type StatementReportProps = {
  title: string;
  description: string;
  sections: StatementSection[];
  footerNote?: string;
  netLabel?: string;
  netAmount?: number;
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

export function StatementReport({
  title,
  description,
  sections,
  footerNote,
  netLabel,
  netAmount,
  badge = "Financial Statement",
  dataBadge,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  showDates,
  loading,
  error,
  emptyMessage,
}: StatementReportProps) {
  const isEmpty =
    !loading &&
    !error &&
    sections.every((section) => section.rows.length === 0);

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
      isEmpty={isEmpty}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="text-sm font-semibold tracking-wide text-primary uppercase">
              {section.title}
            </h3>
            <div className="space-y-1.5">
              {section.rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No lines</p>
              ) : (
                section.rows.map((row) => (
                  <div
                    key={`${section.title}-${row.label}`}
                    className={cn(
                      "flex items-center justify-between text-sm",
                      row.indent && "pl-4 text-muted-foreground"
                    )}
                  >
                    <span>{row.label}</span>
                    <span className="tabular-nums">
                      {formatCurrency(row.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{section.totalLabel}</span>
              <span className="tabular-nums">
                {formatCurrency(section.total)}
              </span>
            </div>
          </div>
        ))}

        {netLabel != null && netAmount != null ? (
          <div className="rounded-xl bg-primary/5 px-4 py-3">
            <div className="flex items-center justify-between text-sm font-semibold text-primary">
              <span>{netLabel}</span>
              <span className="tabular-nums">{formatCurrency(netAmount)}</span>
            </div>
          </div>
        ) : null}

        {footerNote ? (
          <p className="text-xs text-muted-foreground">{footerNote}</p>
        ) : null}
      </div>
    </ReportShell>
  );
}
