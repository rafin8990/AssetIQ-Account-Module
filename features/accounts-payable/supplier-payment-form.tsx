"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  createSupplierBillPayment,
  listSupplierBills,
  type SupplierBill,
} from "@/features/accounts-payable/api/supplier-bills";
import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import { listVendors } from "@/features/accounts-payable/api/vendors";
import { formatCurrency } from "./data";

type PayAccount = {
  id: string;
  name: string;
  type: string;
};

type VendorOption = {
  value: string;
  label: string;
  code: string;
};

export function SupplierPaymentForm() {
  const [bills, setBills] = useState<SupplierBill[]>([]);
  const [vendorOptions, setVendorOptions] = useState<VendorOption[]>([]);
  const [accounts, setAccounts] = useState<PayAccount[]>([]);
  const [vendor, setVendor] = useState("");
  const [billId, setBillId] = useState("");
  const [amount, setAmount] = useState("");
  const [payFrom, setPayFrom] = useState("");
  const [expenseAccountId, setExpenseAccountId] = useState("");
  const [method, setMethod] = useState("Bank transfer");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [openBills, accountRows, vendorRows] = await Promise.all([
        listSupplierBills({ outstanding: true }),
        listAccounts(),
        listVendors().catch(() => []),
      ]);
      setBills(openBills);
      setVendorOptions(
        vendorRows
          .map((row) => {
            const name = String(row.vendor_name ?? "").trim();
            const code = String(row.vendor_code ?? "").trim();
            return {
              value: name || code,
              label: code ? `${name} (${code})` : name,
              code,
            };
          })
          .filter((option) => option.value)
      );
      setAccounts(
        accountRows
          .filter((row) => {
            const type = String(row.type ?? "");
            return type === "cash" || type === "bank" || type === "expense";
          })
          .map((row) => ({
            id: String(row.id),
            name: String(row.name ?? ""),
            type: String(row.type ?? ""),
          }))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const vendorChoices = useMemo(() => {
    if (vendorOptions.length) return vendorOptions;
    const names = Array.from(
      new Set(bills.map((bill) => bill.vendor).filter(Boolean))
    ).sort();
    return names.map((name) => ({ value: name, label: name, code: "" }));
  }, [bills, vendorOptions]);

  const selectedVendor = vendorChoices.find((option) => option.value === vendor);

  const openBills = useMemo(() => {
    if (!selectedVendor) return [];
    const selectedName = selectedVendor.value.trim().toLowerCase();
    return bills.filter((bill) => {
      if (bill.balance <= 0) return false;
      if (
        selectedVendor.code &&
        bill.vendorCode &&
        bill.vendorCode === selectedVendor.code
      ) {
        return true;
      }
      return bill.vendor.trim().toLowerCase() === selectedName;
    });
  }, [bills, selectedVendor]);

  const selectedBill = bills.find((bill) => bill.id === billId);

  const payFromAccounts = accounts.filter(
    (account) => account.type === "cash" || account.type === "bank"
  );
  const expenseAccounts = accounts.filter(
    (account) => account.type === "expense"
  );

  async function handlePost() {
    if (!selectedBill) return;
    const paymentAmount = Number(amount);
    if (!(paymentAmount > 0)) {
      setError("Enter a valid payment amount");
      return;
    }
    if (paymentAmount > selectedBill.balance + 0.0001) {
      setError(
        `Amount cannot be more than the due balance (${formatCurrency(selectedBill.balance)}).`
      );
      return;
    }
    if (!payFrom) {
      setError("Select a pay-from account");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const result = await createSupplierBillPayment(selectedBill.id, {
        amount: paymentAmount,
        payment_method: method,
        paid_at: date,
        reference: reference || undefined,
        remarks: notes || undefined,
        cash_account_id: Number(payFrom),
        expense_account_id: expenseAccountId
          ? Number(expenseAccountId)
          : undefined,
      });
      const stillDue = Number(result.bill.balance);
      setReference("");
      setNotes("");
      await loadData();
      if (stillDue > 0) {
        setBillId(result.bill.id);
        setAmount(String(stillDue));
        setMessage(
          `Paid ${formatCurrency(paymentAmount)}. ${formatCurrency(stillDue)} is still due on ${result.bill.sourcePoCode || result.bill.billNo}. The payment is also saved on the purchase order.`
        );
      } else {
        setBillId("");
        setAmount("");
        setMessage(
          `Paid ${formatCurrency(paymentAmount)}. ${result.bill.sourcePoCode || result.bill.billNo} is fully paid.`
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to post bill payment"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Supplier Payments
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a vendor to pay their unpaid purchase orders. You can pay
            part of an order more than once. Each payment is saved on that
            purchase order too.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            disabled={saving || loading}
            onClick={() => void loadData()}
          >
            <Save className="size-4" />
            Refresh
          </Button>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={
              saving ||
              loading ||
              !selectedBill ||
              !amount ||
              Number(amount) <= 0 ||
              !payFrom
            }
            onClick={() => void handlePost()}
          >
            <Send className="size-4" />
            {saving ? "Posting…" : "Post Payment"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Payment details</CardTitle>
            <CardDescription>
              Capture payment against an open supplier bill
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label>Vendor</Label>
              <Select
                value={vendor || undefined}
                onValueChange={(value) => {
                  setVendor(value);
                  setBillId("");
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorChoices.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Unpaid purchase order</Label>
              <Select
                value={billId || undefined}
                onValueChange={(value) => {
                  setBillId(value);
                  const bill = openBills.find((row) => row.id === value);
                  if (bill) setAmount(String(bill.balance));
                }}
                disabled={loading || !vendor}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      vendor
                        ? openBills.length
                          ? "Select unpaid purchase order"
                          : "No unpaid purchase orders"
                        : "Select a vendor first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {openBills.map((bill) => (
                    <SelectItem key={bill.id} value={bill.id}>
                      {bill.sourcePoCode || bill.billNo} — due{" "}
                      {formatCurrency(bill.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount paid</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                className="tabular-nums"
                placeholder={
                  selectedBill
                    ? `Up to ${formatCurrency(selectedBill.balance)}`
                    : "Enter amount"
                }
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!selectedBill || saving}
              />
              {selectedBill ? (
                <p className="text-xs text-muted-foreground">
                  Due {formatCurrency(selectedBill.balance)}. Change this
                  amount to pay part of the order now.
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label>Pay from</Label>
              <Select
                value={payFrom || undefined}
                onValueChange={setPayFrom}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cash / bank account" />
                </SelectTrigger>
                <SelectContent>
                  {payFromAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
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
                  <SelectValue placeholder="Optional if already set" />
                </SelectTrigger>
                <SelectContent>
                  {expenseAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
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
                {selectedBill.sourcePoCode ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">PO</span>
                    <span className="font-medium">
                      {selectedBill.sourcePoCode}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vendor</span>
                  <span className="font-medium">{selectedBill.vendor}</span>
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
                {loading
                  ? "Loading outstanding bills…"
                  : "Select a vendor and bill to preview balances."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
