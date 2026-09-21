"use client";

import { useMemo, useState } from "react";
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
  formatCurrency,
  getOutstandingBills,
  payFromAccounts,
  supplierBills,
  suppliers,
} from "./data";

export function SupplierPaymentForm() {
  const [supplier, setSupplier] = useState("");
  const [billNo, setBillNo] = useState("");
  const [amount, setAmount] = useState("");
  const [payFrom, setPayFrom] = useState("");
  const [method, setMethod] = useState("");
  const [date, setDate] = useState("2026-03-21");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const openBills = useMemo(() => {
    return getOutstandingBills().filter((bill) =>
      supplier ? bill.supplier === supplier : true
    );
  }, [supplier]);

  const selectedBill = supplierBills.find((bill) => bill.billNo === billNo);

  function handleSave(status: "saved" | "posted") {
    setSavedAs(
      `PAY-2026-${String(Math.floor(Math.random() * 90) + 10).padStart(4, "0")} (${status})`
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Supplier Payments
          </h2>
          <p className="text-sm text-muted-foreground">
            Pay open supplier bills from cash or bank accounts.
          </p>
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
            disabled={!supplier || !amount || Number(amount) <= 0 || !payFrom}
            onClick={() => handleSave("posted")}
          >
            <Send className="size-4" />
            Post Payment
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Dummy supplier payment recorded as{" "}
          <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Payment details</CardTitle>
            <CardDescription>
              Apply payment against an outstanding supplier bill
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label>Supplier</Label>
              <Select
                value={supplier || undefined}
                onValueChange={(value) => {
                  setSupplier(value);
                  setBillNo("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Apply to bill</Label>
              <Select
                value={billNo || undefined}
                onValueChange={(value) => {
                  setBillNo(value);
                  const bill = openBills.find((b) => b.billNo === value);
                  if (bill) setAmount(String(bill.balance));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bill" />
                </SelectTrigger>
                <SelectContent>
                  {openBills.map((bill) => (
                    <SelectItem key={bill.id} value={bill.billNo}>
                      {bill.billNo} — {formatCurrency(bill.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Payment amount</Label>
              <Input
                id="amount"
                type="number"
                className="tabular-nums"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Pay from</Label>
              <Select value={payFrom || undefined} onValueChange={setPayFrom}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {payFromAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Payment method</Label>
              <Select value={method || undefined} onValueChange={setMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank transfer">Bank transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Payment date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Cheque / UTR / memo"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Optional payment notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Bill summary</CardTitle>
            <CardDescription>Selected bill balance snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {selectedBill ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bill</span>
                  <span className="font-medium">{selectedBill.billNo}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Supplier</span>
                  <span className="font-medium">{selectedBill.supplier}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bill amount</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(selectedBill.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Already paid</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(selectedBill.paid)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-3 text-sm">
                  <span className="font-medium text-primary">Due balance</span>
                  <span className="font-semibold text-primary tabular-nums">
                    {formatCurrency(selectedBill.balance)}
                  </span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {selectedBill.status}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a supplier and bill to preview balances.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
