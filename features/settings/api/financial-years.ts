import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type FinancialYearStatus = "active" | "upcoming" | "closed";

export type FinancialYear = {
  id: number | string;
  name: string;
  start_date: string;
  end_date: string;
  status: FinancialYearStatus;
  created_at?: string;
  updated_at?: string;
};

export type FinancialYearPayload = {
  name: string;
  start_date: string;
  end_date: string;
  status?: FinancialYearStatus;
};

function toRow(year: FinancialYear): CrudRow {
  return {
    id: String(year.id),
    name: year.name,
    start_date: String(year.start_date).slice(0, 10),
    end_date: String(year.end_date).slice(0, 10),
    status: year.status,
  };
}

function toPayload(
  data: Record<string, string | number>
): FinancialYearPayload {
  return {
    name: String(data.name ?? "").trim(),
    start_date: String(data.start_date ?? "").trim(),
    end_date: String(data.end_date ?? "").trim(),
    status: (String(data.status ?? "upcoming").trim() ||
      "upcoming") as FinancialYearStatus,
  };
}

export async function listFinancialYears(): Promise<CrudRow[]> {
  const years = await accountsApi.get<FinancialYear[]>("/financial-years", {
    params: { page: 1, limit: 200, sortBy: "start_date", sortOrder: "desc" },
  });
  return years.map(toRow);
}

export async function createFinancialYear(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<FinancialYear>(
    "/financial-years",
    toPayload(data)
  );
  return toRow(created);
}

export async function updateFinancialYear(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<FinancialYear>(
    `/financial-years/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteFinancialYear(id: string): Promise<void> {
  await accountsApi.delete(`/financial-years/${id}`);
}
