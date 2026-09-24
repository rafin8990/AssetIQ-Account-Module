import { accountsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format-currency";

export type IncomeEntryStatus = "draft" | "posted";
export type IncomeEntrySource = "manual" | "order";
export type IncomePaymentStatus = "unpaid" | "partial" | "paid" | "overpaid";

export type IncomeEntryPayment = {
  id: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  reference: string;
  remarks: string;
  recordedBy: string;
  origin: "accounts" | "asset";
  externalPaymentId?: string;
  voucherId?: string;
  voucherNo?: string;
};

export type IncomeEntry = {
  id: string;
  entryNo: string;
  date: string;
  party?: string;
  customerCode?: string;
  cashAccountId?: string;
  cashAccount?: string;
  incomeAccountId?: string;
  incomeAccount?: string;
  amount: number;
  receivedAmount: number;
  pendingAmount: number;
  paymentStatus: IncomePaymentStatus;
  paymentMethod?: string;
  reference: string;
  narration: string;
  status: IncomeEntryStatus;
  source: IncomeEntrySource;
  sourceOrderId?: string;
  sourceOrderCode?: string;
  voucherId?: string;
  voucherNo?: string;
  payments?: IncomeEntryPayment[];
};

export type CreateIncomeEntryPayload = {
  date: string;
  party?: string | null;
  customer_code?: string | null;
  cash_account_id?: number | null;
  income_account_id?: number | null;
  amount: number;
  received_amount?: number;
  payment_method?: string | null;
  reference?: string;
  narration?: string;
  status?: IncomeEntryStatus;
};

export type CreateIncomePaymentPayload = {
  amount: number;
  payment_method?: string;
  paid_at?: string;
  reference?: string;
  remarks?: string;
};

type ApiIncomePayment = {
  id: number | string;
  amount: number | string;
  payment_method: string;
  paid_at: string;
  reference?: string | null;
  remarks?: string | null;
  recorded_by: string;
  origin: "accounts" | "asset";
  external_payment_id?: number | string | null;
  voucher_id?: number | string | null;
  voucher_no?: string | null;
};

type ApiIncomeEntry = {
  id: number | string;
  entry_no: string;
  date: string;
  party?: string | null;
  customer_code?: string | null;
  cash_account_id?: number | string | null;
  cash_account?: string | null;
  income_account_id?: number | string | null;
  income_account?: string | null;
  amount: number | string;
  received_amount: number | string;
  pending_amount: number | string;
  payment_status: IncomePaymentStatus;
  payment_method?: string | null;
  reference?: string | null;
  narration?: string | null;
  status: IncomeEntryStatus;
  source: IncomeEntrySource;
  source_order_id?: number | string | null;
  source_order_code?: string | null;
  voucher_id?: number | string | null;
  voucher_no?: string | null;
  payments?: ApiIncomePayment[];
};

function mapPayment(row: ApiIncomePayment): IncomeEntryPayment {
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

function mapEntry(row: ApiIncomeEntry): IncomeEntry {
  return {
    id: String(row.id),
    entryNo: row.entry_no,
    date: String(row.date).slice(0, 10),
    party: row.party ?? undefined,
    customerCode: row.customer_code ?? undefined,
    cashAccountId: row.cash_account_id ? String(row.cash_account_id) : undefined,
    cashAccount: row.cash_account ?? undefined,
    incomeAccountId: row.income_account_id
      ? String(row.income_account_id)
      : undefined,
    incomeAccount: row.income_account ?? undefined,
    amount: Number(row.amount),
    receivedAmount: Number(row.received_amount),
    pendingAmount: Number(row.pending_amount),
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method ?? undefined,
    reference: row.reference ?? "",
    narration: row.narration ?? "",
    status: row.status,
    source: row.source,
    sourceOrderId: row.source_order_id ? String(row.source_order_id) : undefined,
    sourceOrderCode: row.source_order_code ?? undefined,
    voucherId: row.voucher_id ? String(row.voucher_id) : undefined,
    voucherNo: row.voucher_no ?? undefined,
    payments: (row.payments ?? []).map(mapPayment),
  };
}

export async function listIncomeEntries(options?: {
  source?: IncomeEntrySource;
  paymentStatus?: IncomePaymentStatus;
  status?: IncomeEntryStatus;
  searchTerm?: string;
}): Promise<IncomeEntry[]> {
  const rows = await accountsApi.get<ApiIncomeEntry[]>("/income-entries", {
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

export async function getIncomeEntry(id: string): Promise<IncomeEntry> {
  const row = await accountsApi.get<ApiIncomeEntry>(`/income-entries/${id}`);
  return mapEntry(row);
}

export async function createIncomeEntry(
  payload: CreateIncomeEntryPayload
): Promise<IncomeEntry> {
  const created = await accountsApi.post<ApiIncomeEntry>(
    "/income-entries",
    payload
  );
  return mapEntry(created);
}

export async function postIncomeEntry(id: string): Promise<IncomeEntry> {
  const posted = await accountsApi.post<ApiIncomeEntry>(
    `/income-entries/${id}/post`,
    {}
  );
  return mapEntry(posted);
}

export async function addIncomePayment(
  id: string,
  payload: CreateIncomePaymentPayload
): Promise<IncomeEntry> {
  const updated = await accountsApi.post<ApiIncomeEntry>(
    `/income-entries/${id}/payments`,
    payload
  );
  return mapEntry(updated);
}

export async function deleteIncomePayment(
  entryId: string,
  paymentId: string
): Promise<IncomeEntry> {
  const updated = await accountsApi.delete<ApiIncomeEntry>(
    `/income-entries/${entryId}/payments/${paymentId}`
  );
  return mapEntry(updated);
}

export function formatIncomeCurrency(value: number) {
  return formatCurrency(value);
}
