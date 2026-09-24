import { accountsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format-currency";

export type FundTransferStatus = "draft" | "posted";

export type FundTransfer = {
  id: string;
  entryNo: string;
  date: string;
  fromAccountId: string;
  fromAccount?: string;
  toAccountId: string;
  toAccount?: string;
  category: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  narration: string;
  attachmentName?: string;
  status: FundTransferStatus;
  voucherId?: string;
  voucherNo?: string;
};

export type CreateFundTransferPayload = {
  date: string;
  from_account_id: number;
  to_account_id: number;
  category?: string | null;
  amount: number;
  payment_method?: string | null;
  reference?: string;
  narration?: string;
  attachment_name?: string | null;
  status?: FundTransferStatus;
};

type ApiFundTransfer = {
  id: number | string;
  entry_no: string;
  date: string;
  from_account_id: number | string;
  from_account?: string | null;
  to_account_id: number | string;
  to_account?: string | null;
  category: string;
  amount: number | string;
  payment_method: string;
  reference?: string | null;
  narration?: string | null;
  attachment_name?: string | null;
  status: FundTransferStatus;
  voucher_id?: number | string | null;
  voucher_no?: string | null;
};

function mapEntry(row: ApiFundTransfer): FundTransfer {
  return {
    id: String(row.id),
    entryNo: row.entry_no,
    date: String(row.date).slice(0, 10),
    fromAccountId: String(row.from_account_id),
    fromAccount: row.from_account ?? undefined,
    toAccountId: String(row.to_account_id),
    toAccount: row.to_account ?? undefined,
    category: row.category,
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

export async function listFundTransfers(options?: {
  status?: FundTransferStatus;
  searchTerm?: string;
}): Promise<FundTransfer[]> {
  const rows = await accountsApi.get<ApiFundTransfer[]>("/fund-transfers", {
    params: {
      page: 1,
      limit: 200,
      sortBy: "created_at",
      sortOrder: "desc",
      status: options?.status,
      searchTerm: options?.searchTerm,
    },
  });
  return rows.map(mapEntry);
}

export async function getFundTransfer(id: string): Promise<FundTransfer> {
  const row = await accountsApi.get<ApiFundTransfer>(`/fund-transfers/${id}`);
  return mapEntry(row);
}

export async function createFundTransfer(
  payload: CreateFundTransferPayload
): Promise<FundTransfer> {
  const created = await accountsApi.post<ApiFundTransfer>(
    "/fund-transfers",
    payload
  );
  return mapEntry(created);
}

export async function postFundTransfer(id: string): Promise<FundTransfer> {
  const posted = await accountsApi.post<ApiFundTransfer>(
    `/fund-transfers/${id}/post`,
    {}
  );
  return mapEntry(posted);
}

export async function deleteFundTransfer(id: string): Promise<void> {
  await accountsApi.delete(`/fund-transfers/${id}`);
}

export function formatFundCurrency(value: number) {
  return formatCurrency(value);
}
