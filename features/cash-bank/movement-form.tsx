"use client";

import { useState } from "react";
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

import {
  allMoneyAccounts,
  bankAccounts,
  cashAccounts,
  formatCurrency,
} from "./data";

type MovementKind = "deposit" | "withdrawal" | "transfer";

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

export function CashBankMovementForm({ kind }: { kind: MovementKind }) {
  const [date, setDate] = useState("2026-03-21");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const accountOptions =
    kind === "deposit" || kind === "withdrawal"
      ? allMoneyAccounts
      : allMoneyAccounts;

  const selected = allMoneyAccounts.find((item) => item.name === account);

  function handleSave(status: "saved" | "posted") {
    const prefix =
      kind === "deposit" ? "DEP" : kind === "withdrawal" ? "WDR" : "TRF";
    setSavedAs(
      `${prefix}-2026-${String(Math.floor(Math.random() * 90) + 10).padStart(4, "0")} (${status})`
    );
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
            onClick={() => handleSave("saved")}
          >
            <Save className="size-4" />
            Save
          </Button>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={
              !amount ||
              Number(amount) <= 0 ||
              !account ||
              (kind === "transfer" && !toAccount)
            }
            onClick={() => handleSave("posted")}
          >
            <Send className="size-4" />
            Post
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Dummy entry recorded as{" "}
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
              <Select value={account || undefined} onValueChange={setAccount}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accountOptions.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {kind === "transfer" ? (
              <div className="grid gap-2">
                <Label>To account</Label>
                <Select
                  value={toAccount || undefined}
                  onValueChange={setToAccount}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMoneyAccounts
                      .filter((item) => item.name !== account)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label>Method</Label>
                <Select value={method || undefined} onValueChange={setMethod}>
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
                  </SelectContent>
                </Select>
              </div>
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
              {cashAccounts.length} cash · {bankAccounts.length} bank accounts
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
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="secondary">{selected.type}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-3 text-sm">
                  <span className="font-medium text-primary">
                    Current balance
                  </span>
                  <span className="font-semibold text-primary tabular-nums">
                    {formatCurrency(selected.currentBalance)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select an account to preview its balance.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
