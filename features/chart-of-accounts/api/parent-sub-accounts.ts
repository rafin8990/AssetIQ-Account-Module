import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type ParentSubAccountLevel = "parent" | "sub";
export type ParentSubAccountStatus = "active" | "inactive";

export type ParentSubAccount = {
  id: number | string;
  name: string;
  code: string;
  parent_id: number | string | null;
  parent?: string;
  level: ParentSubAccountLevel;
  status: ParentSubAccountStatus;
  created_at?: string;
  updated_at?: string;
};

export type ParentSubAccountPayload = {
  name: string;
  code: string;
  parent_id: number | null;
  level: ParentSubAccountLevel;
  status?: ParentSubAccountStatus;
};

function toRow(account: ParentSubAccount): CrudRow {
  return {
    id: String(account.id),
    name: account.name,
    code: account.code,
    parent_id:
      account.parent_id == null || account.parent_id === ""
        ? "none"
        : String(account.parent_id),
    parent: account.parent ?? "—",
    level: account.level,
    status: account.status,
  };
}

function toPayload(
  data: Record<string, string | number>
): ParentSubAccountPayload {
  const rawParent = String(data.parent_id ?? "none").trim();
  const parentId =
    rawParent === "" || rawParent === "none" || rawParent === "—"
      ? null
      : Number(rawParent);

  return {
    name: String(data.name ?? "").trim(),
    code: String(data.code ?? "").trim(),
    parent_id: parentId,
    level: String(data.level ?? "").trim() as ParentSubAccountLevel,
    status: (String(data.status ?? "active").trim() ||
      "active") as ParentSubAccountStatus,
  };
}

export async function listParentSubAccounts(): Promise<CrudRow[]> {
  const accounts = await accountsApi.get<ParentSubAccount[]>(
    "/parent-sub-accounts",
    {
      params: { page: 1, limit: 200, sortBy: "created_at", sortOrder: "desc" },
    }
  );
  return accounts.map(toRow);
}

export async function listParentOptions(): Promise<
  { label: string; value: string }[]
> {
  const accounts = await accountsApi.get<ParentSubAccount[]>(
    "/parent-sub-accounts",
    {
      params: {
        page: 1,
        limit: 200,
        level: "parent",
        sortBy: "name",
        sortOrder: "asc",
      },
    }
  );

  return [
    { label: "None (Root)", value: "none" },
    ...accounts.map((account) => ({
      label: account.name,
      value: String(account.id),
    })),
  ];
}

export async function createParentSubAccount(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<ParentSubAccount>(
    "/parent-sub-accounts",
    toPayload(data)
  );
  return toRow(created);
}

export async function updateParentSubAccount(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<ParentSubAccount>(
    `/parent-sub-accounts/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteParentSubAccount(id: string): Promise<void> {
  await accountsApi.delete(`/parent-sub-accounts/${id}`);
}
