import { accountsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format-currency";

export type BankTransactionDirection = "in" | "out";
export type BankTransactionStatus = "draft" | "posted";

export type BankTransaction = {
  id: string;
  entryNo: string;
  date: string;
  direction: BankTransactionDirection;
  bankAccountId: string;
  bankAccount?: string;
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
  status: BankTransactionStatus;
  voucherId?: string;
  voucherNo?: string;
};

export type CreateBankTransactionPayload = {
  date: string;
  direction: BankTransactionDirection;
  bank_account_id: number;
  contra_account_id?: number | null;
  party?: string | null;
  party_code?: string | null;
  category?: string | null;
  amount: number;
  payment_method?: string | null;
  reference?: string;
  narration?: string;
  attachment_name?: string | null;
  status?: BankTransactionStatus;
};

type ApiBankTransaction = {
  id: number | string;
  entry_no: string;
  date: string;
  direction: BankTransactionDirection;
  bank_account_id: number | string;
  bank_account?: string | null;
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
  status: BankTransactionStatus;
  voucher_id?: number | string | null;
  voucher_no?: string | null;
};

function mapEntry(row: ApiBankTransaction): BankTransaction {
  return {
    id: String(row.id),
    entryNo: row.entry_no,
    date: String(row.date).slice(0, 10),
    direction: row.direction,
    bankAccountId: String(row.bank_account_id),
    bankAccount: row.bank_account ?? undefined,
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

export async function listBankTransactions(options?: {
  status?: BankTransactionStatus;
  direction?: BankTransactionDirection;
  searchTerm?: string;
}): Promise<BankTransaction[]> {
  const rows = await accountsApi.get<ApiBankTransaction[]>(
    "/bank-transactions",
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

export async function getBankTransaction(
  id: string
): Promise<BankTransaction> {
  const row = await accountsApi.get<ApiBankTransaction>(
    `/bank-transactions/${id}`
  );
  return mapEntry(row);
}

export async function createBankTransaction(
  payload: CreateBankTransactionPayload
): Promise<BankTransaction> {
  const created = await accountsApi.post<ApiBankTransaction>(
    "/bank-transactions",
    payload
  );
  return mapEntry(created);
}

export async function postBankTransaction(
  id: string
): Promise<BankTransaction> {
  const posted = await accountsApi.post<ApiBankTransaction>(
    `/bank-transactions/${id}/post`,
    {}
  );
  return mapEntry(posted);
}

export async function deleteBankTransaction(id: string): Promise<void> {
  await accountsApi.delete(`/bank-transactions/${id}`);
}

export function formatBankCurrency(value: number) {
  return formatCurrency(value);
}
