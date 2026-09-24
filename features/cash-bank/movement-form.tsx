"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Send } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import {
  createBankTransaction,
  postBankTransaction,
} from "@/features/transactions/api/bank-transactions";
import {
  createCashTransaction,
  postCashTransaction,
} from "@/features/transactions/api/cash-transactions";
import {
  createFundTransfer,
  postFundTransfer,
} from "@/features/transactions/api/fund-transfers";
import { formatCurrency } from "@/lib/format-currency";

type MovementKind = "deposit" | "withdrawal" | "transfer";

type AccountOption = {
  id: string;
  name: string;
  code: string;
  type: string;
};

const titles: Record<MovementKind, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Account-to-Account Transfer",
};

const descriptions: Record<MovementKind, string> = {
  deposit: "Add money into a cash or bank account.",
  withdrawal: "Take money out of a cash or bank account.",
  transfer: "Move funds between cash and bank accounts.",
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function CashBankMovementForm({ kind }: { kind: MovementKind }) {
  const [date, setDate] = useState(todayIsoDate);
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [contraAccountId, setContraAccountId] = useState("");
  const [method, setMethod] = useState(
    kind === "transfer" ? "Transfer" : kind === "deposit" ? "Cash" : "Cash"
  );
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [moneyAccounts, setMoneyAccounts] = useState<AccountOption[]>([]);
  const [contraAccounts, setContraAccounts] = useState<AccountOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAs, setSavedAs] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const accounts = await listAccounts({ status: "active" });
        if (cancelled) return;

        const money = accounts
          .filter(
            (account) => account.type === "cash" || account.type === "bank"
          )
          .map((account) => ({
            id: String(account.id),
            name: String(account.name),
            code: String(account.code ?? ""),
            type: String(account.type),
          }));

        const contra = accounts
          .filter(
            (account) =>
              account.type !== "cash" && account.type !== "bank"
          )
          .map((account) => ({
            id: String(account.id),
            name: String(account.name),
            code: String(account.code ?? ""),
            type: String(account.type),
          }));

        setMoneyAccounts(money);
        setContraAccounts(contra);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load accounts"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => moneyAccounts.find((item) => item.id === accountId) ?? null,
    [accountId, moneyAccounts]
  );

  const cashCount = moneyAccounts.filter((a) => a.type === "cash").length;
  const bankCount = moneyAccounts.filter((a) => a.type === "bank").length;

  const canPost =
    Number(amount) > 0 &&
    !!accountId &&
    (kind === "transfer"
      ? !!toAccountId && toAccountId !== accountId
      : !!contraAccountId);

  async function handleSave(status: "draft" | "posted") {
    if (!accountId || Number(amount) <= 0) {
      setError("Amount and account are required");
      return;
    }
    if (kind === "transfer" && (!toAccountId || toAccountId === accountId)) {
      setError("Select a different destination account");
      return;
    }
    if (kind !== "transfer" && status === "posted" && !contraAccountId) {
      setError("Contra account is required to post");
      return;
    }

    setSaving(true);
    setError(null);
    setSavedAs(null);

    try {
      const amt = Number(amount);

      if (kind === "transfer") {
        const created = await createFundTransfer({
          date,
          from_account_id: Number(accountId),
          to_account_id: Number(toAccountId),
          amount: amt,
          payment_method: method || "Transfer",
          reference: reference || undefined,
          narration: narration || undefined,
          status: "draft",
        });
        const result =
          status === "posted"
            ? await postFundTransfer(created.id)
            : created;
        setSavedAs(
          `${result.entryNo}${result.voucherNo ? ` · ${result.voucherNo}` : ""} (${result.status})`
        );
      } else {
        const direction = kind === "deposit" ? "in" : "out";
        const accountType = selected?.type ?? "cash";

        if (accountType === "bank") {
          const created = await createBankTransaction({
            date,
            direction,
            bank_account_id: Number(accountId),
            contra_account_id: contraAccountId
              ? Number(contraAccountId)
              : null,
            amount: amt,
            payment_method: method || "Bank",
            reference: reference || undefined,
            narration: narration || undefined,
            status: "draft",
          });
          const result =
            status === "posted"
              ? await postBankTransaction(created.id)
              : created;
          setSavedAs(
            `${result.entryNo}${result.voucherNo ? ` · ${result.voucherNo}` : ""} (${result.status})`
          );
        } else {
          const created = await createCashTransaction({
            date,
            direction,
            cash_account_id: Number(accountId),
            contra_account_id: contraAccountId
              ? Number(contraAccountId)
              : null,
            amount: amt,
            payment_method: method || "Cash",
            reference: reference || undefined,
            narration: narration || undefined,
            status: "draft",
          });
          const result =
            status === "posted"
              ? await postCashTransaction(created.id)
              : created;
          setSavedAs(
            `${result.entryNo}${result.voucherNo ? ` · ${result.voucherNo}` : ""} (${result.status})`
          );
        }
      }

      setAmount("");
      setReference("");
      setNarration("");
      if (kind !== "transfer") setContraAccountId("");
      if (kind === "transfer") setToAccountId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save movement");
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
              {titles[kind]}
            </h2>
            <Badge variant="secondary" className="capitalize">
              {kind}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{descriptions[kind]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            disabled={saving || loading || !accountId || Number(amount) <= 0}
            onClick={() => void handleSave("draft")}
          >
            <Save className="size-4" />
            Save
          </Button>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={saving || loading || !canPost}
            onClick={() => void handleSave("posted")}
          >
            <Send className="size-4" />
            Post
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Entry recorded as{" "}
          <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Movement details</CardTitle>
            <CardDescription>
              Capture cash/bank movement for this {kind}
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
                className="tabular-nums"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>
                {kind === "transfer" ? "From account" : "Account"}
              </Label>
              <Select
                value={accountId || undefined}
                onValueChange={(value) => {
                  setAccountId(value);
                  if (value === toAccountId) setToAccountId("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={loading ? "Loading…" : "Select account"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {moneyAccounts.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.code ? `${item.name} (${item.code})` : item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {kind === "transfer" ? (
              <div className="grid gap-2">
                <Label>To account</Label>
                <Select
                  value={toAccountId || undefined}
                  onValueChange={setToAccountId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {moneyAccounts
                      .filter((item) => item.id !== accountId)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.code
                            ? `${item.name} (${item.code})`
                            : item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label>Contra account</Label>
                  <Select
                    value={contraAccountId || undefined}
                    onValueChange={setContraAccountId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Required to post" />
                    </SelectTrigger>
                    <SelectContent>
                      {contraAccounts.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.code
                            ? `${item.name} (${item.code})`
                            : item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Method</Label>
                  <Select
                    value={method || undefined}
                    onValueChange={setMethod}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Online transfer">
                        Online transfer
                      </SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Slip / cheque / memo"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="narration">Narration</Label>
              <Textarea
                id="narration"
                placeholder="Describe this movement"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Account snapshot</CardTitle>
            <CardDescription>
              {cashCount} cash · {bankCount} bank accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {selected ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account</span>
                  <span className="font-medium">{selected.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Code</span>
                  <span className="font-medium tabular-nums">
                    {selected.code || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary" className="capitalize">
                    {selected.type}
                  </Badge>
                </div>
                <div className="rounded-xl bg-primary/5 px-3 py-3 text-sm text-muted-foreground">
                  Balance is available from Cash/Bank Book after posting.
                  {amount ? (
                    <span className="mt-1 block font-medium text-primary tabular-nums">
                      Movement: {formatCurrency(Number(amount) || 0)}
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select an account to preview details.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
