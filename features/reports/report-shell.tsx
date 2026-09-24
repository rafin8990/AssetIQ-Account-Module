"use client";

import { Download, Printer } from "lucide-react";

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
import { Label } from "@/components/ui/label";

type ReportShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
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
  isEmpty?: boolean;
};

export function ReportShell({
  title,
  description,
  children,
  badge = "Management Report",
  dataBadge = "Live data",
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  showDates = true,
  loading = false,
  error = null,
  emptyMessage = "No data for the selected period.",
  isEmpty = false,
}: ReportShellProps) {
  const periodLabel =
    fromDate && toDate ? `Period ${fromDate} to ${toDate}` : "Selected period";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between print:hidden">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <Badge variant="secondary">{badge}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          {showDates && fromDate != null && toDate != null ? (
            <>
              <div className="grid gap-1">
                <Label htmlFor="from" className="text-xs">
                  From
                </Label>
                <Input
                  id="from"
                  type="date"
                  className="h-8 w-36"
                  value={fromDate}
                  onChange={(e) => onFromDateChange?.(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="to" className="text-xs">
                  To
                </Label>
                <Input
                  id="to"
                  type="date"
                  className="h-8 w-36"
                  value={toDate}
                  onChange={(e) => onToDateChange?.(e.target.value)}
                />
              </div>
            </>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => window.print()}
          >
            <Printer className="size-3.5" />
            Print
          </Button>
          <Button
            size="sm"
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled
            title="Export coming soon"
          >
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>
                {periodLabel} · AssetIQ Accounts
              </CardDescription>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {dataBadge}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : loading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading report…
            </p>
          ) : isEmpty ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </div>
  );
}
