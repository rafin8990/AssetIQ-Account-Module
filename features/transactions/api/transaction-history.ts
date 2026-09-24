import { accountsApi } from "@/lib/api-client";
import type { TransactionKind } from "@/features/transactions/data";

export type TransactionHistoryItem = {
  id: string;
  sourceId: number;
  txnNo: string;
  kind: TransactionKind;
  date: string;
  account?: string;
  contraAccount?: string;
  party?: string;
  category?: string;
  amount: number;
  direction?: "in" | "out";
  paymentMethod?: string;
  reference?: string;
  narration?: string;
  sourceOrderCode?: string;
  hasAttachment: boolean;
  status: string;
};

export type TransactionHistoryTotals = {
  inflow: number;
  outflow: number;
  other: number;
};

export type TransactionHistoryResult = {
  items: TransactionHistoryItem[];
  totals: TransactionHistoryTotals;
  total: number;
};

type ApiHistoryItem = {
  id: string;
  source_id: number | string;
  txn_no: string;
  kind: TransactionKind;
  date: string;
  account?: string | null;
  contra_account?: string | null;
  party?: string | null;
  category?: string | null;
  amount: number | string;
  direction?: "in" | "out" | null;
  payment_method?: string | null;
  reference?: string | null;
  narration?: string | null;
  source_order_code?: string | null;
  has_attachment?: boolean;
  status: string;
};

type ApiHistoryPayload = {
  items: ApiHistoryItem[];
  totals: {
    inflow: number | string;
    outflow: number | string;
    other: number | string;
  };
};

function mapItem(row: ApiHistoryItem): TransactionHistoryItem {
  return {
    id: row.id || `${row.kind}-${row.source_id}`,
    sourceId: Number(row.source_id),
    txnNo: row.txn_no,
    kind: row.kind,
    date: String(row.date).slice(0, 10),
    account: row.account ?? undefined,
    contraAccount: row.contra_account ?? undefined,
    party: row.party ?? undefined,
    category: row.category ?? undefined,
    amount: Number(row.amount),
    direction: row.direction ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    reference: row.reference ?? undefined,
    narration: row.narration ?? undefined,
    sourceOrderCode: row.source_order_code ?? undefined,
    hasAttachment: Boolean(row.has_attachment),
    status: row.status,
  };
}

export async function listTransactionHistory(options?: {
  kind?: TransactionKind | "all";
  searchTerm?: string;
  status?: string;
}): Promise<TransactionHistoryResult> {
  const payload = await accountsApi.get<ApiHistoryPayload>(
    "/transaction-history",
    {
      params: {
        page: 1,
        limit: 500,
        sortBy: "date",
        sortOrder: "desc",
        kind: options?.kind && options.kind !== "all" ? options.kind : undefined,
        searchTerm: options?.searchTerm || undefined,
        status: options?.status,
      },
    }
  );

  return {
    items: (payload.items ?? []).map(mapItem),
    totals: {
      inflow: Number(payload.totals?.inflow || 0),
      outflow: Number(payload.totals?.outflow || 0),
      other: Number(payload.totals?.other || 0),
    },
    total: (payload.items ?? []).length,
  };
}
