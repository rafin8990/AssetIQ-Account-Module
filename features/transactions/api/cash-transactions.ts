import { accountsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format-currency";

export type CashTransactionDirection = "in" | "out";
export type CashTransactionStatus = "draft" | "posted";

export type CashTransaction = {
  id: string;
  entryNo: string;
  date: string;
  direction: CashTransactionDirection;
  cashAccountId: string;
  cashAccount?: string;
  contraAccountId?: string;
  contraAccount?: string;
  party?: string;
  partyCode?: string;
  category?: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  narration: string;
  attachmentName?: string;
  status: CashTransactionStatus;
  voucherId?: string;
  voucherNo?: string;
};

export type CreateCashTransactionPayload = {
  date: string;
  direction: CashTransactionDirection;
  cash_account_id: number;
  contra_account_id?: number | null;
  party?: string | null;
  party_code?: string | null;
  category?: string | null;
  amount: number;
  payment_method?: string | null;
  reference?: string;
  narration?: string;
  attachment_name?: string | null;
  status?: CashTransactionStatus;
};

type ApiCashTransaction = {
  id: number | string;
  entry_no: string;
  date: string;
  direction: CashTransactionDirection;
  cash_account_id: number | string;
  cash_account?: string | null;
  contra_account_id?: number | string | null;
  contra_account?: string | null;
  party?: string | null;
  party_code?: string | null;
  category?: string | null;
  amount: number | string;
  payment_method: string;
  reference?: string | null;
  narration?: string | null;
  attachment_name?: string | null;
  status: CashTransactionStatus;
  voucher_id?: number | string | null;
  voucher_no?: string | null;
};

function mapEntry(row: ApiCashTransaction): CashTransaction {
  return {
    id: String(row.id),
    entryNo: row.entry_no,
    date: String(row.date).slice(0, 10),
    direction: row.direction,
    cashAccountId: String(row.cash_account_id),
    cashAccount: row.cash_account ?? undefined,
    contraAccountId: row.contra_account_id
      ? String(row.contra_account_id)
      : undefined,
    contraAccount: row.contra_account ?? undefined,
    party: row.party ?? undefined,
    partyCode: row.party_code ?? undefined,
    category: row.category ?? undefined,
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    reference: row.reference ?? "",
    narration: row.narration ?? "",
    attachmentName: row.attachment_name ?? undefined,
    status: row.status,
    voucherId: row.voucher_id ? String(row.voucher_id) : undefined,
    voucherNo: row.voucher_no ?? undefined,
  };
}

export async function listCashTransactions(options?: {
  status?: CashTransactionStatus;
  direction?: CashTransactionDirection;
  searchTerm?: string;
}): Promise<CashTransaction[]> {
  const rows = await accountsApi.get<ApiCashTransaction[]>(
    "/cash-transactions",
    {
      params: {
        page: 1,
        limit: 200,
        sortBy: "created_at",
        sortOrder: "desc",
        status: options?.status,
        direction: options?.direction,
        searchTerm: options?.searchTerm,
      },
    }
  );
  return rows.map(mapEntry);
}

export async function getCashTransaction(
  id: string
): Promise<CashTransaction> {
  const row = await accountsApi.get<ApiCashTransaction>(
    `/cash-transactions/${id}`
  );
  return mapEntry(row);
}

export async function createCashTransaction(
  payload: CreateCashTransactionPayload
): Promise<CashTransaction> {
  const created = await accountsApi.post<ApiCashTransaction>(
    "/cash-transactions",
    payload
  );
  return mapEntry(created);
}

export async function postCashTransaction(
  id: string
): Promise<CashTransaction> {
  const posted = await accountsApi.post<ApiCashTransaction>(
    `/cash-transactions/${id}/post`,
    {}
  );
  return mapEntry(posted);
}

export async function deleteCashTransaction(id: string): Promise<void> {
  await accountsApi.delete(`/cash-transactions/${id}`);
}

export function formatCashCurrency(value: number) {
  return formatCurrency(value);
}
