"use client";

import { useState } from "react";
import { Lock, LockOpen, ShieldCheck } from "lucide-react";

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
  accountingPeriods as initialPeriods,
  formatDate,
  type AccountingPeriod,
  type PeriodStatus,
} from "./data";

const statusTone: Record<PeriodStatus, string> = {
  Open: "bg-emerald-50 text-emerald-700",
  "Soft Locked": "bg-amber-50 text-amber-700",
  Closed: "bg-rose-50 text-rose-700",
};

export function PeriodLockingView() {
  const [periods, setPeriods] = useState<AccountingPeriod[]>(initialPeriods);
  const [message, setMessage] = useState<string | null>(null);

  const openCount = periods.filter((p) => p.status === "Open").length;
  const lockedCount = periods.filter((p) => p.status !== "Open").length;

  function setStatus(id: string, status: PeriodStatus) {
    setPeriods((prev) =>
      prev.map((period) => (period.id === id ? { ...period, status } : period))
    );
    setMessage(`Period updated to ${status}.`);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Period Closing / Locking
        </h2>
        <p className="text-sm text-muted-foreground">
          Soft-lock or fully close accounting periods to prevent backdated posts.
        </p>
      </div>

      {message ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Open</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700">
              {openCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Locked / Closed
            </p>
            <p className="mt-1 text-xl font-semibold">{lockedCount}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="flex items-center gap-3 pt-5">
            <ShieldCheck className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Control tip</p>
              <p className="text-xs text-muted-foreground">
                Soft lock allows corrections; closed blocks posting.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Periods</CardTitle>
          <CardDescription>
            Manage open, soft-locked, and closed periods
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Period</TableHead>
                <TableHead>Fiscal Year</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell className="pl-4 font-medium">
                    {period.name}
                  </TableCell>
                  <TableCell>{period.fiscalYear}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatDate(period.startDate)} – {formatDate(period.endDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("border-0", statusTone[period.status])}
                    >
                      {period.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        disabled={period.status === "Open"}
                        onClick={() => setStatus(period.id, "Open")}
                      >
                        <LockOpen className="size-3.5" />
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        disabled={period.status === "Soft Locked"}
                        onClick={() => setStatus(period.id, "Soft Locked")}
                      >
                        <Lock className="size-3.5" />
                        Soft lock
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1"
                        disabled={period.status === "Closed"}
                        onClick={() => setStatus(period.id, "Closed")}
                      >
                        Close
                      </Button>
                    </div>
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
