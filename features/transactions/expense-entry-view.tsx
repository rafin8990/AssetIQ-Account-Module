"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Save, Send, Trash2 } from "lucide-react";

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
  listPaymentParties,
  type PartyOption,
} from "@/features/parties/api/parties";
import {
  addExpensePayment,
  createExpenseEntry,
  deleteExpensePayment,
  formatExpenseCurrency,
  getExpenseEntry,
  listExpenseEntries,
  postExpenseEntry,
  type ExpenseEntry,
} from "@/features/transactions/api/expense-entries";

type AccountOption = {
  label: string;
  value: string;
  type?: string;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseEntryView() {
  const [date, setDate] = useState(todayIsoDate);
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [cashAccountId, setCashAccountId] = useState("");
  const [expenseAccountId, setExpenseAccountId] = useState("");
  const [party, setParty] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [cashOptions, setCashOptions] = useState<AccountOption[]>([]);
  const [expenseOptions, setExpenseOptions] = useState<AccountOption[]>([]);
  const [partyOptions, setPartyOptions] = useState<PartyOption[]>([]);
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAs, setSavedAs] = useState<string | null>(null);
  const [paymentEntryId, setPaymentEntryId] = useState<string | null>(null);
  const [paymentDetail, setPaymentDetail] = useState<ExpenseEntry | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentBusy, setPaymentBusy] = useState(false);

  const pendingPreview = useMemo(() => {
    const total = Number(amount || 0);
    const paid = Number(paidAmount || 0);
    return Math.max(total - paid, 0);
  }, [amount, paidAmount]);

  const loadEntries = useCallback(async () => {
    const rows = await listExpenseEntries();
    setEntries(rows);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const [accountsResult, partiesResult, entriesResult] =
        await Promise.allSettled([
          listAccounts(),
          listPaymentParties(),
          listExpenseEntries(),
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
        setExpenseOptions(mapped.filter((item) => item.type === "expense"));
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
            : "Failed to load vendors"
        );
      }

      if (entriesResult.status === "fulfilled") {
        setEntries(entriesResult.value);
      } else {
        errors.push(
          entriesResult.reason instanceof Error
            ? entriesResult.reason.message
            : "Failed to load expense entries"
        );
      }

      setError(errors.length ? errors.join(" · ") : null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!paymentEntryId) {
      setPaymentDetail(null);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const detail = await getExpenseEntry(paymentEntryId);
        if (!cancelled) setPaymentDetail(detail);
      } catch {
        if (!cancelled) setPaymentDetail(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentEntryId]);

  function handlePartyChange(value: string) {
    setParty(value);
    const selected = partyOptions.find((option) => option.value === value);
    setVendorCode(selected?.code ?? "");
  }

  async function handleSave(status: "draft" | "posted") {
    if (!amount || Number(amount) <= 0 || !cashAccountId || !expenseAccountId) {
      setError("Amount, cash account, and expense account are required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await createExpenseEntry({
        date,
        party: party.trim() || null,
        vendor_code: vendorCode.trim() || null,
        cash_account_id: Number(cashAccountId),
        expense_account_id: Number(expenseAccountId),
        amount: Number(amount),
        paid_amount: Number(paidAmount || 0),
        payment_method: method || null,
        reference: reference.trim() || undefined,
        narration: narration.trim() || undefined,
        status,
      });
      setSavedAs(`${created.entryNo} (${created.status})`);
      setAmount("");
      setPaidAmount("");
      setParty("");
      setVendorCode("");
      setReference("");
      setNarration("");
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    } finally {
      setSaving(false);
    }
  }

  async function handlePostExisting(id: string) {
    setSaving(true);
    setError(null);
    try {
      const posted = await postExpenseEntry(id);
      setSavedAs(`${posted.entryNo} (posted)`);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post expense");
    } finally {
      setSaving(false);
    }
  }

  async function handleRecordPayment() {
    if (!paymentEntryId || !paymentAmount || Number(paymentAmount) <= 0) {
      return;
    }
    setPaymentBusy(true);
    setError(null);
    try {
      const updated = await addExpensePayment(paymentEntryId, {
        amount: Number(paymentAmount),
        payment_method: paymentMethod,
      });
      setPaymentDetail(updated);
      setPaymentAmount("");
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setPaymentBusy(false);
    }
  }

  async function handleDeletePayment(paymentId: string) {
    if (!paymentEntryId || !window.confirm("Delete this payment?")) return;
    setPaymentBusy(true);
    setError(null);
    try {
      const updated = await deleteExpensePayment(paymentEntryId, paymentId);
      setPaymentDetail(updated);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete payment");
    } finally {
      setPaymentBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Expense Entry
            </h2>
            <Badge variant="secondary">expense</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Record manual expenses and track AssetIQ purchase order amounts,
            pending, and paid amounts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            disabled={saving || loading}
            onClick={() => void handleSave("draft")}
          >
            <Save className="size-4" />
            Save
          </Button>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={
              saving ||
              loading ||
              !amount ||
              Number(amount) <= 0 ||
              !cashAccountId ||
              !expenseAccountId
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
          Expense recorded as <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Transaction details</CardTitle>
            <CardDescription>
              Capture purchase and operating expenses paid from cash or bank
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
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
              <Label htmlFor="paid">Paid now</Label>
              <Input
                id="paid"
                type="number"
                placeholder="0.00"
                className="tabular-nums"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Payment method</Label>
              <Select value={method} onValueChange={setMethod}>
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
              <Label>Cash / bank account</Label>
              <Select
                value={cashAccountId || undefined}
                onValueChange={setCashAccountId}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading accounts…"
                        : cashOptions.length
                          ? "Select pay-from account"
                          : "No cash/bank accounts"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cashOptions.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      No active cash/bank accounts in chart of accounts
                    </SelectItem>
                  ) : (
                    cashOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Expense account</Label>
              <Select
                value={expenseAccountId || undefined}
                onValueChange={setExpenseAccountId}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading accounts…"
                        : expenseOptions.length
                          ? "Select expense account"
                          : "No expense accounts"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {expenseOptions.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      No active expense accounts in chart of accounts
                    </SelectItem>
                  ) : (
                    expenseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>
                Party{" "}
                <span className="font-normal text-muted-foreground">
                  (vendors)
                </span>
              </Label>
              <Select
                value={party || undefined}
                onValueChange={handlePartyChange}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading vendors…"
                        : partyOptions.length
                          ? "Select vendor"
                          : "No vendors found"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {partyOptions.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      No vendors in Vendor service
                    </SelectItem>
                  ) : (
                    partyOptions.map((option) => (
                      <SelectItem
                        key={`${option.kind}-${option.code || option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {vendorCode ? (
                <p className="text-xs text-muted-foreground">
                  Vendor code: {vendorCode}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Invoice / PO / memo"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="narration">Narration</Label>
              <Textarea
                id="narration"
                placeholder="Describe this expense"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Amount summary</CardTitle>
            <CardDescription>
              Pending and paid amounts for this entry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expense amount</span>
              <span className="font-medium tabular-nums">
                {formatExpenseCurrency(Number(amount || 0))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Paid now</span>
              <span className="font-medium tabular-nums">
                {formatExpenseCurrency(Number(paidAmount || 0))}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-semibold tabular-nums">
                {formatExpenseCurrency(pendingPreview)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Expenses &amp; POs</CardTitle>
          <CardDescription>
            Manual entries and AssetIQ purchase orders synced on approval
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading entries…</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No expense entries yet. Create one above or approve an AssetIQ
              purchase order.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry / PO</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{entry.entryNo}</span>
                        {entry.sourcePoCode ? (
                          <span className="text-xs text-muted-foreground">
                            PO: {entry.sourcePoCode}
                          </span>
                        ) : null}
                        <Badge variant="outline" className="w-fit capitalize">
                          {entry.source}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span>{entry.party || "—"}</span>
                        {entry.vendorCode ? (
                          <span className="text-xs text-muted-foreground">
                            {entry.vendorCode}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatExpenseCurrency(entry.amount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatExpenseCurrency(entry.paidAmount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatExpenseCurrency(entry.pendingAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className="w-fit capitalize">
                          {entry.status}
                        </Badge>
                        <Badge variant="outline" className="w-fit capitalize">
                          {entry.paymentStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {entry.status === "draft" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={saving}
                            onClick={() => void handlePostExisting(entry.id)}
                          >
                            Post
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPaymentEntryId(entry.id);
                            setPaymentAmount(
                              entry.pendingAmount > 0
                                ? String(entry.pendingAmount)
                                : ""
                            );
                          }}
                        >
                          Payments
                        </Button>
                        {entry.voucherNo ? (
                          <Button size="sm" variant="ghost" asChild>
                            <Link
                              href={`/vouchers/print?no=${encodeURIComponent(entry.voucherNo)}`}
                            >
                              Voucher
                            </Link>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {paymentEntryId ? (
            <div className="mt-4 space-y-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    Payments · {paymentDetail?.entryNo ?? "…"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pending{" "}
                    {formatExpenseCurrency(paymentDetail?.pendingAmount ?? 0)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPaymentEntryId(null);
                    setPaymentAmount("");
                    setPaymentDetail(null);
                  }}
                >
                  Close
                </Button>
              </div>

              {(paymentDetail?.payments?.length ?? 0) > 0 ? (
                <div className="overflow-x-auto rounded-lg border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentDetail?.payments?.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {String(payment.paidAt).slice(0, 10)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatExpenseCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell>{payment.reference || "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={paymentBusy}
                              onClick={() =>
                                void handleDeletePayment(payment.id)
                              }
                            >
                              <Trash2 className="size-3.5 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No payments recorded yet.
                </p>
              )}

              {(paymentDetail?.pendingAmount ?? 0) > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Payment amount</Label>
                    <Input
                      type="number"
                      className="tabular-nums"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank">Bank</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      disabled={paymentBusy}
                      onClick={() => void handleRecordPayment()}
                    >
                      Record payment
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
