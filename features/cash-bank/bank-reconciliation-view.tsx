"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";

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
  bankAccounts,
  formatCurrency,
  formatDate,
  reconciliationLines as initialLines,
  type ReconciliationLine,
} from "./data";

export function BankReconciliationView() {
  const [account, setAccount] = useState(bankAccounts[0]?.name ?? "");
  const [statementBalance, setStatementBalance] = useState("192403");
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<ReconciliationLine[]>(initialLines);
  const [message, setMessage] = useState<string | null>(null);

  const bookBalance =
    bankAccounts.find((item) => item.name === account)?.currentBalance ?? 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lines;
    return lines.filter(
      (line) =>
        line.description.toLowerCase().includes(q) ||
        line.reference.toLowerCase().includes(q)
    );
  }, [lines, query]);

  const unmatched = lines.filter((line) => line.bankStatus !== "Matched");
  const adjusted =
    bookBalance +
    lines
      .filter((line) => line.bankStatus === "Missing in book")
      .reduce(
        (sum, line) =>
          sum + (line.type === "deposit" ? line.amount : -line.amount),
        0
      ) -
    lines
      .filter((line) => line.bankStatus === "Missing in bank")
      .reduce(
        (sum, line) =>
          sum + (line.type === "deposit" ? line.amount : -line.amount),
        0
      );

  const statement = Number(statementBalance || 0);
  const difference = statement - adjusted;

  function markMatched(id: string) {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? { ...line, bookStatus: "Cleared", bankStatus: "Matched" }
          : line
      )
    );
  }

  function finishReconciliation() {
    setMessage(
      Math.abs(difference) < 0.01
        ? `Reconciliation completed for ${account}.`
        : `Difference remaining: ${formatCurrency(difference)}. Review unmatched items.`
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Bank Reconciliation
          </h2>
          <p className="text-sm text-muted-foreground">
            Match book entries with the bank statement and clear differences.
          </p>
        </div>
        <Button
          className="gap-1.5 shadow-sm shadow-primary/20"
          onClick={finishReconciliation}
        >
          <CheckCircle2 className="size-4" />
          Complete reconciliation
        </Button>
      </div>

      {message ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-4">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60 lg:col-span-2">
          <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <p className="text-xs text-muted-foreground uppercase">
                Bank account
              </p>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <p className="text-xs text-muted-foreground uppercase">
                Statement balance
              </p>
              <Input
                type="number"
                className="tabular-nums"
                value={statementBalance}
                onChange={(e) => setStatementBalance(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">
              Book balance
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCurrency(bookBalance)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase">Difference</p>
            <p
              className={cn(
                "mt-1 text-xl font-semibold tabular-nums",
                Math.abs(difference) < 0.01
                  ? "text-emerald-700"
                  : "text-rose-600"
              )}
            >
              {formatCurrency(difference)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Statement lines</CardTitle>
              <CardDescription>
                {unmatched.length} unmatched item(s)
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lines…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bank status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="pl-4 text-muted-foreground tabular-nums">
                    {formatDate(line.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{line.description}</span>
                      <span className="text-xs text-muted-foreground">
                        {line.reference}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{line.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0",
                        line.bankStatus === "Matched"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {line.bankStatus}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-semibold tabular-nums",
                      line.type === "deposit"
                        ? "text-emerald-700"
                        : "text-rose-600"
                    )}
                  >
                    {line.type === "deposit" ? "+" : "−"}
                    {formatCurrency(line.amount)}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    {line.bankStatus !== "Matched" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markMatched(line.id)}
                      >
                        Mark matched
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
