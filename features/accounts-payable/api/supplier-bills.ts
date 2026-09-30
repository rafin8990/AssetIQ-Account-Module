import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type SupplierBillStatus =
  | "draft"
  | "open"
  | "partial"
  | "paid"
  | "overdue";

export type SupplierBill = {
  id: string;
  billNo: string;
  vendor: string;
  vendorCode?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: SupplierBillStatus;
  reference?: string;
  narration?: string;
  sourcePoId?: number;
  sourcePoCode?: string;
  expenseEntryId?: number;
  expenseEntryNo?: string;
};

type ApiSupplierBill = {
  id: number | string;
  bill_no: string;
  vendor: string;
  vendor_code?: string | null;
  issue_date: string;
  due_date: string;
  amount: number | string;
  paid_amount: number | string;
  balance: number | string;
  status: SupplierBillStatus;
  reference?: string | null;
  narration?: string | null;
  source_po_id?: number | string | null;
  source_po_code?: string | null;
  expense_entry_id?: number | string | null;
  expense_entry_no?: string | null;
};

function mapBill(row: ApiSupplierBill): SupplierBill {
  return {
    id: String(row.id),
    billNo: row.bill_no,
    vendor: row.vendor,
    vendorCode: row.vendor_code ?? undefined,
    issueDate: String(row.issue_date).slice(0, 10),
    dueDate: String(row.due_date).slice(0, 10),
    amount: Number(row.amount),
    paid: Number(row.paid_amount),
    balance: Number(row.balance),
    status: row.status,
    reference: row.reference ?? undefined,
    narration: row.narration ?? undefined,
    sourcePoId: row.source_po_id ? Number(row.source_po_id) : undefined,
    sourcePoCode: row.source_po_code ?? undefined,
    expenseEntryId: row.expense_entry_id
      ? Number(row.expense_entry_id)
      : undefined,
    expenseEntryNo: row.expense_entry_no ?? undefined,
  };
}

function toRow(bill: SupplierBill): CrudRow {
  return {
    id: bill.id,
    bill_no: bill.billNo,
    source_po_code: bill.sourcePoCode ?? "",
    source: bill.sourcePoCode ? "PO" : "Manual",
    vendor: bill.vendor,
    vendor_code: bill.vendorCode ?? "",
    issue_date: bill.issueDate,
    due_date: bill.dueDate,
    amount: bill.amount,
    paid_amount: bill.paid,
    balance: bill.balance,
    status: bill.status,
  };
}

function toPayload(data: Record<string, string | number>) {
  return {
    bill_no: String(data.bill_no ?? "").trim() || undefined,
    vendor: String(data.vendor ?? "").trim(),
    vendor_code: String(data.vendor_code ?? "").trim() || null,
    issue_date: String(data.issue_date ?? "").trim(),
    due_date: String(data.due_date ?? "").trim(),
    amount: Number(data.amount || 0),
    paid_amount: Number(data.paid_amount || 0),
    status: (String(data.status ?? "open").trim() ||
      "open") as SupplierBillStatus,
  };
}

export async function listSupplierBills(options?: {
  searchTerm?: string;
  status?: SupplierBillStatus;
  outstanding?: boolean;
  dueOverdue?: boolean;
}): Promise<SupplierBill[]> {
  const rows = await accountsApi.get<ApiSupplierBill[]>("/supplier-bills", {
    params: {
      page: 1,
      limit: 500,
      sortBy: "created_at",
      sortOrder: "desc",
      searchTerm: options?.searchTerm,
      status: options?.status,
      outstanding: options?.outstanding ? "true" : undefined,
      due_overdue: options?.dueOverdue ? "true" : undefined,
    },
  });
  return rows.map(mapBill);
}

export async function listSupplierBillRows(): Promise<CrudRow[]> {
  const rows = await listSupplierBills();
  return rows.map(toRow);
}

export async function createSupplierBill(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<ApiSupplierBill>(
    "/supplier-bills",
    toPayload(data)
  );
  return toRow(mapBill(created));
}

export async function updateSupplierBill(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<ApiSupplierBill>(
    `/supplier-bills/${id}`,
    toPayload(data)
  );
  return toRow(mapBill(updated));
}

export async function getSupplierBill(id: string): Promise<SupplierBill> {
  const row = await accountsApi.get<ApiSupplierBill>(`/supplier-bills/${id}`);
  return mapBill(row);
}

export async function deleteSupplierBill(id: string): Promise<void> {
  await accountsApi.delete(`/supplier-bills/${id}`);
}

export type CreateSupplierBillPaymentPayload = {
  amount: number;
  payment_method?: string;
  paid_at?: string;
  reference?: string;
  remarks?: string;
  cash_account_id?: number;
  expense_account_id?: number;
};

export type CreateSupplierBillPaymentResult = {
  bill: SupplierBill;
  expenseEntryId: number;
};

export async function createSupplierBillPayment(
  id: string,
  payload: CreateSupplierBillPaymentPayload
): Promise<CreateSupplierBillPaymentResult> {
  const result = await accountsApi.post<{
    bill: ApiSupplierBill;
    expense_entry_id: number;
  }>(`/supplier-bills/${id}/payments`, payload);
  return {
    bill: mapBill(result.bill),
    expenseEntryId: Number(result.expense_entry_id),
  };
}
