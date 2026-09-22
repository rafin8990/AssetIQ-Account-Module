import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type AccountGroupNature =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense";

export type AccountGroupStatus = "active" | "inactive";

export type AccountGroup = {
  id: number;
  name: string;
  code: string;
  nature: AccountGroupNature;
  status: AccountGroupStatus;
  created_at?: string;
  updated_at?: string;
};

export type AccountGroupPayload = {
  name: string;
  code: string;
  nature: AccountGroupNature;
  status?: AccountGroupStatus;
};

function toRow(group: AccountGroup): CrudRow {
  return {
    id: String(group.id),
    name: group.name,
    code: group.code,
    nature: group.nature,
    status: group.status,
  };
}

function toPayload(
  data: Record<string, string | number>
): AccountGroupPayload {
  return {
    name: String(data.name ?? "").trim(),
    code: String(data.code ?? "").trim(),
    nature: String(data.nature ?? "").trim() as AccountGroupNature,
    status: (String(data.status ?? "active").trim() ||
      "active") as AccountGroupStatus,
  };
}

export async function listAccountGroups(): Promise<CrudRow[]> {
  const groups = await accountsApi.get<AccountGroup[]>("/account-groups", {
    params: { page: 1, limit: 200, sortBy: "created_at", sortOrder: "desc" },
  });
  return groups.map(toRow);
}

export async function createAccountGroup(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<AccountGroup>(
    "/account-groups",
    toPayload(data)
  );
  return toRow(created);
}

export async function updateAccountGroup(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<AccountGroup>(
    `/account-groups/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteAccountGroup(id: string): Promise<void> {
  await accountsApi.delete(`/account-groups/${id}`);
}
