export type TransactionKind =
  | "income"
  | "expense"
  | "cash"
  | "bank"
  | "transfer";

export type TransactionRecord = {
  id: string;
  txnNo: string;
  kind: TransactionKind;
  date: string;
  account: string;
  contraAccount?: string;
  party?: string;
  category: string;
  amount: number;
  method: "Cash" | "Bank" | "Card" | "Transfer";
  reference: string;
  narration: string;
  hasAttachment: boolean;
};

export const incomeCategories = [
  "Sales Revenue",
  "Service Income",
  "Interest Income",
  "Other Income",
];

export const expenseCategories = [
  "Office Rent",
  "Utilities",
  "Payroll",
  "Travel",
  "Supplies",
  "Marketing",
];

export const cashBankAccounts = [
  "Cash in Hand",
  "Petty Cash",
  "Bank — Operating",
  "Bank — Payroll",
  "Bank — Savings",
];

export const partyOptions = [
  "Nova Retail",
  "Horizon Supplies",
  "Bright Media Ltd.",
  "City Utilities",
  "Orion Logistics",
  "Apex Parts",
];

export const transactionKindLabels: Record<TransactionKind, string> = {
  income: "Income Entry",
  expense: "Expense Entry",
  cash: "Cash Transaction",
  bank: "Bank Transaction",
  transfer: "Fund Transfer",
};

export const transactions: TransactionRecord[] = [
  {
    id: "t1",
    txnNo: "INC-2026-0018",
    kind: "income",
    date: "2026-03-20",
    account: "Bank — Operating",
    party: "Nova Retail",
    category: "Sales Revenue",
    amount: 8500,
    method: "Bank",
    reference: "INV-2291",
    narration: "Customer payment received",
    hasAttachment: true,
  },
  {
    id: "t2",
    txnNo: "EXP-2026-0031",
    kind: "expense",
    date: "2026-03-19",
    account: "Bank — Operating",
    party: "City Utilities",
    category: "Utilities",
    amount: 640,
    method: "Bank",
    reference: "UTIL-320",
    narration: "Electricity bill",
    hasAttachment: true,
  },
  {
    id: "t3",
    txnNo: "CSH-2026-0009",
    kind: "cash",
    date: "2026-03-18",
    account: "Cash in Hand",
    party: "Orion Logistics",
    category: "Service Income",
    amount: 920,
    method: "Cash",
    reference: "CASH-441",
    narration: "Cash service receipt",
    hasAttachment: false,
  },
  {
    id: "t4",
    txnNo: "BNK-2026-0022",
    kind: "bank",
    date: "2026-03-17",
    account: "Bank — Operating",
    party: "Horizon Supplies",
    category: "Supplies",
    amount: 2140,
    method: "Bank",
    reference: "CHQ-1182",
    narration: "Supplier settlement by cheque",
    hasAttachment: true,
  },
  {
    id: "t5",
    txnNo: "TRF-2026-0007",
    kind: "transfer",
    date: "2026-03-16",
    account: "Bank — Operating",
    contraAccount: "Cash in Hand",
    category: "Fund Transfer",
    amount: 1500,
    method: "Transfer",
    reference: "TRF-091",
    narration: "Cash withdrawal for petty expenses",
    hasAttachment: false,
  },
  {
    id: "t6",
    txnNo: "EXP-2026-0032",
    kind: "expense",
    date: "2026-03-15",
    account: "Bank — Payroll",
    category: "Payroll",
    amount: 18600,
    method: "Bank",
    reference: "PAY-MID",
    narration: "Mid-month payroll run",
    hasAttachment: true,
  },
  {
    id: "t7",
    txnNo: "INC-2026-0019",
    kind: "income",
    date: "2026-03-14",
    account: "Cash in Hand",
    party: "Bright Media Ltd.",
    category: "Service Income",
    amount: 1200,
    method: "Cash",
    reference: "SRV-882",
    narration: "Walk-in service payment",
    hasAttachment: false,
  },
];

export type AttachmentRecord = {
  id: string;
  fileName: string;
  docType: "Invoice" | "Bill" | "Receipt" | "Supporting";
  linkedTxnNo: string;
  uploadedOn: string;
  size: string;
  status: "Attached" | "Pending review";
};

export const attachments: AttachmentRecord[] = [
  {
    id: "a1",
    fileName: "INV-2291-nova-retail.pdf",
    docType: "Invoice",
    linkedTxnNo: "INC-2026-0018",
    uploadedOn: "2026-03-20",
    size: "248 KB",
    status: "Attached",
  },
  {
    id: "a2",
    fileName: "utility-bill-march.pdf",
    docType: "Bill",
    linkedTxnNo: "EXP-2026-0031",
    uploadedOn: "2026-03-19",
    size: "186 KB",
    status: "Attached",
  },
  {
    id: "a3",
    fileName: "cheque-scan-1182.jpg",
    docType: "Supporting",
    linkedTxnNo: "BNK-2026-0022",
    uploadedOn: "2026-03-17",
    size: "1.2 MB",
    status: "Pending review",
  },
  {
    id: "a4",
    fileName: "payroll-summary-mid.xlsx",
    docType: "Supporting",
    linkedTxnNo: "EXP-2026-0032",
    uploadedOn: "2026-03-15",
    size: "94 KB",
    status: "Attached",
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
