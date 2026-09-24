"use client";

import { useCallback, useEffect, useState } from "react";
import { Paperclip, Save, Send, Trash2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import {
  createFundTransfer,
  deleteFundTransfer,
  formatFundCurrency,
  listFundTransfers,
  postFundTransfer,
  type FundTransfer,
} from "@/features/transactions/api/fund-transfers";

type AccountOption = {
  label: string;
  value: string;
  type?: string;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function FundTransferView() {
  const [date, setDate] = useState(todayIsoDate);
  const [amount, setAmount] = useState("");
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [category, setCategory] = useState("Fund Transfer");
  const [method, setMethod] = useState("Transfer");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [entries, setEntries] = useState<FundTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    const rows = await listFundTransfers();
    setEntries(rows);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const [accountsResult, entriesResult] = await Promise.allSettled([
        listAccounts(),
        listFundTransfers(),
      ]);

      if (cancelled) return;

      const errors: string[] = [];

      if (accountsResult.status === "fulfilled") {
        setAccountOptions(
          accountsResult.value
            .filter((account) => String(account.status ?? "active") === "active")
            .filter(
              (account) =>
                account.type === "cash" || account.type === "bank"
            )
            .map((account) => ({
              label: account.code
                ? `${account.name} (${account.code})`
                : String(account.name),
              value: String(account.id),
              type: String(account.type ?? ""),
            }))
        );
      } else {
        errors.push(
          accountsResult.reason instanceof Error
            ? accountsResult.reason.message
            : "Failed to load accounts"
        );
      }

      if (entriesResult.status === "fulfilled") {
        setEntries(entriesResult.value);
      } else {
        errors.push(
          entriesResult.reason instanceof Error
            ? entriesResult.reason.message
            : "Failed to load fund transfers"
        );
      }

      setError(errors.length ? errors.join(" · ") : null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setAmount("");
    setFromAccountId("");
    setToAccountId("");
    setCategory("Fund Transfer");
    setMethod("Transfer");
    setReference("");
    setNarration("");
    setFileName(null);
    setDate(todayIsoDate());
  }

  async function handleSave(status: "draft" | "posted") {
    if (!amount || Number(amount) <= 0 || !fromAccountId || !toAccountId) {
      setError("Amount, from account, and to account are required");
      return;
    }
    if (fromAccountId === toAccountId) {
      setError("From and to accounts must be different");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await createFundTransfer({
        date,
        from_account_id: Number(fromAccountId),
        to_account_id: Number(toAccountId),
        category: category || "Fund Transfer",
        amount: Number(amount),
        payment_method: method || "Transfer",
        reference: reference || undefined,
        narration: narration || undefined,
        attachment_name: fileName,
        status,
      });

      setSavedAs(
        `${created.entryNo} (${created.status})${
          created.voucherNo ? ` · ${created.voucherNo}` : ""
        }`
      );
      resetForm();
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save fund transfer"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePostExisting(id: string) {
    setSaving(true);
    setError(null);
    try {
      const posted = await postFundTransfer(id);
      setSavedAs(
        `${posted.entryNo} (posted)${
          posted.voucherNo ? ` · ${posted.voucherNo}` : ""
        }`
      );
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to post fund transfer"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    try {
      await deleteFundTransfer(id);
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete fund transfer"
      );
    } finally {
      setSaving(false);
    }
  }

  const canSubmit =
    !!amount &&
    Number(amount) > 0 &&
    !!fromAccountId &&
    !!toAccountId &&
    fromAccountId !== toAccountId;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Fund Transfer
            </h2>
            <Badge variant="secondary" className="capitalize">
              transfer
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Move funds between cash and bank accounts without affecting profit
            or loss.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            disabled={saving || !canSubmit}
            onClick={() => void handleSave("draft")}
          >
            <Save className="size-4" />
            Save
          </Button>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={saving || !canSubmit}
            onClick={() => void handleSave("posted")}
          >
            <Send className="size-4" />
            Post Transfer
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Fund transfer recorded as{" "}
          <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Transfer details</CardTitle>
          <CardDescription>
            Move money from one cash/bank account to another
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className="tabular-nums"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Payment method</Label>
            <Select value={method || undefined} onValueChange={setMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transfer">Transfer</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>From account</Label>
            <Select
              value={fromAccountId || undefined}
              onValueChange={setFromAccountId}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    accountOptions.length
                      ? "Select source account"
                      : "No cash/bank accounts"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {accountOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>To account</Label>
            <Select
              value={toAccountId || undefined}
              onValueChange={setToAccountId}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    accountOptions.length
                      ? "Select destination account"
                      : "No cash/bank accounts"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {accountOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category || undefined} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fund Transfer">Fund Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              placeholder="Memo / transfer ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
            <Label htmlFor="narration">Narration</Label>
            <Textarea
              id="narration"
              placeholder="Describe this transfer"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Supporting document</CardTitle>
          <CardDescription>
            Optionally attach a transfer slip (filename stored)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-8 text-center transition-colors hover:bg-primary/10">
            <Paperclip className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {fileName ?? "Click to attach a file"}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG, or XLSX up to 5 MB
              </p>
            </div>
            <Input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={(e) =>
                setFileName(e.target.files?.[0]?.name ?? null)
              }
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Recent fund transfers</CardTitle>
          <CardDescription>
            Draft transfers can be posted or deleted; posted ones create contra
            vouchers
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No fund transfers yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        <div>{entry.entryNo}</div>
                        {entry.voucherNo ? (
                          <div className="text-xs text-muted-foreground">
                            {entry.voucherNo}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.fromAccount ?? "—"}</TableCell>
                      <TableCell>{entry.toAccount ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatFundCurrency(entry.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.status === "posted" ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {entry.status === "draft" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={saving}
                                onClick={() =>
                                  void handlePostExisting(entry.id)
                                }
                              >
                                Post
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={saving}
                                onClick={() => void handleDelete(entry.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
