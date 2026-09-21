"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";

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
  getApprovalsByStatus,
  type ApprovalItem,
  type ApprovalStatus,
} from "./data";

const statusTone: Record<ApprovalStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700",
};

export function ApprovalListView({ status }: { status: ApprovalStatus }) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<ApprovalItem[]>(
    getApprovalsByStatus(status)
  );
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.docNo.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q) ||
        row.maker.toLowerCase().includes(q)
    );
  }, [query, rows]);

  const total = filtered.reduce((sum, row) => sum + row.amount, 0);

  function decide(id: string, next: "Approved" | "Rejected") {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setMessage(`Document marked as ${next} (dummy local update).`);
  }

  const title =
    status === "Pending"
      ? "Pending Approvals"
      : status === "Approved"
        ? "Approved Transactions"
        : "Rejected Transactions";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Review documents in {status.toLowerCase()} status across vouchers and
          invoices.
        </p>
      </div>

      {message ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Items</p>
            <p className="mt-1 text-xl font-semibold">{filtered.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Amount</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
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
              <CardDescription>{filtered.length} record(s)</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Document</TableHead>
                <TableHead>Maker</TableHead>
                <TableHead className="hidden md:table-cell">Submitted</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                {status === "Pending" ? (
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                ) : (
                  <TableHead className="pr-4">Notes</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{row.docNo}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{row.maker}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDate(row.submittedOn)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(row.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("border-0", statusTone[row.status])}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    {status === "Pending" ? (
                      <TableCell className="pr-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => decide(row.id, "Rejected")}
                          >
                            <X className="size-3.5" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1"
                            onClick={() => decide(row.id, "Approved")}
                          >
                            <Check className="size-3.5" />
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell className="pr-4 text-muted-foreground">
                        {row.remarks ??
                          (row.approver
                            ? `By ${row.approver}`
                            : row.checker
                              ? `Checked by ${row.checker}`
                              : "—")}
                      </TableCell>
                    )}
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
