"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSupplierBill,
  type SupplierBill,
} from "@/features/accounts-payable/api/supplier-bills";
import { formatCurrency } from "@/lib/format-currency";
import {
  getExpenseEntry,
  type ExpenseEntryPayment,
} from "@/features/transactions/api/expense-entries";

function showDate(value?: string) {
  if (!value) return "—";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

export function SupplierBillDetailView({ id }: { id: string }) {
  const [bill, setBill] = useState<SupplierBill | null>(null);
  const [payments, setPayments] = useState<ExpenseEntryPayment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    void (async () => {
      try {
        const loaded = await getSupplierBill(id);
        if (!active) return;
        setBill(loaded);
        if (loaded.expenseEntryId) {
          const entry = await getExpenseEntry(String(loaded.expenseEntryId));
          if (!active) return;
          setPayments(entry.payments ?? []);
        } else {
          setPayments([]);
        }
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load this supplier bill."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/accounts-payable/supplier-bills">
            <ArrowLeft className="size-4" />
            Supplier bills
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading bill…</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {bill ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{bill.billNo}</CardTitle>
                  <CardDescription>
                    {bill.sourcePoCode
                      ? `Purchase order ${bill.sourcePoCode}`
                      : "Manual supplier bill"}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {statusLabel(bill.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Vendor" value={bill.vendor} />
              <Detail label="PO number" value={bill.sourcePoCode ?? "—"} />
              <Detail label="Issue date" value={showDate(bill.issueDate)} />
              <Detail label="Due date" value={showDate(bill.dueDate)} />
              <Detail label="Amount" value={formatCurrency(bill.amount)} />
              <Detail label="Paid" value={formatCurrency(bill.paid)} />
              <Detail label="Balance" value={formatCurrency(bill.balance)} />
              <Detail label="Status" value={statusLabel(bill.status)} />
              <div className="sm:col-span-2 lg:col-span-4">
                <Detail label="Narration" value={bill.narration ?? "—"} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                {bill.expenseEntryNo
                  ? `From expense entry ${bill.expenseEntryNo}`
                  : "No linked expense entry"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No payments recorded yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{showDate(payment.paidAt)}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>{payment.paymentMethod || "—"}</TableCell>
                        <TableCell>{payment.reference || "—"}</TableCell>
                        <TableCell>{payment.remarks || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
