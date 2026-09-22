import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type AccountType =
  | "cash"
  | "bank"
  | "receivable"
  | "payable"
  | "expense"
  | "income";

export type AccountStatus = "active" | "inactive";

export type Account = {
  id: number | string;
  name: string;
  code: string;
  group_id: number | string;
  group?: string;
  type: AccountType;
  status: AccountStatus;
  created_at?: string;
  updated_at?: string;
};

export type AccountPayload = {
  name: string;
  code: string;
  group_id: number;
  type: AccountType;
  status?: AccountStatus;
};

function toRow(account: Account): CrudRow {
  return {
    id: String(account.id),
    name: account.name,
    code: account.code,
    group_id: String(account.group_id),
    group: account.group ?? "",
    type: account.type,
    status: account.status,
  };
}

function toPayload(data: Record<string, string | number>): AccountPayload {
  return {
    name: String(data.name ?? "").trim(),
    code: String(data.code ?? "").trim(),
    group_id: Number(data.group_id),
    type: String(data.type ?? "").trim() as AccountType,
    status: (String(data.status ?? "active").trim() ||
      "active") as AccountStatus,
  };
}

export async function listAccounts(): Promise<CrudRow[]> {
  const accounts = await accountsApi.get<Account[]>("/accounts", {
    params: { page: 1, limit: 200, sortBy: "created_at", sortOrder: "desc" },
  });
  return accounts.map(toRow);
}

export async function createAccount(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<Account>("/accounts", toPayload(data));
  return toRow(created);
}

export async function updateAccount(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<Account>(
    `/accounts/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteAccount(id: string): Promise<void> {
  await accountsApi.delete(`/accounts/${id}`);
}
