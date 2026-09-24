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
  listAllParties,
  type PartyOption,
} from "@/features/parties/api/parties";
import {
  createCashTransaction,
  deleteCashTransaction,
  formatCashCurrency,
  listCashTransactions,
  postCashTransaction,
  type CashTransaction,
  type CashTransactionDirection,
} from "@/features/transactions/api/cash-transactions";
import {
  expenseCategories,
  incomeCategories,
} from "@/features/transactions/data";

type AccountOption = {
  label: string;
  value: string;
  type?: string;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function CashTransactionView() {
  const [date, setDate] = useState(todayIsoDate);
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<CashTransactionDirection>("in");
  const [cashAccountId, setCashAccountId] = useState("");
  const [contraAccountId, setContraAccountId] = useState("");
  const [party, setParty] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [category, setCategory] = useState("");
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [cashOptions, setCashOptions] = useState<AccountOption[]>([]);
  const [contraOptions, setContraOptions] = useState<AccountOption[]>([]);
  const [partyOptions, setPartyOptions] = useState<PartyOption[]>([]);
  const [entries, setEntries] = useState<CashTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const categories = [...incomeCategories, ...expenseCategories];

  const loadEntries = useCallback(async () => {
    const rows = await listCashTransactions();
    setEntries(rows);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const [accountsResult, partiesResult, entriesResult] =
        await Promise.allSettled([
          listAccounts(),
          listAllParties(),
          listCashTransactions(),
        ]);

      if (cancelled) return;

      const errors: string[] = [];

      if (accountsResult.status === "fulfilled") {
        const mapped = accountsResult.value
          .filter((account) => String(account.status ?? "active") === "active")
          .map((account) => ({
            label: account.code
              ? `${account.name} (${account.code})`
              : String(account.name),
            value: String(account.id),
            type: String(account.type ?? ""),
          }));
        setCashOptions(
          mapped.filter((item) => item.type === "cash" || item.type === "bank")
        );
        setContraOptions(
          mapped.filter(
            (item) =>
              item.type === "income" ||
              item.type === "expense" ||
              item.type === "asset" ||
              item.type === "liability" ||
              item.type === "equity"
          )
        );
      } else {
        errors.push(
          accountsResult.reason instanceof Error
            ? accountsResult.reason.message
            : "Failed to load accounts"
        );
      }

      if (partiesResult.status === "fulfilled") {
        setPartyOptions(partiesResult.value);
      } else {
        setPartyOptions([]);
        errors.push(
          partiesResult.reason instanceof Error
            ? partiesResult.reason.message
            : "Failed to load parties"
        );
      }

      if (entriesResult.status === "fulfilled") {
        setEntries(entriesResult.value);
      } else {
        errors.push(
          entriesResult.reason instanceof Error
            ? entriesResult.reason.message
            : "Failed to load cash transactions"
        );
      }

      setError(errors.length ? errors.join(" · ") : null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function handlePartyChange(value: string) {
    setParty(value);
    const selected = partyOptions.find((option) => option.value === value);
    setPartyCode(selected?.code ?? "");
  }

  function resetForm() {
    setAmount("");
    setContraAccountId("");
    setParty("");
    setPartyCode("");
    setCategory("");
    setMethod("Cash");
    setReference("");
    setNarration("");
    setFileName(null);
    setDate(todayIsoDate());
    setDirection("in");
  }

  async function handleSave(status: "draft" | "posted") {
    if (!amount || Number(amount) <= 0 || !cashAccountId) {
      setError("Amount and cash account are required");
      return;
    }
    if (status === "posted" && !contraAccountId) {
      setError("Contra account is required to post");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await createCashTransaction({
        date,
        direction,
        cash_account_id: Number(cashAccountId),
        contra_account_id: contraAccountId
          ? Number(contraAccountId)
          : null,
        party: party || null,
        party_code: partyCode || null,
        category: category || null,
        amount: Number(amount),
        payment_method: method || "Cash",
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
        err instanceof Error ? err.message : "Failed to save cash transaction"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePostExisting(id: string) {
    setSaving(true);
    setError(null);
    try {
      const posted = await postCashTransaction(id);
      setSavedAs(
        `${posted.entryNo} (posted)${
          posted.voucherNo ? ` · ${posted.voucherNo}` : ""
        }`
      );
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to post cash transaction"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    try {
      await deleteCashTransaction(id);
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete cash transaction"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Cash Transaction
            </h2>
            <Badge variant="secondary" className="capitalize">
              cash
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Log cash-in-hand receipts and payments for day-to-day operations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            disabled={saving}
            onClick={() => void handleSave("draft")}
          >
            <Save className="size-4" />
            Save
          </Button>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={
              saving ||
              !amount ||
              Number(amount) <= 0 ||
              !cashAccountId ||
              !contraAccountId
            }
            onClick={() => void handleSave("posted")}
          >
            <Send className="size-4" />
            Post Transaction
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Cash transaction recorded as{" "}
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
          <CardTitle className="text-base">Transaction details</CardTitle>
          <CardDescription>
            Capture the money movement for this cash entry
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
            <Label>Direction</Label>
            <Select
              value={direction}
              onValueChange={(value) =>
                setDirection(value as CashTransactionDirection)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Cash In</SelectItem>
                <SelectItem value="out">Cash Out</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Cash account</Label>
            <Select
              value={cashAccountId || undefined}
              onValueChange={setCashAccountId}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    cashOptions.length
                      ? "Select cash account"
                      : "No cash/bank accounts"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cashOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Contra account</Label>
            <Select
              value={contraAccountId || undefined}
              onValueChange={setContraAccountId}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    contraOptions.length
                      ? "Select contra account"
                      : "No contra accounts"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {contraOptions.map((option) => (
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
                {categories.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Party</Label>
            <Select
              value={party || undefined}
              onValueChange={handlePartyChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    partyOptions.length
                      ? "Select party (optional)"
                      : "No parties loaded"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {partyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              placeholder="Invoice / cheque / memo"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
            <Label htmlFor="narration">Narration</Label>
            <Textarea
              id="narration"
              placeholder="Describe this transaction"
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
            Optionally attach an invoice, bill, or receipt (filename stored)
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
          <CardTitle className="text-base">Recent cash transactions</CardTitle>
          <CardDescription>
            Draft entries can be posted or deleted; posted entries create
            vouchers
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cash transactions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Cash</TableHead>
                    <TableHead>Contra</TableHead>
                    <TableHead>Party</TableHead>
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
                      <TableCell className="capitalize">
                        {entry.direction === "in" ? "In" : "Out"}
                      </TableCell>
                      <TableCell>{entry.cashAccount ?? "—"}</TableCell>
                      <TableCell>{entry.contraAccount ?? "—"}</TableCell>
                      <TableCell>
                        {entry.party ?? "—"}
                        {entry.partyCode ? (
                          <div className="text-xs text-muted-foreground">
                            {entry.partyCode}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCashCurrency(entry.amount)}
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
                                disabled={saving || !entry.contraAccountId}
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
