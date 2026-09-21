"use client";

import { useState } from "react";
import { Paperclip, Save, Send } from "lucide-react";

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
  cashBankAccounts,
  expenseCategories,
  incomeCategories,
  partyOptions,
  transactionKindLabels,
  type TransactionKind,
} from "./data";

type TransactionEntryFormProps = {
  kind: TransactionKind;
  description: string;
};

export function TransactionEntryForm({
  kind,
  description,
}: TransactionEntryFormProps) {
  const [date, setDate] = useState("2026-03-21");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [contraAccount, setContraAccount] = useState("");
  const [party, setParty] = useState("");
  const [category, setCategory] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const categories =
    kind === "income"
      ? incomeCategories
      : kind === "expense"
        ? expenseCategories
        : kind === "transfer"
          ? ["Fund Transfer"]
          : [...incomeCategories, ...expenseCategories];

  const showParty = kind === "income" || kind === "expense" || kind === "cash" || kind === "bank";
  const showContra = kind === "transfer";
  const defaultMethod =
    kind === "cash"
      ? "Cash"
      : kind === "bank" || kind === "transfer"
        ? kind === "transfer"
          ? "Transfer"
          : "Bank"
        : "";

  function handleSave(status: "saved" | "posted") {
    const prefix =
      kind === "income"
        ? "INC"
        : kind === "expense"
          ? "EXP"
          : kind === "cash"
            ? "CSH"
            : kind === "bank"
              ? "BNK"
              : "TRF";
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
              {transactionKindLabels[kind]}
            </h2>
            <Badge variant="secondary" className="capitalize">
              {kind}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
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
            disabled={!amount || Number(amount) <= 0 || !account}
            onClick={() => handleSave("posted")}
          >
            <Send className="size-4" />
            Post Transaction
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Dummy transaction recorded as{" "}
          <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Transaction details</CardTitle>
          <CardDescription>
            Capture the money movement for this {kind} entry
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
            <Select
              value={method || defaultMethod || undefined}
              onValueChange={setMethod}
            >
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
            <Label>
              {kind === "transfer" ? "From account" : "Account"}
            </Label>
            <Select value={account || undefined} onValueChange={setAccount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {cashBankAccounts.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showContra ? (
            <div className="grid gap-2">
              <Label>To account</Label>
              <Select
                value={contraAccount || undefined}
                onValueChange={setContraAccount}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {cashBankAccounts.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

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

          {showParty ? (
            <div className="grid gap-2">
              <Label>Party</Label>
              <Select value={party || undefined} onValueChange={setParty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select party (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {partyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

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
            Optionally attach an invoice, bill, or receipt (dummy upload)
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
    </div>
  );
}
