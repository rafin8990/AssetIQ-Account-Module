import { accountsApi } from "@/lib/api-client";

export type CashBankBookAccount = {
  id: string;
  name: string;
  code: string;
  type: "cash" | "bank";
};

export type CashBankBookEntry = {
  id: string;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  voucherNo?: string;
};

export type CashBankBook = {
  account: CashBankBookAccount;
  openingBalance: number;
  closingBalance: number;
  totals: { debit: number; credit: number };
  entries: CashBankBookEntry[];
};

type ApiCashBankBook = {
  account: {
    id: number | string;
    name: string;
    code: string;
    type: "cash" | "bank";
  };
  opening_balance: number | string;
  closing_balance: number | string;
  totals: { debit: number | string; credit: number | string };
  entries: Array<{
    id: number | string;
    date: string;
    reference: string | null;
    description: string | null;
    debit: number | string;
    credit: number | string;
    balance: number | string;
    voucher_no: string | null;
  }>;
};

function mapBook(row: ApiCashBankBook): CashBankBook {
  return {
    account: {
      id: String(row.account.id),
      name: row.account.name,
      code: row.account.code,
      type: row.account.type,
    },
    openingBalance: Number(row.opening_balance),
    closingBalance: Number(row.closing_balance),
    totals: {
      debit: Number(row.totals.debit),
      credit: Number(row.totals.credit),
    },
    entries: row.entries.map((entry) => ({
      id: String(entry.id),
      date: String(entry.date).slice(0, 10),
      reference: entry.reference ?? entry.voucher_no ?? "",
      description: entry.description ?? "",
      debit: Number(entry.debit),
      credit: Number(entry.credit),
      balance: Number(entry.balance),
      voucherNo: entry.voucher_no ?? undefined,
    })),
  };
}

export async function getCashBankBook(options: {
  accountId: string | number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<CashBankBook> {
  const row = await accountsApi.get<ApiCashBankBook>("/cash-bank-books", {
    params: {
      account_id: options.accountId,
      date_from: options.dateFrom,
      date_to: options.dateTo,
    },
  });
  return mapBook(row);
}
