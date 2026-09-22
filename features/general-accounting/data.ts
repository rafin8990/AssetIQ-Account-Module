export type EntryStatus = "Draft" | "Posted" | "Reversed";
export type PeriodStatus = "Open" | "Soft Locked" | "Closed";

export type JournalEntry = {
  id: string;
  entryNo: string;
  date: string;
  type: "Journal" | "Adjusting" | "Closing" | "Opening";
  reference: string;
  narration: string;
  debit: number;
  credit: number;
  status: EntryStatus;
};

export type LedgerLine = {
  id: string;
  date: string;
  account: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type SubsidiaryLine = {
  id: string;
  date: string;
  ledger: "Customer" | "Vendor";
  party: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type FiscalYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "Upcoming" | "Active" | "Closed";
};

export type AccountingPeriod = {
  id: string;
  name: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
};

export const glAccounts = [
  "Cash in Hand",
  "Bank — Operating",
  "Accounts Receivable",
  "Accounts Payable",
  "Sales Revenue",
  "Office Rent",
  "Utilities Expense",
  "Retained Earnings",
  "Income Summary",
];

export const journalEntries: JournalEntry[] = [
  {
    id: "je1",
    entryNo: "JE-2026-0142",
    date: "2026-03-17",
    type: "Journal",
    reference: "ADJ-0317",
    narration: "Expense reclassification",
    debit: 1200,
    credit: 1200,
    status: "Posted",
  },
  {
    id: "je2",
    entryNo: "JE-2026-0148",
    date: "2026-03-20",
    type: "Adjusting",
    reference: "ACCR-320",
    narration: "Accrue unpaid utilities",
    debit: 640,
    credit: 640,
    status: "Posted",
  },
  {
    id: "je3",
    entryNo: "JE-2026-0150",
    date: "2026-03-21",
    type: "Journal",
    reference: "OWN-DEP",
    narration: "Owner capital contribution draft",
    debit: 5000,
    credit: 5000,
    status: "Draft",
  },
  {
    id: "je4",
    entryNo: "JE-2025-0991",
    date: "2025-12-31",
    type: "Closing",
    reference: "CLS-FY25",
    narration: "Close revenue to income summary",
    debit: 186420,
    credit: 186420,
    status: "Posted",
  },
  {
    id: "je5",
    entryNo: "JE-2026-0001",
    date: "2026-01-01",
    type: "Opening",
    reference: "OB-FY26",
    narration: "Opening balances carried forward",
    debit: 248920,
    credit: 248920,
    status: "Posted",
  },
];

export const generalLedger: LedgerLine[] = [
  {
    id: "gl1",
    date: "2026-03-01",
    account: "Bank — Operating",
    reference: "OB-FY26",
    description: "Opening balance",
    debit: 185000,
    credit: 0,
    balance: 185000,
  },
  {
    id: "gl2",
    date: "2026-03-16",
    account: "Bank — Operating",
    reference: "TRF-0007",
    description: "Cash withdrawal",
    debit: 0,
    credit: 1500,
    balance: 183500,
  },
  {
    id: "gl3",
    date: "2026-03-20",
    account: "Bank — Operating",
    reference: "INC-0018",
    description: "Customer deposit",
    debit: 8500,
    credit: 0,
    balance: 192000,
  },
  {
    id: "gl4",
    date: "2026-03-01",
    account: "Accounts Receivable",
    reference: "OB-FY26",
    description: "Opening balance",
    debit: 42000,
    credit: 0,
    balance: 42000,
  },
  {
    id: "gl5",
    date: "2026-03-01",
    account: "Accounts Receivable",
    reference: "INV-2291",
    description: "Sales invoice",
    debit: 8500,
    credit: 0,
    balance: 50500,
  },
  {
    id: "gl6",
    date: "2026-03-20",
    account: "Accounts Receivable",
    reference: "RCPT-2291",
    description: "Customer receipt",
    debit: 0,
    credit: 8500,
    balance: 42000,
  },
  {
    id: "gl7",
    date: "2026-03-19",
    account: "Utilities Expense",
    reference: "ACCR-320",
    description: "Utilities accrual",
    debit: 640,
    credit: 0,
    balance: 640,
  },
];

export const subsidiaryLedger: SubsidiaryLine[] = [
  {
    id: "sl1",
    date: "2026-03-01",
    ledger: "Customer",
    party: "Nova Retail",
    reference: "INV-2291",
    description: "Sales invoice",
    debit: 8500,
    credit: 0,
    balance: 8500,
  },
  {
    id: "sl2",
    date: "2026-03-20",
    ledger: "Customer",
    party: "Nova Retail",
    reference: "RCPT-2291",
    description: "Payment received",
    debit: 0,
    credit: 8500,
    balance: 0,
  },
  {
    id: "sl3",
    date: "2026-02-10",
    ledger: "Customer",
    party: "Bright Media Ltd.",
    reference: "INV-2288",
    description: "Media invoice",
    debit: 3800,
    credit: 0,
    balance: 3800,
  },
  {
    id: "sl4",
    date: "2026-03-01",
    ledger: "Vendor",
    party: "Horizon Supplies",
    reference: "BILL-8841",
    description: "Purchase bill",
    debit: 0,
    credit: 2450,
    balance: 2450,
  },
  {
    id: "sl5",
    date: "2026-03-05",
    ledger: "Vendor",
    party: "Apex Parts",
    reference: "PAY-2201",
    description: "Partial payment",
    debit: 1060,
    credit: 0,
    balance: 2140,
  },
];

export const fiscalYears: FiscalYear[] = [
  {
    id: "FY-24",
    name: "2024-2025",
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    status: "Closed",
  },
  {
    id: "FY-25",
    name: "2025-2026",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    status: "Active",
  },
  {
    id: "FY-26",
    name: "2026-2027",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    status: "Upcoming",
  },
];

export const accountingPeriods: AccountingPeriod[] = [
  {
    id: "P-01",
    name: "Apr 2025",
    fiscalYear: "2025-2026",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    status: "Closed",
  },
  {
    id: "P-02",
    name: "May 2025",
    fiscalYear: "2025-2026",
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    status: "Closed",
  },
  {
    id: "P-10",
    name: "Jan 2026",
    fiscalYear: "2025-2026",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    status: "Closed",
  },
  {
    id: "P-11",
    name: "Feb 2026",
    fiscalYear: "2025-2026",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    status: "Soft Locked",
  },
  {
    id: "P-12",
    name: "Mar 2026",
    fiscalYear: "2025-2026",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    status: "Open",
  },
];

export { formatCurrency } from "@/lib/format-currency";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
