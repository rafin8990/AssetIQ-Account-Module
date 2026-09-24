import {
  listCustomerInvoices,
} from "@/features/accounts-receivable/api/customer-invoices";
import {
  listSupplierBills,
} from "@/features/accounts-payable/api/supplier-bills";
import { getCashBankBook } from "@/features/cash-bank/api/cash-bank-books";
import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import { listExpenseEntries } from "@/features/transactions/api/expense-entries";
import { listIncomeEntries } from "@/features/transactions/api/income-entries";
import type { ReportRow } from "@/features/reports/data";

function inDateRange(date: string, fromDate: string, toDate: string) {
  const d = date.slice(0, 10);
  return d >= fromDate && d <= toDate;
}

function daysPastDue(dueDate: string) {
  const due = new Date(`${dueDate}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - due) / (1000 * 60 * 60 * 24));
}

export async function buildReceivableReportRows(): Promise<ReportRow[]> {
  const invoices = await listCustomerInvoices({ outstanding: true });
  const map = new Map<
    string,
    { customer: string; invoices: number; outstanding: number; overdue: number }
  >();

  for (const invoice of invoices) {
    if (invoice.invoiceKind === "payment" || invoice.balance <= 0) continue;
    const key =
      invoice.customerCode?.trim() ||
      invoice.customer.trim().toLowerCase() ||
      invoice.id;
    const existing = map.get(key) ?? {
      customer: invoice.customer,
      invoices: 0,
      outstanding: 0,
      overdue: 0,
    };
    existing.invoices += 1;
    existing.outstanding += invoice.balance;
    if (daysPastDue(invoice.dueDate) > 0) {
      existing.overdue += invoice.balance;
    }
    map.set(key, existing);
  }

  return Array.from(map.entries())
    .map(([id, row]) => ({
      id,
      customer: row.customer,
      invoices: row.invoices,
      outstanding: row.outstanding,
      overdue: row.overdue,
    }))
    .sort((a, b) => Number(b.outstanding) - Number(a.outstanding));
}

export async function buildPayableReportRows(): Promise<ReportRow[]> {
  const bills = await listSupplierBills({ outstanding: true });
  const map = new Map<
    string,
    { supplier: string; bills: number; outstanding: number; overdue: number }
  >();

  for (const bill of bills) {
    if (bill.balance <= 0) continue;
    const key =
      bill.vendorCode?.trim() || bill.vendor.trim().toLowerCase() || bill.id;
    const existing = map.get(key) ?? {
      supplier: bill.vendor,
      bills: 0,
      outstanding: 0,
      overdue: 0,
    };
    existing.bills += 1;
    existing.outstanding += bill.balance;
    if (daysPastDue(bill.dueDate) > 0) {
      existing.overdue += bill.balance;
    }
    map.set(key, existing);
  }

  return Array.from(map.entries())
    .map(([id, row]) => ({
      id,
      supplier: row.supplier,
      bills: row.bills,
      outstanding: row.outstanding,
      overdue: row.overdue,
    }))
    .sort((a, b) => Number(b.outstanding) - Number(a.outstanding));
}

function bucketOutstanding(balance: number, dueDate: string) {
  const days = daysPastDue(dueDate);
  if (days <= 0) return { current: balance, d30: 0, d60: 0, d90: 0 };
  if (days <= 30) return { current: 0, d30: balance, d60: 0, d90: 0 };
  if (days <= 60) return { current: 0, d30: 0, d60: balance, d90: 0 };
  return { current: 0, d30: 0, d60: 0, d90: balance };
}

export async function buildAgingReportRows(): Promise<ReportRow[]> {
  const [invoices, bills] = await Promise.all([
    listCustomerInvoices({ outstanding: true }),
    listSupplierBills({ outstanding: true }),
  ]);

  const arMap = new Map<
    string,
    {
      party: string;
      current: number;
      d30: number;
      d60: number;
      d90: number;
      total: number;
    }
  >();

  for (const invoice of invoices) {
    if (invoice.invoiceKind === "payment" || invoice.balance <= 0) continue;
    const key =
      invoice.customerCode?.trim() ||
      invoice.customer.trim().toLowerCase() ||
      invoice.id;
    const existing = arMap.get(key) ?? {
      party: invoice.customer,
      current: 0,
      d30: 0,
      d60: 0,
      d90: 0,
      total: 0,
    };
    const bucket = bucketOutstanding(invoice.balance, invoice.dueDate);
    existing.current += bucket.current;
    existing.d30 += bucket.d30;
    existing.d60 += bucket.d60;
    existing.d90 += bucket.d90;
    existing.total += invoice.balance;
    arMap.set(key, existing);
  }

  const apMap = new Map<
    string,
    {
      party: string;
      current: number;
      d30: number;
      d60: number;
      d90: number;
      total: number;
    }
  >();

  for (const bill of bills) {
    if (bill.balance <= 0) continue;
    const key =
      bill.vendorCode?.trim() || bill.vendor.trim().toLowerCase() || bill.id;
    const existing = apMap.get(key) ?? {
      party: bill.vendor,
      current: 0,
      d30: 0,
      d60: 0,
      d90: 0,
      total: 0,
    };
    const bucket = bucketOutstanding(bill.balance, bill.dueDate);
    existing.current += bucket.current;
    existing.d30 += bucket.d30;
    existing.d60 += bucket.d60;
    existing.d90 += bucket.d90;
    existing.total += bill.balance;
    apMap.set(key, existing);
  }

  const arRows: ReportRow[] = Array.from(arMap.entries()).map(([id, row]) => ({
    id: `ar-${id}`,
    party: row.party,
    type: "Receivable",
    current: row.current,
    d30: row.d30,
    d60: row.d60,
    d90: row.d90,
    total: row.total,
  }));

  const apRows: ReportRow[] = Array.from(apMap.entries()).map(([id, row]) => ({
    id: `ap-${id}`,
    party: row.party,
    type: "Payable",
    current: row.current,
    d30: row.d30,
    d60: row.d60,
    d90: row.d90,
    total: row.total,
  }));

  return [...arRows, ...apRows].sort(
    (a, b) => Number(b.total) - Number(a.total)
  );
}

export async function buildIncomeReportRows(
  fromDate: string,
  toDate: string
): Promise<ReportRow[]> {
  const entries = await listIncomeEntries({ status: "posted" });
  const map = new Map<string, number>();

  for (const entry of entries) {
    if (!inDateRange(entry.date, fromDate, toDate)) continue;
    const category = entry.incomeAccount || entry.party || "Uncategorized";
    map.set(category, (map.get(category) ?? 0) + entry.amount);
  }

  const total = Array.from(map.values()).reduce((sum, n) => sum + n, 0);
  return Array.from(map.entries())
    .map(([category, amount], index) => ({
      id: String(index + 1),
      category,
      amount,
      share: total > 0 ? `${((amount / total) * 100).toFixed(1)}%` : "0%",
    }))
    .sort((a, b) => Number(b.amount) - Number(a.amount));
}

export async function buildExpenseReportRows(
  fromDate: string,
  toDate: string
): Promise<ReportRow[]> {
  const entries = await listExpenseEntries({ status: "posted" });
  const map = new Map<string, number>();

  for (const entry of entries) {
    if (!inDateRange(entry.date, fromDate, toDate)) continue;
    const category = entry.expenseAccount || entry.party || "Uncategorized";
    map.set(category, (map.get(category) ?? 0) + entry.amount);
  }

  const total = Array.from(map.values()).reduce((sum, n) => sum + n, 0);
  return Array.from(map.entries())
    .map(([category, amount], index) => ({
      id: String(index + 1),
      category,
      amount,
      share: total > 0 ? `${((amount / total) * 100).toFixed(1)}%` : "0%",
    }))
    .sort((a, b) => Number(b.amount) - Number(a.amount));
}

export async function buildCashBankReportRows(
  fromDate: string,
  toDate: string
): Promise<ReportRow[]> {
  const [cash, bank] = await Promise.all([
    listAccounts({ type: "cash", status: "active" }),
    listAccounts({ type: "bank", status: "active" }),
  ]);
  const accounts = [...cash, ...bank];

  const rows = await Promise.all(
    accounts.map(async (account) => {
      const book = await getCashBankBook({
        accountId: account.id,
        dateFrom: fromDate,
        dateTo: toDate,
      });
      return {
        id: String(account.id),
        account: String(account.name),
        opening: book.openingBalance,
        inflows: book.totals.debit,
        outflows: book.totals.credit,
        closing: book.closingBalance,
      } satisfies ReportRow;
    })
  );

  return rows;
}
