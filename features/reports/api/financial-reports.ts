import { accountsApi } from "@/lib/api-client";
import type { ReportRow, StatementSection } from "@/features/reports/data";

type ApiStatementSection = {
  title: string;
  rows: { label: string; amount: number; indent?: boolean }[];
  total_label: string;
  total: number;
};

function mapSections(sections: ApiStatementSection[]): StatementSection[] {
  return sections.map((section) => ({
    title: section.title,
    rows: section.rows.map((row) => ({
      label: row.label,
      amount: Number(row.amount),
      indent: row.indent,
    })),
    totalLabel: section.total_label,
    total: Number(section.total),
  }));
}

export async function fetchTrialBalance(
  fromDate: string,
  toDate: string
): Promise<ReportRow[]> {
  const rows = await accountsApi.get<
    Array<{
      account_id: number;
      account: string;
      debit: number;
      credit: number;
    }>
  >("/reports/trial-balance", {
    params: { date_from: fromDate, date_to: toDate },
  });

  return rows.map((row, index) => ({
    id: String(row.account_id || `total-${index}`),
    account: row.account,
    debit: Number(row.debit),
    credit: Number(row.credit),
    emphasize: row.account === "Totals",
  }));
}

export async function fetchProfitLoss(fromDate: string, toDate: string) {
  const data = await accountsApi.get<{
    sections: ApiStatementSection[];
    net_label: string;
    net_amount: number;
  }>("/reports/profit-loss", {
    params: { date_from: fromDate, date_to: toDate },
  });
  return {
    sections: mapSections(data.sections),
    netLabel: data.net_label,
    netAmount: Number(data.net_amount),
  };
}

export type DashboardTrends = {
  months: Array<{ month: number; income: number; expense: number }>;
  expenses: Array<{ account: string; amount: number }>;
};

export async function fetchDashboardTrends(fromDate: string, toDate: string) {
  const data = await accountsApi.get<DashboardTrends>(
    "/reports/dashboard-trends",
    {
      params: { date_from: fromDate, date_to: toDate },
    }
  );
  return {
    months: (data.months ?? []).map((row) => ({
      month: Number(row.month),
      income: Number(row.income),
      expense: Number(row.expense),
    })),
    expenses: (data.expenses ?? []).map((row) => ({
      account: row.account,
      amount: Number(row.amount),
    })),
  };
}

export async function fetchBalanceSheet(asOf: string) {
  const data = await accountsApi.get<{
    sections: ApiStatementSection[];
    footer_note: string;
  }>("/reports/balance-sheet", {
    params: { as_of: asOf, date_to: asOf },
  });
  return {
    sections: mapSections(data.sections),
    footerNote: data.footer_note,
  };
}

export async function fetchCashFlow(fromDate: string, toDate: string) {
  const data = await accountsApi.get<{
    sections: ApiStatementSection[];
    net_label: string;
    net_amount: number;
  }>("/reports/cash-flow", {
    params: { date_from: fromDate, date_to: toDate },
  });
  return {
    sections: mapSections(data.sections),
    netLabel: data.net_label,
    netAmount: Number(data.net_amount),
  };
}

export async function fetchGeneralLedger(
  fromDate: string,
  toDate: string
): Promise<ReportRow[]> {
  const rows = await accountsApi.get<
    Array<{
      id: number;
      date: string;
      account: string;
      reference: string | null;
      debit: number;
      credit: number;
      balance: number;
      voucher_no: string | null;
    }>
  >("/reports/general-ledger", {
    params: { date_from: fromDate, date_to: toDate },
  });

  return rows.map((row) => ({
    id: String(row.id),
    date: String(row.date).slice(0, 10),
    account: row.account,
    reference: row.reference || row.voucher_no || "",
    debit: Number(row.debit),
    credit: Number(row.credit),
    balance: Number(row.balance),
  }));
}

export async function fetchJournal(
  fromDate: string,
  toDate: string
): Promise<ReportRow[]> {
  const rows = await accountsApi.get<
    Array<{
      id: number;
      date: string;
      entry_no: string;
      account: string;
      debit: number;
      credit: number;
    }>
  >("/reports/journal", {
    params: { date_from: fromDate, date_to: toDate },
  });

  return rows.map((row) => ({
    id: String(row.id),
    date: String(row.date).slice(0, 10),
    entryNo: row.entry_no,
    account: row.account,
    debit: Number(row.debit),
    credit: Number(row.credit),
  }));
}
