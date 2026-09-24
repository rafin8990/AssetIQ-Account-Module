import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue";
export type InvoiceKind = "order" | "payment";

export type CustomerInvoice = {
  id: string;
  invoiceNo: string;
  customer: string;
  customerCode?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: InvoiceStatus;
  invoiceKind: InvoiceKind;
  reference?: string;
  narration?: string;
  sourceOrderId?: number;
  sourceOrderCode?: string;
  incomeEntryId?: number;
  incomeEntryNo?: string;
};

type ApiCustomerInvoice = {
  id: number | string;
  invoice_no: string;
  customer: string;
  customer_code?: string | null;
  issue_date: string;
  due_date: string;
  amount: number | string;
  paid_amount: number | string;
  balance: number | string;
  status: InvoiceStatus;
  invoice_kind?: InvoiceKind | null;
  reference?: string | null;
  narration?: string | null;
  source_order_id?: number | string | null;
  source_order_code?: string | null;
  income_entry_id?: number | string | null;
  income_entry_no?: string | null;
};

function mapInvoice(row: ApiCustomerInvoice): CustomerInvoice {
  return {
    id: String(row.id),
    invoiceNo: row.invoice_no,
    customer: row.customer,
    customerCode: row.customer_code ?? undefined,
    issueDate: String(row.issue_date).slice(0, 10),
    dueDate: String(row.due_date).slice(0, 10),
    amount: Number(row.amount),
    paid: Number(row.paid_amount),
    balance: Number(row.balance),
    status: row.status,
    invoiceKind: row.invoice_kind === "payment" ? "payment" : "order",
    reference: row.reference ?? undefined,
    narration: row.narration ?? undefined,
    sourceOrderId: row.source_order_id ? Number(row.source_order_id) : undefined,
    sourceOrderCode: row.source_order_code ?? undefined,
    incomeEntryId: row.income_entry_id
      ? Number(row.income_entry_id)
      : undefined,
    incomeEntryNo: row.income_entry_no ?? undefined,
  };
}

function toRow(invoice: CustomerInvoice): CrudRow {
  return {
    id: invoice.id,
    invoice_no: invoice.invoiceNo,
    source_order_code: invoice.sourceOrderCode ?? "",
    invoice_kind: invoice.invoiceKind === "payment" ? "Payment" : "Order",
    source: invoice.sourceOrderCode
      ? invoice.invoiceKind === "payment"
        ? "Payment"
        : "Order"
      : "Manual",
    customer: invoice.customer,
    customer_code: invoice.customerCode ?? "",
    issue_date: invoice.issueDate,
    due_date: invoice.dueDate,
    amount: invoice.amount,
    paid_amount: invoice.paid,
    balance: invoice.balance,
    status: invoice.status,
  };
}

function toPayload(data: Record<string, string | number>) {
  return {
    invoice_no: String(data.invoice_no ?? "").trim() || undefined,
    customer: String(data.customer ?? "").trim(),
    customer_code: String(data.customer_code ?? "").trim() || null,
    issue_date: String(data.issue_date ?? "").trim(),
    due_date: String(data.due_date ?? "").trim(),
    amount: Number(data.amount || 0),
    paid_amount: Number(data.paid_amount || 0),
    status: (String(data.status ?? "sent").trim() ||
      "sent") as InvoiceStatus,
  };
}

export async function listCustomerInvoices(options?: {
  searchTerm?: string;
  status?: InvoiceStatus;
  outstanding?: boolean;
  dueOverdue?: boolean;
  invoiceKind?: InvoiceKind;
}): Promise<CustomerInvoice[]> {
  const rows = await accountsApi.get<ApiCustomerInvoice[]>(
    "/customer-invoices",
    {
      params: {
        page: 1,
        limit: 500,
        sortBy: "created_at",
        sortOrder: "desc",
        searchTerm: options?.searchTerm,
        status: options?.status,
        outstanding: options?.outstanding ? "true" : undefined,
        due_overdue: options?.dueOverdue ? "true" : undefined,
        invoice_kind: options?.invoiceKind,
      },
    }
  );
  return rows.map(mapInvoice);
}

export async function getCustomerInvoiceByNo(
  invoiceNo: string
): Promise<CustomerInvoice> {
  const row = await accountsApi.get<ApiCustomerInvoice>(
    `/customer-invoices/by-no/${encodeURIComponent(invoiceNo)}`
  );
  return mapInvoice(row);
}

export async function listCustomerInvoiceRows(): Promise<CrudRow[]> {
  const rows = await listCustomerInvoices();
  return rows.map(toRow);
}

export async function createCustomerInvoice(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<ApiCustomerInvoice>(
    "/customer-invoices",
    toPayload(data)
  );
  return toRow(mapInvoice(created));
}

export async function updateCustomerInvoice(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<ApiCustomerInvoice>(
    `/customer-invoices/${id}`,
    toPayload(data)
  );
  return toRow(mapInvoice(updated));
}

export async function deleteCustomerInvoice(id: string): Promise<void> {
  await accountsApi.delete(`/customer-invoices/${id}`);
}

export type CreateInvoicePaymentPayload = {
  amount: number;
  payment_method?: string;
  paid_at?: string;
  reference?: string;
  remarks?: string;
  cash_account_id?: number;
  income_account_id?: number;
};

export type CreateInvoicePaymentResult = {
  invoice: CustomerInvoice;
  paymentInvoice: CustomerInvoice | null;
};

export async function createCustomerInvoicePayment(
  id: string,
  payload: CreateInvoicePaymentPayload
): Promise<CreateInvoicePaymentResult> {
  const result = await accountsApi.post<{
    invoice: ApiCustomerInvoice;
    payment_invoice?: ApiCustomerInvoice | null;
    income_entry_id: number;
  }>(`/customer-invoices/${id}/payments`, payload);
  return {
    invoice: mapInvoice(result.invoice),
    paymentInvoice: result.payment_invoice
      ? mapInvoice(result.payment_invoice)
      : null,
  };
}
