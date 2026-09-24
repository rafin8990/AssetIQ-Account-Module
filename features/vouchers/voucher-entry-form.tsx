"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Send, Trash2 } from "lucide-react";

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
import { cn } from "@/lib/utils";

import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import {
  listPaymentParties,
  listReceiptParties,
  type PartyOption,
} from "@/features/parties/api/parties";
import { createVoucher } from "@/features/vouchers/api/vouchers";
import {
  formatCurrency,
  voucherTypeLabels,
  type VoucherType,
} from "./data";

type LineDraft = {
  id: string;
  accountId: string;
  narration: string;
  debit: string;
  credit: string;
};

type AccountOption = {
  label: string;
  value: string;
  type?: string;
};

type VoucherEntryFormProps = {
  type: VoucherType;
  description: string;
};

function createLine(): LineDraft {
  return {
    id: crypto.randomUUID(),
    accountId: "",
    narration: "",
    debit: "",
    credit: "",
  };
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isCashLike(type?: string) {
  return type === "cash" || type === "bank";
}

export function VoucherEntryForm({ type, description }: VoucherEntryFormProps) {
  const [date, setDate] = useState(todayIsoDate);
  const [reference, setReference] = useState("");
  const [party, setParty] = useState("");
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([createLine()]);
  const [accountOptions, setAccountOptions] = useState<AccountOption[]>([]);
  const [partyOptions, setPartyOptions] = useState<PartyOption[]>([]);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [partiesError, setPartiesError] = useState<string | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const showParty = type === "payment" || type === "receipt";
  const showTransfer =
    type === "payment" || type === "receipt" || type === "contra";

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoadingOptions(true);
      const accountsPromise = listAccounts();
      const partiesPromise = showParty
        ? type === "payment"
          ? listPaymentParties()
          : listReceiptParties()
        : Promise.resolve([] as PartyOption[]);

      const [accountsResult, partiesResult] = await Promise.allSettled([
        accountsPromise,
        partiesPromise,
      ]);

      if (cancelled) return;

      if (accountsResult.status === "fulfilled") {
        setAccountOptions(
          accountsResult.value.map((account) => ({
            label: account.code
              ? `${account.name} (${account.code})`
              : String(account.name),
            value: String(account.id),
            type: String(account.type ?? ""),
          }))
        );
        setAccountsError(null);
      } else {
        setAccountsError(
          accountsResult.reason instanceof Error
            ? accountsResult.reason.message
            : "Failed to load accounts"
        );
      }

      if (partiesResult.status === "fulfilled") {
        setPartyOptions(partiesResult.value);
        setPartiesError(null);
      } else if (showParty) {
        setPartyOptions([]);
        setPartiesError(
          partiesResult.reason instanceof Error
            ? partiesResult.reason.message
            : "Failed to load parties"
        );
      } else {
        setPartyOptions([]);
        setPartiesError(null);
      }

      setLoadingOptions(false);
      setParty("");
      setFromAccountId("");
      setToAccountId("");
    })();

    return () => {
      cancelled = true;
    };
  }, [showParty, type]);

  const cashAccountOptions = useMemo(
    () => accountOptions.filter((option) => isCashLike(option.type)),
    [accountOptions]
  );

  const fromAccountOptions = useMemo(() => {
    if (type === "payment" || type === "receipt" || type === "contra") {
      return cashAccountOptions.length ? cashAccountOptions : accountOptions;
    }
    return accountOptions;
  }, [accountOptions, cashAccountOptions, type]);

  const toAccountOptions = useMemo(() => {
    if (type === "contra") {
      return cashAccountOptions.length ? cashAccountOptions : accountOptions;
    }
    if (type === "receipt") {
      const incomeLike = accountOptions.filter(
        (option) =>
          option.type === "income" || option.type === "receivable"
      );
      return incomeLike.length ? incomeLike : accountOptions;
    }
    if (type === "payment") {
      const payableLike = accountOptions.filter(
        (option) =>
          option.type === "expense" || option.type === "payable"
      );
      return payableLike.length ? payableLike : accountOptions;
    }
    return accountOptions;
  }, [accountOptions, cashAccountOptions, type]);

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, line) => ({
        debit: acc.debit + Number(line.debit || 0),
        credit: acc.credit + Number(line.credit || 0),
      }),
      { debit: 0, credit: 0 }
    );
  }, [lines]);

  const balanced = Math.abs(totals.debit - totals.credit) < 0.001;
  function updateLine(id: string, patch: Partial<LineDraft>) {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line))
    );
  }

  function removeLine(id: string) {
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((line) => line.id !== id)
    );
  }

  async function handleSave(status: "draft" | "pending") {
    if (!balanced || totals.debit <= 0) {
      setSaveError("Voucher lines must be balanced with an amount greater than zero.");
      return;
    }

    const missingAccount = lines.some((line) => !line.accountId);
    if (missingAccount) {
      setSaveError("Select an account for every ledger line.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const created = await createVoucher({
        type,
        date,
        party: showParty ? party || null : null,
        from_account_id: showTransfer && fromAccountId
          ? Number(fromAccountId)
          : null,
        to_account_id: showTransfer && toAccountId
          ? Number(toAccountId)
          : null,
        reference: reference.trim() || undefined,
        narration: narration.trim() || undefined,
        status,
        lines: lines.map((line) => ({
          account_id: Number(line.accountId),
          narration: line.narration.trim() || undefined,
          debit: Number(line.debit || 0),
          credit: Number(line.credit || 0),
        })),
      });

      setSavedAs(`${created.voucherNo} (${created.status})`);
      setReference("");
      setParty("");
      setFromAccountId("");
      setToAccountId("");
      setNarration("");
      setLines([createLine()]);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save voucher"
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
              {voucherTypeLabels[type]}
            </h2>
            <Badge variant="secondary" className="capitalize">
              {type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => void handleSave("draft")}
            disabled={saving}
            className="gap-1.5"
          >
            <Save className="size-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => void handleSave("pending")}
            disabled={saving || !balanced || totals.debit <= 0}
            className="gap-1.5 shadow-sm shadow-primary/20"
          >
            <Send className="size-4" />
            Submit for Approval
          </Button>
        </div>
      </div>

      {accountsError || partiesError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {accountsError || partiesError}
        </div>
      ) : null}

      {saveError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      ) : null}

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Voucher saved as <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Voucher details</CardTitle>
          <CardDescription>
            Header information for this {type} entry
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="date">Voucher date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reference">Reference no.</Label>
            <Input
              id="reference"
              placeholder="Invoice / cheque / memo"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          {showParty ? (
            <div className="grid gap-2">
              <Label>
                Party{" "}
                <span className="text-muted-foreground font-normal">
                  ({type === "payment" ? "vendors" : "customers"})
                </span>
              </Label>
              <Select
                value={party || undefined}
                onValueChange={setParty}
                disabled={loadingOptions}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      loadingOptions
                        ? "Loading parties…"
                        : type === "payment"
                          ? "Select vendor"
                          : "Select customer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {partyOptions.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      No parties found
                    </SelectItem>
                  ) : (
                    partyOptions.map((option) => (
                      <SelectItem key={`${option.kind}-${option.code || option.value}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          {showTransfer ? (
            <>
              <div className="grid gap-2">
                <Label>
                  {type === "receipt"
                    ? "Received in"
                    : "Paid from / Transfer from"}
                </Label>
                <Select
                  value={fromAccountId || undefined}
                  onValueChange={setFromAccountId}
                  disabled={loadingOptions}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingOptions ? "Loading accounts…" : "Select account"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {fromAccountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>
                  {type === "receipt"
                    ? "Received from account"
                    : "Paid to / Transfer to"}
                </Label>
                <Select
                  value={toAccountId || undefined}
                  onValueChange={setToAccountId}
                  disabled={loadingOptions}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingOptions ? "Loading accounts…" : "Select account"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {toAccountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : null}
          <div
            className={cn(
              "grid gap-2",
              showParty || showTransfer
                ? "sm:col-span-2 lg:col-span-3"
                : "sm:col-span-2"
            )}
          >
            <Label htmlFor="narration">Narration</Label>
            <Textarea
              id="narration"
              placeholder="Describe the purpose of this voucher"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Ledger lines</CardTitle>
              <CardDescription>
                Debit and credit must balance before submit
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setLines((prev) => [...prev, createLine()])}
            >
              <Plus className="size-4" />
              Add line
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Account</TableHead>
                <TableHead>Line narration</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="pr-4 text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="min-w-48 pl-4">
                    <Select
                      value={line.accountId || undefined}
                      onValueChange={(value) =>
                        updateLine(line.id, { accountId: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={line.narration}
                      placeholder="Optional"
                      onChange={(e) =>
                        updateLine(line.id, { narration: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="ml-auto max-w-28 text-right tabular-nums"
                      value={line.debit}
                      onChange={(e) =>
                        updateLine(line.id, {
                          debit: e.target.value,
                          credit: e.target.value ? "" : line.credit,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      className="ml-auto max-w-28 text-right tabular-nums"
                      value={line.credit}
                      onChange={(e) =>
                        updateLine(line.id, {
                          credit: e.target.value,
                          debit: e.target.value ? "" : line.debit,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeLine(line.id)}
                      aria-label="Remove line"
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableCell className="pl-4 font-medium" colSpan={2}>
                  Totals{" "}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-2 border-0",
                      balanced
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {balanced ? "Balanced" : "Out of balance"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatCurrency(totals.debit)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatCurrency(totals.credit)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
