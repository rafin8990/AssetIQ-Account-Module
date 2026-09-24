"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, Search } from "lucide-react";

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
import { formatCurrency } from "@/lib/format-currency";
import { formatDate } from "@/features/cash-bank/data";
import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import {
  addStatementLine,
  completeBankReconciliation,
  createBankReconciliation,
  listBankReconciliations,
  matchReconciliationLine,
  type BankReconciliation,
  type BankReconciliationDirection,
} from "@/features/cash-bank/api/bank-reconciliations";

type AccountOption = {
  id: string;
  name: string;
  code: string;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function BankReconciliationView() {
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [accountId, setAccountId] = useState("");
  const [statementDate, setStatementDate] = useState(todayIsoDate);
  const [statementBalance, setStatementBalance] = useState("");
  const [session, setSession] = useState<BankReconciliation | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [stmtDate, setStmtDate] = useState(todayIsoDate);
  const [stmtDesc, setStmtDesc] = useState("");
  const [stmtRef, setStmtRef] = useState("");
  const [stmtAmount, setStmtAmount] = useState("");
  const [stmtDirection, setStmtDirection] =
    useState<BankReconciliationDirection>("deposit");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const rows = await listAccounts({ type: "bank", status: "active" });
        if (cancelled) return;
        const options = rows.map((row) => ({
          id: String(row.id),
          name: String(row.name),
          code: String(row.code ?? ""),
        }));
        setAccounts(options);
        const firstId = options[0]?.id ?? "";
        setAccountId((prev) => prev || firstId);

        if (firstId) {
          const open = await listBankReconciliations({
            bankAccountId: firstId,
            status: "open",
          });
          if (cancelled) return;
          if (open[0]) {
            setSession(open[0]);
            setStatementBalance(String(open[0].statementBalance));
            setStatementDate(open[0].statementDate);
          }
        }
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load bank accounts"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const lines = session?.lines ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lines;
    return lines.filter(
      (line) =>
        line.description.toLowerCase().includes(q) ||
        line.reference.toLowerCase().includes(q)
    );
  }, [lines, query]);

  const bookBalance = session?.bookBalance ?? 0;
  const difference = session?.difference ?? 0;
  const selectedName =
    accounts.find((item) => item.id === accountId)?.name ?? "Bank account";

  async function startSession() {
    if (!accountId || statementBalance === "") {
      setError("Bank account and statement balance are required");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const created = await createBankReconciliation({
        bank_account_id: Number(accountId),
        statement_date: statementDate,
        statement_balance: Number(statementBalance),
      });
      setSession(created);
      setMessage(
        `Opened reconciliation with ${created.lines.length} book line(s).`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start reconciliation"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleMatch(lineId: string) {
    if (!session) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await matchReconciliationLine(session.id, lineId);
      setSession(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to match line");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddStatementLine() {
    if (!session || Number(stmtAmount) <= 0) {
      setError("Amount is required for statement line");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await addStatementLine(session.id, {
        date: stmtDate,
        description: stmtDesc || null,
        reference: stmtRef || null,
        amount: Number(stmtAmount),
        direction: stmtDirection,
      });
      setSession(updated);
      setStmtDesc("");
      setStmtRef("");
      setStmtAmount("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add statement line"
      );
    } finally {
      setSaving(false);
    }
  }

  async function finishReconciliation() {
    if (!session) {
      setError("Start a reconciliation first");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await completeBankReconciliation(session.id);
      setSession(updated);
      setMessage(`Reconciliation completed for ${selectedName}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete reconciliation"
      );
    } finally {
      setSaving(false);
    }
  }

  function bankStatusLabel(line: (typeof lines)[number]) {
    if (line.matchStatus === "matched") return "Matched";
    return line.source === "book" ? "Missing in bank" : "Missing in book";
  }

  function bookStatusLabel(line: (typeof lines)[number]) {
    if (line.matchStatus === "matched") return "Cleared";
    return line.source === "book" ? "Uncleared" : "—";
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
        <div className="flex flex-wrap gap-2">
          {!session || session.status === "completed" ? (
            <Button
              variant="outline"
              disabled={saving || loading || !accountId}
              onClick={() => void startSession()}
            >
              Start reconciliation
            </Button>
          ) : null}
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={saving || !session || session.status === "completed"}
            onClick={() => void finishReconciliation()}
          >
            <CheckCircle2 className="size-4" />
            Complete reconciliation
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-4">
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60 lg:col-span-2">
          <CardContent className="grid gap-3 pt-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <p className="text-xs text-muted-foreground uppercase">
                Bank account
              </p>
              <Select
                value={accountId || undefined}
                onValueChange={(value) => {
                  setAccountId(value);
                  setSession(null);
                  setMessage(null);
                  void (async () => {
                    try {
                      const open = await listBankReconciliations({
                        bankAccountId: value,
                        status: "open",
                      });
                      if (open[0]) {
                        setSession(open[0]);
                        setStatementBalance(String(open[0].statementBalance));
                        setStatementDate(open[0].statementDate);
                      }
                    } catch {
                      // ignore — user can start a new session
                    }
                  })();
                }}
                disabled={!!session && session.status === "open"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.code ? `${item.name} (${item.code})` : item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <p className="text-xs text-muted-foreground uppercase">
                Statement date
              </p>
              <Input
                type="date"
                value={statementDate}
                onChange={(e) => setStatementDate(e.target.value)}
                disabled={!!session && session.status === "open"}
              />
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
                disabled={!!session && session.status === "open"}
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

      {session && session.status === "open" ? (
        <Card className="border-0 bg-card/90 shadow-sm ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Add statement line</CardTitle>
            <CardDescription>
              Record items on the bank statement that are missing in the book.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-4 sm:grid-cols-6">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={stmtDate}
                onChange={(e) => setStmtDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Description</Label>
              <Input
                value={stmtDesc}
                onChange={(e) => setStmtDesc(e.target.value)}
                placeholder="Statement description"
              />
            </div>
            <div className="grid gap-2">
              <Label>Reference</Label>
              <Input
                value={stmtRef}
                onChange={(e) => setStmtRef(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input
                type="number"
                className="tabular-nums"
                value={stmtAmount}
                onChange={(e) => setStmtAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Direction</Label>
              <div className="flex gap-2">
                <Select
                  value={stmtDirection}
                  onValueChange={(value) =>
                    setStmtDirection(value as BankReconciliationDirection)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={saving}
                  onClick={() => void handleAddStatementLine()}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">{selectedName}</CardTitle>
              <CardDescription>
                {session
                  ? `${session.unmatchedCount} unmatched · ${session.status}`
                  : loading
                    ? "Loading…"
                    : "Start a reconciliation to load book lines"}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search lines…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead className="pr-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!session || filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {session
                      ? "No reconciliation lines."
                      : "No active reconciliation."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="pl-4 text-muted-foreground tabular-nums">
                      {formatDate(line.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span>{line.description || "—"}</span>
                        <Badge variant="outline" className="w-fit capitalize">
                          {line.source} · {line.direction}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {line.reference || "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(line.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          line.matchStatus === "matched"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {bookStatusLabel(line)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          line.matchStatus === "matched"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          line.matchStatus === "matched"
                            ? ""
                            : "border-amber-300 text-amber-800"
                        }
                      >
                        {bankStatusLabel(line)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      {line.matchStatus !== "matched" &&
                      session.status === "open" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={saving}
                          onClick={() => void handleMatch(line.id)}
                        >
                          Mark matched
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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
