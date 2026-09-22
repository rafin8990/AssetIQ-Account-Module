import { accountsApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type CurrencyStatus = "active" | "inactive";

export type Currency = {
  id: number | string;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number | string;
  is_base: boolean;
  status: CurrencyStatus;
  created_at?: string;
  updated_at?: string;
};

export type CurrencyPayload = {
  code: string;
  name: string;
  symbol: string;
  exchange_rate?: number;
  is_base?: boolean;
  status?: CurrencyStatus;
};

function toRow(currency: Currency): CrudRow {
  return {
    id: String(currency.id),
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    exchange_rate: Number(currency.exchange_rate),
    is_base: currency.is_base ? "Yes" : "No",
    status: currency.status,
  };
}

function toPayload(data: Record<string, string | number>): CurrencyPayload {
  const isBaseRaw = String(data.is_base ?? "false").trim().toLowerCase();
  const isBase =
    isBaseRaw === "true" ||
    isBaseRaw === "yes" ||
    isBaseRaw === "1";

  return {
    code: String(data.code ?? "").trim().toUpperCase(),
    name: String(data.name ?? "").trim(),
    symbol: String(data.symbol ?? "").trim(),
    exchange_rate: Number(data.exchange_rate ?? (isBase ? 1 : 1)),
    is_base: isBase,
    status: (String(data.status ?? "active").trim() ||
      "active") as CurrencyStatus,
  };
}

export async function listCurrencies(): Promise<CrudRow[]> {
  const currencies = await accountsApi.get<Currency[]>("/currencies", {
    params: { page: 1, limit: 200, sortBy: "code", sortOrder: "asc" },
  });
  return currencies.map(toRow);
}

export async function createCurrency(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await accountsApi.post<Currency>(
    "/currencies",
    toPayload(data)
  );
  return toRow(created);
}

export async function updateCurrency(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await accountsApi.patch<Currency>(
    `/currencies/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteCurrency(id: string): Promise<void> {
  await accountsApi.delete(`/currencies/${id}`);
}
