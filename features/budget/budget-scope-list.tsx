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
  formatCurrency,
  getBudgetsByScope,
  getVariance,
  getVariancePct,
  type BudgetScope,
  type BudgetStatus,
} from "./data";

const statusTone: Record<BudgetStatus, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Approved: "bg-sky-50 text-sky-700",
  Active: "bg-emerald-50 text-emerald-700",
  Closed: "bg-rose-50 text-rose-700",
};

const titles: Record<BudgetScope, string> = {
  department: "Department Budget",
  branch: "Branch Budget",
  project: "Project Budget",
};

const descriptions: Record<BudgetScope, string> = {
  department: "Budgets allocated by department for the fiscal year.",
  branch: "Budgets allocated across company branches.",
  project: "Budgets allocated to projects and initiatives.",
};

export function BudgetScopeList({ scope }: { scope: BudgetScope }) {
  const [query, setQuery] = useState("");
  const source = getBudgetsByScope(scope);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (budget) =>
        budget.name.toLowerCase().includes(q) ||
        budget.code.toLowerCase().includes(q) ||
        budget.owner.toLowerCase().includes(q)
    );
  }, [query, source]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => ({
        budget: acc.budget + row.budgetAmount,
        actual: acc.actual + row.actualAmount,
      }),
      { budget: 0, actual: 0 }
    );
  }, [rows]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {titles[scope]}
        </h2>
        <p className="text-sm text-muted-foreground">{descriptions[scope]}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Budgets</p>
            <p className="mt-1 text-xl font-semibold">{rows.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Total budget
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(totals.budget)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Total actual
            </p>
            <p className="mt-1 text-xl font-semibold text-primary tabular-nums">
              {formatCurrency(totals.actual)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">{titles[scope]}</CardTitle>
              <CardDescription>{rows.length} record(s)</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search budgets…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Budget</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="pr-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((budget) => {
                const variance = getVariance(
                  budget.budgetAmount,
                  budget.actualAmount
                );
                const pct = getVariancePct(
                  budget.budgetAmount,
                  budget.actualAmount
                );
                return (
                  <TableRow key={budget.id}>
                    <TableCell className="pl-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{budget.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {budget.code} · {budget.fiscalYear}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{budget.owner}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(budget.budgetAmount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(budget.actualAmount)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium tabular-nums",
                        variance > 0 ? "text-rose-600" : "text-emerald-700"
                      )}
                    >
                      {variance > 0 ? "+" : ""}
                      {formatCurrency(variance)} ({pct.toFixed(1)}%)
                    </TableCell>
                    <TableCell className="pr-4">
                      <Badge
                        variant="secondary"
                        className={cn("border-0", statusTone[budget.status])}
                      >
                        {budget.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
