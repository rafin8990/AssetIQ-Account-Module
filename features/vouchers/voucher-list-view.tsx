"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Printer, Search } from "lucide-react";

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
import { cn } from "@/lib/utils";

import {
  formatCurrency,
  formatDate,
  vouchers,
  voucherStatusLabels,
  voucherTypeLabels,
  type VoucherStatus,
  type VoucherType,
} from "./data";

const statusTone: Record<VoucherStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
};

type VoucherListViewProps = {
  title?: string;
  description?: string;
  fixedStatus?: VoucherStatus;
  showStatusFilter?: boolean;
};

export function VoucherListView({
  title = "Voucher List",
  description = "Browse and filter all accounting vouchers.",
  fixedStatus,
  showStatusFilter = true,
}: VoucherListViewProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>(fixedStatus ?? "all");

  const rows = useMemo(() => {
    return vouchers.filter((voucher) => {
      if (fixedStatus && voucher.status !== fixedStatus) return false;
      if (!fixedStatus && statusFilter !== "all" && voucher.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "all" && voucher.type !== typeFilter) return false;

      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        voucher.voucherNo.toLowerCase().includes(q) ||
        voucher.narration.toLowerCase().includes(q) ||
        (voucher.party ?? "").toLowerCase().includes(q) ||
        voucher.reference.toLowerCase().includes(q)
      );
    });
  }, [fixedStatus, query, statusFilter, typeFilter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">Vouchers</CardTitle>
              <CardDescription>{rows.length} record(s) shown</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-56">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search voucher…"
                  className="h-8 pl-8"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {(Object.keys(voucherTypeLabels) as VoucherType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {voucherTypeLabels[type]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {showStatusFilter && !fixedStatus ? (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    {(Object.keys(voucherStatusLabels) as VoucherStatus[]).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {voucherStatusLabels[status]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              ) : null}
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
                <TableHead className="hidden md:table-cell">Party / Ref</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
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
                        {voucher.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span>{voucher.party ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">
                          {voucher.reference}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 capitalize",
                          statusTone[voucher.status]
                        )}
                      >
                        {voucher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(voucher.amount)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link
                            href={`/vouchers/print?no=${encodeURIComponent(voucher.voucherNo)}`}
                            aria-label="Print voucher"
                          >
                            <Printer className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link
                            href={`/vouchers/${voucher.type}`}
                            aria-label="Open voucher type"
                          >
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </div>
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
