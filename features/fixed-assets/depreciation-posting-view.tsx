"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import {
  depreciationSchedule as initialSchedule,
  formatCurrency,
  type DepreciationRow,
} from "./data";

export function DepreciationPostingView() {
  const [rows, setRows] = useState<DepreciationRow[]>(initialSchedule);
  const [message, setMessage] = useState<string | null>(null);

  const scheduled = useMemo(
    () => rows.filter((row) => row.status === "Scheduled"),
    [rows]
  );
  const total = scheduled.reduce((sum, row) => sum + row.amount, 0);

  function postAll() {
    if (scheduled.length === 0) {
      setMessage("No scheduled depreciation lines to post.");
      return;
    }
    setRows((prev) =>
      prev.map((row) =>
        row.status === "Scheduled" ? { ...row, status: "Posted" } : row
      )
    );
    setMessage(
      `Posted ${scheduled.length} depreciation journal line(s) totaling ${formatCurrency(total)}.`
    );
  }

  function postOne(id: string) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status: "Posted" } : row
      )
    );
    setMessage(`Posted depreciation journal for ${id}.`);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Depreciation Journal Posting
          </h2>
          <p className="text-sm text-muted-foreground">
            Post scheduled depreciation to the general ledger as a journal entry.
          </p>
        </div>
        <Button
          className="gap-1.5 shadow-sm shadow-primary/20"
          onClick={postAll}
          disabled={scheduled.length === 0}
        >
          <Send className="size-4" />
          Post all scheduled
        </Button>
      </div>

      {message ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Scheduled</p>
            <p className="mt-1 text-xl font-semibold text-amber-700">
              {scheduled.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Amount to post
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(total)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Journal tip</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Dr Depreciation Expense · Cr Accumulated Depreciation
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Posting queue</CardTitle>
          <CardDescription>
            Review and post period depreciation journals
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Asset</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
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
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatCurrency(row.amount)}
                  </TableCell>
                  <TableCell>
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
                  <TableCell className="pr-4 text-right">
                    {row.status === "Scheduled" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => postOne(row.id)}
                      >
                        Post
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Done</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
