import { accountsApi } from "@/lib/api-client";

export type BankReconciliationStatus = "open" | "completed";
export type BankReconciliationDirection = "deposit" | "withdrawal";
export type BankReconciliationSource = "book" | "statement";
export type BankReconciliationMatchStatus = "unmatched" | "matched";

export type BankReconciliationLine = {
  id: string;
  reconciliationId: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  direction: BankReconciliationDirection;
  source: BankReconciliationSource;
  bookRefType?: string;
  bookRefId?: string;
  matchStatus: BankReconciliationMatchStatus;
  matchedLineId?: string;
};

export type BankReconciliation = {
  id: string;
  bankAccountId: string;
  bankAccount?: string;
  statementDate: string;
  statementBalance: number;
  bookBalance: number;
  status: BankReconciliationStatus;
  notes?: string;
  difference: number;
  unmatchedCount: number;
  lines: BankReconciliationLine[];
};

type ApiLine = {
  id: number | string;
  reconciliation_id: number | string;
  date: string;
  description?: string | null;
  reference?: string | null;
  amount: number | string;
  direction: BankReconciliationDirection;
  source: BankReconciliationSource;
  book_ref_type?: string | null;
  book_ref_id?: number | string | null;
  match_status: BankReconciliationMatchStatus;
  matched_line_id?: number | string | null;
};

type ApiReconciliation = {
  id: number | string;
  bank_account_id: number | string;
  bank_account?: string | null;
  statement_date: string;
  statement_balance: number | string;
  book_balance: number | string;
  status: BankReconciliationStatus;
  notes?: string | null;
  difference?: number | string;
  unmatched_count?: number | string;
  lines?: ApiLine[];
};

function mapLine(row: ApiLine): BankReconciliationLine {
  return {
    id: String(row.id),
    reconciliationId: String(row.reconciliation_id),
    date: String(row.date).slice(0, 10),
    description: row.description ?? "",
    reference: row.reference ?? "",
    amount: Number(row.amount),
    direction: row.direction,
    source: row.source,
    bookRefType: row.book_ref_type ?? undefined,
    bookRefId: row.book_ref_id ? String(row.book_ref_id) : undefined,
    matchStatus: row.match_status,
    matchedLineId: row.matched_line_id
      ? String(row.matched_line_id)
      : undefined,
  };
}

function mapReconciliation(row: ApiReconciliation): BankReconciliation {
  return {
    id: String(row.id),
    bankAccountId: String(row.bank_account_id),
    bankAccount: row.bank_account ?? undefined,
    statementDate: String(row.statement_date).slice(0, 10),
    statementBalance: Number(row.statement_balance),
    bookBalance: Number(row.book_balance),
    status: row.status,
    notes: row.notes ?? undefined,
    difference: Number(row.difference ?? 0),
    unmatchedCount: Number(row.unmatched_count ?? 0),
    lines: (row.lines ?? []).map(mapLine),
  };
}

export async function listBankReconciliations(options?: {
  bankAccountId?: string;
  status?: BankReconciliationStatus;
}): Promise<BankReconciliation[]> {
  const rows = await accountsApi.get<ApiReconciliation[]>(
    "/bank-reconciliations",
    {
      params: {
        page: 1,
        limit: 50,
        sortBy: "created_at",
        sortOrder: "desc",
        bank_account_id: options?.bankAccountId,
        status: options?.status,
      },
    }
  );
  return rows.map(mapReconciliation);
}

export async function getBankReconciliation(
  id: string
): Promise<BankReconciliation> {
  const row = await accountsApi.get<ApiReconciliation>(
    `/bank-reconciliations/${id}`
  );
  return mapReconciliation(row);
}

export async function createBankReconciliation(payload: {
  bank_account_id: number;
  statement_date: string;
  statement_balance: number;
  notes?: string | null;
}): Promise<BankReconciliation> {
  const row = await accountsApi.post<ApiReconciliation>(
    "/bank-reconciliations",
    payload
  );
  return mapReconciliation(row);
}

export async function addStatementLine(
  id: string,
  payload: {
    date: string;
    description?: string | null;
    reference?: string | null;
    amount: number;
    direction: BankReconciliationDirection;
  }
): Promise<BankReconciliation> {
  const row = await accountsApi.post<ApiReconciliation>(
    `/bank-reconciliations/${id}/statement-lines`,
    payload
  );
  return mapReconciliation(row);
}

export async function matchReconciliationLine(
  id: string,
  lineId: string,
  matchedLineId?: string | null
): Promise<BankReconciliation> {
  const row = await accountsApi.post<ApiReconciliation>(
    `/bank-reconciliations/${id}/lines/${lineId}/match`,
    matchedLineId ? { matched_line_id: Number(matchedLineId) } : {}
  );
  return mapReconciliation(row);
}

export async function completeBankReconciliation(
  id: string
): Promise<BankReconciliation> {
  const row = await accountsApi.post<ApiReconciliation>(
    `/bank-reconciliations/${id}/complete`,
    {}
  );
  return mapReconciliation(row);
}
