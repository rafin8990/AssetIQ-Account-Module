import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type AccountTypeNormalBalance = "debit" | "credit";
export type AccountTypeCategory = "balance_sheet" | "profit_and_loss";
export type AccountTypeStatus = "active" | "inactive";

export type AccountType = {
  id: number | string;
  name: string;
  normal_balance: AccountTypeNormalBalance;
  category: AccountTypeCategory;
  status: AccountTypeStatus;
  created_at?: string;
  updated_at?: string;
};

export type AccountTypePayload = {
  name: string;
  normal_balance: AccountTypeNormalBalance;
  category: AccountTypeCategory;
  status?: AccountTypeStatus;
};

function toRow(accountType: AccountType): CrudRow {
  return {
    id: String(accountType.id),
    name: accountType.name,
    normal_balance: accountType.normal_balance,
    category: accountType.category,
    status: accountType.status,
  };
}

function toPayload(data: Record<string, string | number>): AccountTypePayload {
  return {
    name: String(data.name ?? "").trim(),
    normal_balance: String(
      data.normal_balance ?? ""
    ).trim() as AccountTypeNormalBalance,
    category: String(data.category ?? "").trim() as AccountTypeCategory,
    status: (String(data.status ?? "active").trim() ||
      "active") as AccountTypeStatus,
  };
}

export async function listAccountTypes(): Promise<CrudRow[]> {
  const types = await accountsApi.get<AccountType[]>("/account-types", {
    params: { page: 1, limit: 200, sortBy: "created_at", sortOrder: "desc" },
  });
  return types.map(toRow);
}

export async function createAccountType(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<AccountType>(
    "/account-types",
    toPayload(data)
  );
  return toRow(created);
}

export async function updateAccountType(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<AccountType>(
    `/account-types/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteAccountType(id: string): Promise<void> {
  await accountsApi.delete(`/account-types/${id}`);
}
