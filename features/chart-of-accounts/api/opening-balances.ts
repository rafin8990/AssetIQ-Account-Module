import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type OpeningBalance = {
  id: number | string;
  account_id: number | string;
  account?: string;
  account_code?: string;
  financial_year_id: number | string;
  financial_year?: string;
  debit: number | string;
  credit: number | string;
  created_at?: string;
  updated_at?: string;
};

export type OpeningBalancePayload = {
  account_id: number;
  financial_year_id: number;
  debit?: number;
  credit?: number;
};

function toRow(row: OpeningBalance): CrudRow {
  return {
    id: String(row.id),
    account_id: String(row.account_id),
    account: row.account ?? "",
    financial_year_id: String(row.financial_year_id),
    financial_year: row.financial_year ?? "",
    debit: Number(row.debit),
    credit: Number(row.credit),
  };
}

function toPayload(
  data: Record<string, string | number>
): OpeningBalancePayload {
  return {
    account_id: Number(data.account_id),
    financial_year_id: Number(data.financial_year_id),
    debit: Number(data.debit ?? 0),
    credit: Number(data.credit ?? 0),
  };
}

export async function listOpeningBalances(): Promise<CrudRow[]> {
  const rows = await accountsApi.get<OpeningBalance[]>("/opening-balances", {
    params: { page: 1, limit: 200, sortBy: "created_at", sortOrder: "desc" },
  });
  return rows.map(toRow);
}

export async function createOpeningBalance(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<OpeningBalance>(
    "/opening-balances",
    toPayload(data)
  );
  return toRow(created);
}

export async function updateOpeningBalance(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<OpeningBalance>(
    `/opening-balances/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteOpeningBalance(id: string): Promise<void> {
  await accountsApi.delete(`/opening-balances/${id}`);
}
