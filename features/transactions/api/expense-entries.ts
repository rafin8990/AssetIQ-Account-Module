import { accountsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format-currency";

export type ExpenseEntryStatus = "draft" | "posted";
export type ExpenseEntrySource = "manual" | "po";
export type ExpensePaymentStatus = "unpaid" | "partial" | "paid" | "overpaid";

export type ExpenseEntryPayment = {
  id: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  reference: string;
  remarks: string;
  recordedBy: string;
  origin: "accounts" | "procurement";
  externalPaymentId?: string;
  voucherId?: string;
  voucherNo?: string;
};

export type ExpenseEntry = {
  id: string;
  entryNo: string;
  date: string;
  party?: string;
  vendorCode?: string;
  cashAccountId?: string;
  cashAccount?: string;
  expenseAccountId?: string;
  expenseAccount?: string;
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: ExpensePaymentStatus;
  paymentMethod?: string;
  reference: string;
  narration: string;
  status: ExpenseEntryStatus;
  source: ExpenseEntrySource;
  sourcePoId?: string;
  sourcePoCode?: string;
  voucherId?: string;
  voucherNo?: string;
  payments?: ExpenseEntryPayment[];
};

export type CreateExpenseEntryPayload = {
  date: string;
  party?: string | null;
  vendor_code?: string | null;
  cash_account_id?: number | null;
  expense_account_id?: number | null;
  amount: number;
  paid_amount?: number;
  payment_method?: string | null;
  reference?: string;
  narration?: string;
  status?: ExpenseEntryStatus;
};

export type CreateExpensePaymentPayload = {
  amount: number;
  payment_method?: string;
  paid_at?: string;
  reference?: string;
  remarks?: string;
};

type ApiExpensePayment = {
  id: number | string;
  amount: number | string;
  payment_method: string;
  paid_at: string;
  reference?: string | null;
  remarks?: string | null;
  recorded_by: string;
  origin: "accounts" | "procurement";
  external_payment_id?: number | string | null;
  voucher_id?: number | string | null;
  voucher_no?: string | null;
};

type ApiExpenseEntry = {
  id: number | string;
  entry_no: string;
  date: string;
  party?: string | null;
  vendor_code?: string | null;
  cash_account_id?: number | string | null;
  cash_account?: string | null;
  expense_account_id?: number | string | null;
  expense_account?: string | null;
  amount: number | string;
  paid_amount: number | string;
  pending_amount: number | string;
  payment_status: ExpensePaymentStatus;
  payment_method?: string | null;
  reference?: string | null;
  narration?: string | null;
  status: ExpenseEntryStatus;
  source: ExpenseEntrySource;
  source_po_id?: number | string | null;
  source_po_code?: string | null;
  voucher_id?: number | string | null;
  voucher_no?: string | null;
  payments?: ApiExpensePayment[];
};

function mapPayment(row: ApiExpensePayment): ExpenseEntryPayment {
  return {
    id: String(row.id),
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    paidAt: String(row.paid_at),
    reference: row.reference ?? "",
    remarks: row.remarks ?? "",
    recordedBy: row.recorded_by,
    origin: row.origin,
    externalPaymentId: row.external_payment_id
      ? String(row.external_payment_id)
      : undefined,
    voucherId: row.voucher_id ? String(row.voucher_id) : undefined,
    voucherNo: row.voucher_no ?? undefined,
  };
}

function mapEntry(row: ApiExpenseEntry): ExpenseEntry {
  return {
    id: String(row.id),
    entryNo: row.entry_no,
    date: String(row.date).slice(0, 10),
    party: row.party ?? undefined,
    vendorCode: row.vendor_code ?? undefined,
    cashAccountId: row.cash_account_id ? String(row.cash_account_id) : undefined,
    cashAccount: row.cash_account ?? undefined,
    expenseAccountId: row.expense_account_id
      ? String(row.expense_account_id)
      : undefined,
    expenseAccount: row.expense_account ?? undefined,
    amount: Number(row.amount),
    paidAmount: Number(row.paid_amount),
    pendingAmount: Number(row.pending_amount),
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method ?? undefined,
    reference: row.reference ?? "",
    narration: row.narration ?? "",
    status: row.status,
    source: row.source,
    sourcePoId: row.source_po_id ? String(row.source_po_id) : undefined,
    sourcePoCode: row.source_po_code ?? undefined,
    voucherId: row.voucher_id ? String(row.voucher_id) : undefined,
    voucherNo: row.voucher_no ?? undefined,
    payments: (row.payments ?? []).map(mapPayment),
  };
}

export async function listExpenseEntries(options?: {
  source?: ExpenseEntrySource;
  paymentStatus?: ExpensePaymentStatus;
  status?: ExpenseEntryStatus;
  searchTerm?: string;
}): Promise<ExpenseEntry[]> {
  const rows = await accountsApi.get<ApiExpenseEntry[]>("/expense-entries", {
    params: {
      page: 1,
      limit: 200,
      sortBy: "created_at",
      sortOrder: "desc",
      source: options?.source,
      payment_status: options?.paymentStatus,
      status: options?.status,
      searchTerm: options?.searchTerm,
    },
  });
  return rows.map(mapEntry);
}

export async function getExpenseEntry(id: string): Promise<ExpenseEntry> {
  const row = await accountsApi.get<ApiExpenseEntry>(`/expense-entries/${id}`);
  return mapEntry(row);
}

export async function createExpenseEntry(
  payload: CreateExpenseEntryPayload
): Promise<ExpenseEntry> {
  const created = await accountsApi.post<ApiExpenseEntry>(
    "/expense-entries",
    payload
  );
  return mapEntry(created);
}

export async function postExpenseEntry(id: string): Promise<ExpenseEntry> {
  const posted = await accountsApi.post<ApiExpenseEntry>(
    `/expense-entries/${id}/post`,
    {}
  );
  return mapEntry(posted);
}

export async function addExpensePayment(
  id: string,
  payload: CreateExpensePaymentPayload
): Promise<ExpenseEntry> {
  const updated = await accountsApi.post<ApiExpenseEntry>(
    `/expense-entries/${id}/payments`,
    payload
  );
  return mapEntry(updated);
}

export async function deleteExpensePayment(
  entryId: string,
  paymentId: string
): Promise<ExpenseEntry> {
  const updated = await accountsApi.delete<ApiExpenseEntry>(
    `/expense-entries/${entryId}/payments/${paymentId}`
  );
  return mapEntry(updated);
}

export function formatExpenseCurrency(value: number) {
  return formatCurrency(value);
}
