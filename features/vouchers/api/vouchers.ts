import { accountsApi } from "@/lib/api-client";
import type {
  Voucher,
  VoucherLine,
  VoucherStatus,
  VoucherType,
} from "@/features/vouchers/data";

export type ApiVoucherLine = {
  id: number | string;
  voucher_id?: number | string;
  account_id: number | string;
  account?: string;
  account_code?: string;
  narration?: string | null;
  debit: number | string;
  credit: number | string;
  line_no?: number;
};

export type ApiVoucher = {
  id: number | string;
  voucher_no: string;
  type: VoucherType;
  date: string;
  party?: string | null;
  from_account_id?: number | string | null;
  from_account?: string | null;
  to_account_id?: number | string | null;
  to_account?: string | null;
  reference?: string | null;
  narration?: string | null;
  amount: number | string;
  status: VoucherStatus;
  prepared_by: string;
  lines?: ApiVoucherLine[];
  created_at?: string;
  updated_at?: string;
};

export type CreateVoucherLinePayload = {
  account_id: number;
  narration?: string;
  debit?: number;
  credit?: number;
};

export type CreateVoucherPayload = {
  type: VoucherType;
  date: string;
  party?: string | null;
  from_account_id?: number | null;
  to_account_id?: number | null;
  reference?: string;
  narration?: string;
  status?: VoucherStatus;
  prepared_by?: string;
  lines: CreateVoucherLinePayload[];
};

export type UpdateVoucherPayload = Partial<CreateVoucherPayload>;

function mapLine(line: ApiVoucherLine): VoucherLine {
  return {
    id: String(line.id),
    account: line.account ?? "",
    accountId: String(line.account_id),
    narration: line.narration ?? "",
    debit: Number(line.debit),
    credit: Number(line.credit),
  };
}

function mapVoucher(row: ApiVoucher): Voucher {
  return {
    id: String(row.id),
    voucherNo: row.voucher_no,
    type: row.type,
    date: String(row.date).slice(0, 10),
    party: row.party ?? undefined,
    fromAccount: row.from_account ?? undefined,
    fromAccountId: row.from_account_id
      ? String(row.from_account_id)
      : undefined,
    toAccount: row.to_account ?? undefined,
    toAccountId: row.to_account_id ? String(row.to_account_id) : undefined,
    reference: row.reference ?? "",
    narration: row.narration ?? "",
    amount: Number(row.amount),
    status: row.status,
    preparedBy: row.prepared_by,
    lines: (row.lines ?? []).map(mapLine),
  };
}

export async function listVouchers(options?: {
  type?: VoucherType;
  status?: VoucherStatus;
  searchTerm?: string;
  voucherNo?: string;
}): Promise<Voucher[]> {
  const rows = await accountsApi.get<ApiVoucher[]>("/vouchers", {
    params: {
      page: 1,
      limit: 200,
      sortBy: "created_at",
      sortOrder: "desc",
      type: options?.type,
      status: options?.status,
      searchTerm: options?.searchTerm,
      voucher_no: options?.voucherNo,
    },
  });
  return rows.map(mapVoucher);
}

export async function getVoucher(id: string): Promise<Voucher> {
  const row = await accountsApi.get<ApiVoucher>(`/vouchers/${id}`);
  return mapVoucher(row);
}

export async function createVoucher(
  payload: CreateVoucherPayload
): Promise<Voucher> {
  const created = await accountsApi.post<ApiVoucher>("/vouchers", payload);
  return mapVoucher(created);
}

export async function updateVoucher(
  id: string,
  payload: UpdateVoucherPayload
): Promise<Voucher> {
  const updated = await accountsApi.patch<ApiVoucher>(
    `/vouchers/${id}`,
    payload
  );
  return mapVoucher(updated);
}

export async function updateVoucherStatus(
  id: string,
  status: VoucherStatus
): Promise<Voucher> {
  return updateVoucher(id, { status });
}

export async function deleteVoucher(id: string): Promise<void> {
  await accountsApi.delete(`/vouchers/${id}`);
}
