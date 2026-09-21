export type MoneyAccount = {
  id: string;
  name: string;
  code: string;
  type: "Cash" | "Bank";
  currency: string;
  openingBalance: number;
  currentBalance: number;
  status: "Active" | "Inactive";
  bankName?: string;
  accountNo?: string;
};

export type BookEntry = {
  id: string;
  date: string;
  account: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type ReconciliationLine = {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  type: "deposit" | "withdrawal";
  bookStatus: "Cleared" | "Uncleared";
  bankStatus: "Matched" | "Missing in bank" | "Missing in book";
};

export const cashAccounts: MoneyAccount[] = [
  {
    id: "CASH-001",
    name: "Cash in Hand",
    code: "1001",
    type: "Cash",
    currency: "USD",
    openingBalance: 5000,
    currentBalance: 28450,
    status: "Active",
  },
  {
    id: "CASH-002",
    name: "Petty Cash",
    code: "1001-01",
    type: "Cash",
    currency: "USD",
    openingBalance: 1000,
    currentBalance: 680,
    status: "Active",
  },
  {
    id: "CASH-003",
    name: "Till — Front Desk",
    code: "1001-02",
    type: "Cash",
    currency: "USD",
    openingBalance: 500,
    currentBalance: 420,
    status: "Inactive",
  },
];

export const bankAccounts: MoneyAccount[] = [
  {
    id: "BNK-001",
    name: "Bank — Operating",
    code: "1002",
    type: "Bank",
    currency: "USD",
    openingBalance: 120000,
    currentBalance: 192380,
    status: "Active",
    bankName: "First National Bank",
    accountNo: "****4821",
  },
  {
    id: "BNK-002",
    name: "Bank — Payroll",
    code: "1003",
    type: "Bank",
    currency: "USD",
    openingBalance: 40000,
    currentBalance: 26500,
    status: "Active",
    bankName: "First National Bank",
    accountNo: "****7730",
  },
  {
    id: "BNK-003",
    name: "Bank — Savings",
    code: "1004",
    type: "Bank",
    currency: "USD",
    openingBalance: 50000,
    currentBalance: 61200,
    status: "Active",
    bankName: "Coastal Savings",
    accountNo: "****1194",
  },
];

export const allMoneyAccounts = [...cashAccounts, ...bankAccounts];

export const cashBookEntries: BookEntry[] = [
  {
    id: "cb1",
    date: "2026-03-14",
    account: "Cash in Hand",
    reference: "CSH-2026-0009",
    description: "Cash service receipt",
    debit: 920,
    credit: 0,
    balance: 27850,
  },
  {
    id: "cb2",
    date: "2026-03-16",
    account: "Cash in Hand",
    reference: "TRF-2026-0007",
    description: "Bank withdrawal deposited to cash",
    debit: 1500,
    credit: 0,
    balance: 29350,
  },
  {
    id: "cb3",
    date: "2026-03-18",
    account: "Petty Cash",
    reference: "EXP-PC-112",
    description: "Office supplies from petty cash",
    debit: 0,
    credit: 120,
    balance: 680,
  },
  {
    id: "cb4",
    date: "2026-03-19",
    account: "Cash in Hand",
    reference: "CSH-OUT-044",
    description: "Courier payment",
    debit: 0,
    credit: 900,
    balance: 28450,
  },
];

export const bankBookEntries: BookEntry[] = [
  {
    id: "bb1",
    date: "2026-03-15",
    account: "Bank — Payroll",
    reference: "EXP-2026-0032",
    description: "Mid-month payroll",
    debit: 0,
    credit: 18600,
    balance: 26500,
  },
  {
    id: "bb2",
    date: "2026-03-16",
    account: "Bank — Operating",
    reference: "TRF-2026-0007",
    description: "Cash withdrawal",
    debit: 0,
    credit: 1500,
    balance: 185020,
  },
  {
    id: "bb3",
    date: "2026-03-17",
    account: "Bank — Operating",
    reference: "BNK-2026-0022",
    description: "Supplier cheque payment",
    debit: 0,
    credit: 2140,
    balance: 182880,
  },
  {
    id: "bb4",
    date: "2026-03-20",
    account: "Bank — Operating",
    reference: "INC-2026-0018",
    description: "Customer deposit",
    debit: 8500,
    credit: 0,
    balance: 191380,
  },
  {
    id: "bb5",
    date: "2026-03-21",
    account: "Bank — Operating",
    reference: "DEP-2026-0011",
    description: "Owner capital deposit",
    debit: 1000,
    credit: 0,
    balance: 192380,
  },
];

export const reconciliationLines: ReconciliationLine[] = [
  {
    id: "rc1",
    date: "2026-03-20",
    description: "Customer deposit — Nova Retail",
    reference: "INC-2026-0018",
    amount: 8500,
    type: "deposit",
    bookStatus: "Cleared",
    bankStatus: "Matched",
  },
  {
    id: "rc2",
    date: "2026-03-17",
    description: "Supplier cheque — Apex Parts",
    reference: "BNK-2026-0022",
    amount: 2140,
    type: "withdrawal",
    bookStatus: "Cleared",
    bankStatus: "Matched",
  },
  {
    id: "rc3",
    date: "2026-03-19",
    description: "Utility online payment",
    reference: "EXP-2026-0031",
    amount: 640,
    type: "withdrawal",
    bookStatus: "Uncleared",
    bankStatus: "Missing in bank",
  },
  {
    id: "rc4",
    date: "2026-03-21",
    description: "Bank charges",
    reference: "STMT-CHG-09",
    amount: 25,
    type: "withdrawal",
    bookStatus: "Uncleared",
    bankStatus: "Missing in book",
  },
  {
    id: "rc5",
    date: "2026-03-18",
    description: "Interest credit",
    reference: "STMT-INT-03",
    amount: 48,
    type: "deposit",
    bookStatus: "Uncleared",
    bankStatus: "Missing in book",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
