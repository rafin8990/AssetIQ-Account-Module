"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Printer, Save, Send } from "lucide-react";

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
  createCustomerInvoicePayment,
  listCustomerInvoices,
  type CustomerInvoice,
} from "@/features/accounts-receivable/api/customer-invoices";
import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import { formatCurrency } from "./data";

type DepositAccount = {
  id: string;
  name: string;
  type: string;
};

export function ReceivePaymentForm() {
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [accounts, setAccounts] = useState<DepositAccount[]>([]);
  const [customer, setCustomer] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [depositTo, setDepositTo] = useState("");
  const [incomeAccountId, setIncomeAccountId] = useState("");
  const [method, setMethod] = useState("Bank transfer");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [printInvoiceNo, setPrintInvoiceNo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [openInvoices, accountRows] = await Promise.all([
        listCustomerInvoices({ outstanding: true }),
        listAccounts(),
      ]);
      setInvoices(openInvoices);
      setAccounts(
        accountRows
          .filter((row) => {
            const type = String(row.type ?? "");
            return type === "cash" || type === "bank" || type === "income";
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

  const customers = useMemo(() => {
    const names = new Set(invoices.map((invoice) => invoice.customer));
    return Array.from(names).sort();
  }, [invoices]);

  const openInvoices = useMemo(
    () =>
      invoices.filter((invoice) =>
        customer ? invoice.customer === customer : true
      ),
    [customer, invoices]
  );

  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId);

  const depositAccounts = accounts.filter(
    (account) => account.type === "cash" || account.type === "bank"
  );
  const incomeAccounts = accounts.filter(
    (account) => account.type === "income"
  );

  async function handlePost() {
    if (!selectedInvoice) return;
    const paymentAmount = Number(amount);
    if (!(paymentAmount > 0)) {
      setError("Enter a valid payment amount");
      return;
    }
    if (!depositTo) {
      setError("Select a deposit account");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    setPrintInvoiceNo(null);
    try {
      const result = await createCustomerInvoicePayment(selectedInvoice.id, {
        amount: paymentAmount,
        payment_method: method,
        paid_at: date,
        reference: reference || undefined,
        remarks: notes || undefined,
        cash_account_id: Number(depositTo),
        income_account_id: incomeAccountId
          ? Number(incomeAccountId)
          : undefined,
      });
      const paymentInv = result.paymentInvoice;
      setMessage(
        paymentInv
          ? `Payment posted. Payment invoice ${paymentInv.invoiceNo} created. Order balance ${formatCurrency(result.invoice.balance)}.`
          : `Payment posted for ${result.invoice.invoiceNo}. Balance ${formatCurrency(result.invoice.balance)}.`
      );
      setPrintInvoiceNo(paymentInv?.invoiceNo ?? null);
      setAmount("");
      setReference("");
      setNotes("");
      setInvoiceId("");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to post invoice payment"
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
            Receive Payment
          </h2>
          <p className="text-sm text-muted-foreground">
            Apply customer payments against outstanding invoices.
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
              !selectedInvoice ||
              !amount ||
              Number(amount) <= 0 ||
              !depositTo
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>{message}</span>
            {printInvoiceNo ? (
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <Link
                  href={`/accounts-receivable/customer-invoices/print?no=${encodeURIComponent(printInvoiceNo)}`}
                >
                  <Printer className="size-3.5" />
                  Print payment invoice
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Payment details</CardTitle>
            <CardDescription>
              Capture receipt against an open customer invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label>Customer</Label>
              <Select
                value={customer || undefined}
                onValueChange={(value) => {
                  setCustomer(value);
                  setInvoiceId("");
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Apply to invoice</Label>
              <Select
                value={invoiceId || undefined}
                onValueChange={(value) => {
                  setInvoiceId(value);
                  const invoice = openInvoices.find((i) => i.id === value);
                  if (invoice) setAmount(String(invoice.balance));
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select invoice" />
                </SelectTrigger>
                <SelectContent>
                  {openInvoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNo}
                      {invoice.sourceOrderCode
                        ? ` · ${invoice.sourceOrderCode}`
                        : ""}{" "}
                      — {formatCurrency(invoice.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount received</Label>
              <Input
                id="amount"
                type="number"
                className="tabular-nums"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Deposit to</Label>
              <Select
                value={depositTo || undefined}
                onValueChange={setDepositTo}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cash / bank account" />
                </SelectTrigger>
                <SelectContent>
                  {depositAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Income account</Label>
              <Select
                value={incomeAccountId || undefined}
                onValueChange={setIncomeAccountId}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Optional if already set" />
                </SelectTrigger>
                <SelectContent>
                  {incomeAccounts.map((account) => (
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
              <Label htmlFor="date">Receipt date</Label>
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
            <CardTitle className="text-base">Invoice summary</CardTitle>
            <CardDescription>Selected invoice balance snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {selectedInvoice ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Invoice</span>
                  <span className="font-medium">{selectedInvoice.invoiceNo}</span>
                </div>
                {selectedInvoice.sourceOrderCode ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order</span>
                    <span className="font-medium">
                      {selectedInvoice.sourceOrderCode}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedInvoice.customer}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Invoice amount</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(selectedInvoice.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Already paid</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(selectedInvoice.paid)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-3 text-sm">
                  <span className="font-medium text-primary">Due balance</span>
                  <span className="font-semibold text-primary tabular-nums">
                    {formatCurrency(selectedInvoice.balance)}
                  </span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {selectedInvoice.status}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Loading outstanding invoices…"
                  : "Select a customer and invoice to preview balances."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
