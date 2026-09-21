export type ReportColumn = {
  key: string;
  label: string;
  align?: "left" | "right";
};

export type ReportRow = {
  id: string;
  emphasize?: boolean;
  muted?: boolean;
  [key: string]: string | number | boolean | undefined;
};

export type StatementSection = {
  title: string;
  rows: { label: string; amount: number; indent?: boolean }[];
  totalLabel: string;
  total: number;
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export const trialBalanceRows: ReportRow[] = [
  { id: "1", account: "1001 Cash in Hand", debit: 28450, credit: 0 },
  { id: "2", account: "1002 Bank — Operating", debit: 192380, credit: 0 },
  { id: "3", account: "1100 Accounts Receivable", debit: 48200, credit: 0 },
  { id: "4", account: "1500 Fixed Assets", debit: 842400, credit: 0 },
  {
    id: "5",
    account: "1509 Accumulated Depreciation",
    debit: 0,
    credit: 182600,
  },
  { id: "6", account: "2001 Accounts Payable", debit: 0, credit: 31680 },
  { id: "7", account: "3000 Equity / Capital", debit: 0, credit: 650000 },
  { id: "8", account: "4000 Sales Revenue", debit: 0, credit: 186420 },
  { id: "9", account: "5000 Operating Expenses", debit: 124680, credit: 0 },
  {
    id: "10",
    account: "Totals",
    debit: 1236110,
    credit: 1050700,
    emphasize: true,
  },
];

export const profitLoss: StatementSection[] = [
  {
    title: "Income",
    rows: [
      { label: "Sales Revenue", amount: 168420 },
      { label: "Service Income", amount: 18000 },
      { label: "Other Income", amount: 4200, indent: true },
    ],
    totalLabel: "Total Income",
    total: 190620,
  },
  {
    title: "Expenses",
    rows: [
      { label: "Payroll", amount: 72000 },
      { label: "Rent & Utilities", amount: 24800 },
      { label: "Marketing", amount: 12600 },
      { label: "Depreciation", amount: 8400 },
      { label: "Other Expenses", amount: 6880, indent: true },
    ],
    totalLabel: "Total Expenses",
    total: 124680,
  },
];

export const balanceSheet: StatementSection[] = [
  {
    title: "Assets",
    rows: [
      { label: "Cash & Bank", amount: 220830 },
      { label: "Accounts Receivable", amount: 48200 },
      { label: "Fixed Assets (net)", amount: 659800 },
    ],
    totalLabel: "Total Assets",
    total: 928830,
  },
  {
    title: "Liabilities",
    rows: [
      { label: "Accounts Payable", amount: 31680 },
      { label: "Accrued Expenses", amount: 8450 },
    ],
    totalLabel: "Total Liabilities",
    total: 40130,
  },
  {
    title: "Equity",
    rows: [
      { label: "Owner's Capital", amount: 650000 },
      { label: "Retained Earnings", amount: 238700 },
    ],
    totalLabel: "Total Equity",
    total: 888700,
  },
];

export const cashFlow: StatementSection[] = [
  {
    title: "Operating Activities",
    rows: [
      { label: "Net Profit", amount: 65940 },
      { label: "Depreciation add-back", amount: 8400 },
      { label: "Change in Receivables", amount: -6200 },
      { label: "Change in Payables", amount: 3100 },
    ],
    totalLabel: "Net Cash from Operations",
    total: 71240,
  },
  {
    title: "Investing Activities",
    rows: [
      { label: "Asset Purchases", amount: -25000 },
      { label: "Asset Disposal Proceeds", amount: 4500 },
    ],
    totalLabel: "Net Cash from Investing",
    total: -20500,
  },
  {
    title: "Financing Activities",
    rows: [
      { label: "Owner Contribution", amount: 10000 },
      { label: "Loan Repayment", amount: -8000 },
    ],
    totalLabel: "Net Cash from Financing",
    total: 2000,
  },
];

export const generalLedgerRows: ReportRow[] = [
  {
    id: "1",
    date: "2026-03-01",
    account: "Bank — Operating",
    reference: "OB-FY26",
    debit: 185000,
    credit: 0,
    balance: 185000,
  },
  {
    id: "2",
    date: "2026-03-16",
    account: "Bank — Operating",
    reference: "TRF-0007",
    debit: 0,
    credit: 1500,
    balance: 183500,
  },
  {
    id: "3",
    date: "2026-03-20",
    account: "Bank — Operating",
    reference: "INC-0018",
    debit: 8500,
    credit: 0,
    balance: 192000,
  },
  {
    id: "4",
    date: "2026-03-19",
    account: "Utilities Expense",
    reference: "ACCR-320",
    debit: 640,
    credit: 0,
    balance: 640,
  },
];

export const journalRows: ReportRow[] = [
  {
    id: "1",
    date: "2026-03-17",
    entryNo: "JE-0142",
    account: "Office Rent",
    debit: 1200,
    credit: 0,
  },
  {
    id: "2",
    date: "2026-03-17",
    entryNo: "JE-0142",
    account: "Utilities Expense",
    debit: 0,
    credit: 1200,
  },
  {
    id: "3",
    date: "2026-03-20",
    entryNo: "JE-0148",
    account: "Utilities Expense",
    debit: 640,
    credit: 0,
  },
  {
    id: "4",
    date: "2026-03-20",
    entryNo: "JE-0148",
    account: "Accounts Payable",
    debit: 0,
    credit: 640,
  },
];

export const incomeRows: ReportRow[] = [
  { id: "1", category: "Sales Revenue", amount: 168420, share: "88%" },
  { id: "2", category: "Service Income", amount: 18000, share: "9%" },
  { id: "3", category: "Other Income", amount: 4200, share: "3%" },
  { id: "4", category: "Total", amount: 190620, share: "100%", emphasize: true },
];

export const expenseRows: ReportRow[] = [
  { id: "1", category: "Payroll", amount: 72000, share: "58%" },
  { id: "2", category: "Rent & Utilities", amount: 24800, share: "20%" },
  { id: "3", category: "Marketing", amount: 12600, share: "10%" },
  { id: "4", category: "Depreciation", amount: 8400, share: "7%" },
  { id: "5", category: "Other", amount: 6880, share: "5%" },
  { id: "6", category: "Total", amount: 124680, share: "100%", emphasize: true },
];

export const receivableRows: ReportRow[] = [
  {
    id: "1",
    customer: "Nova Retail",
    invoices: 2,
    outstanding: 12800,
    overdue: 4300,
  },
  {
    id: "2",
    customer: "Bright Media Ltd.",
    invoices: 1,
    outstanding: 3800,
    overdue: 3800,
  },
  {
    id: "3",
    customer: "Summit Contractors",
    invoices: 2,
    outstanding: 15400,
    overdue: 9200,
  },
  {
    id: "4",
    customer: "Orion Logistics",
    invoices: 1,
    outstanding: 920,
    overdue: 0,
  },
];

export const payableRows: ReportRow[] = [
  {
    id: "1",
    supplier: "Horizon Supplies",
    bills: 1,
    outstanding: 2450,
    overdue: 0,
  },
  {
    id: "2",
    supplier: "Apex Parts",
    bills: 1,
    outstanding: 2140,
    overdue: 2140,
  },
  {
    id: "3",
    supplier: "City Utilities",
    bills: 1,
    outstanding: 640,
    overdue: 640,
  },
  {
    id: "4",
    supplier: "Metro Facilities",
    bills: 1,
    outstanding: 8200,
    overdue: 8200,
  },
];

export const agingRows: ReportRow[] = [
  {
    id: "1",
    party: "Nova Retail",
    type: "Receivable",
    current: 8500,
    d30: 4300,
    d60: 0,
    d90: 0,
    total: 12800,
  },
  {
    id: "2",
    party: "Summit Contractors",
    type: "Receivable",
    current: 6200,
    d30: 0,
    d60: 9200,
    d90: 0,
    total: 15400,
  },
  {
    id: "3",
    party: "Apex Parts",
    type: "Payable",
    current: 0,
    d30: 2140,
    d60: 0,
    d90: 0,
    total: 2140,
  },
  {
    id: "4",
    party: "Metro Facilities",
    type: "Payable",
    current: 0,
    d30: 0,
    d60: 8200,
    d90: 0,
    total: 8200,
  },
];

export const cashBankRows: ReportRow[] = [
  {
    id: "1",
    account: "Cash in Hand",
    opening: 25000,
    inflows: 5420,
    outflows: 1970,
    closing: 28450,
  },
  {
    id: "2",
    account: "Bank — Operating",
    opening: 185000,
    inflows: 19500,
    outflows: 12120,
    closing: 192380,
  },
  {
    id: "3",
    account: "Bank — Payroll",
    opening: 45100,
    inflows: 0,
    outflows: 18600,
    closing: 26500,
  },
];

export const vatTaxRows: ReportRow[] = [
  {
    id: "1",
    taxType: "Output VAT (Sales)",
    taxable: 168420,
    rate: "15%",
    tax: 25263,
  },
  {
    id: "2",
    taxType: "Input VAT (Purchases)",
    taxable: 68400,
    rate: "15%",
    tax: 10260,
  },
  {
    id: "3",
    taxType: "Net VAT Payable",
    taxable: 0,
    rate: "—",
    tax: 15003,
    emphasize: true,
  },
  {
    id: "4",
    taxType: "Withholding Tax",
    taxable: 22000,
    rate: "5%",
    tax: 1100,
  },
];

export const budgetVsActualRows: ReportRow[] = [
  {
    id: "1",
    category: "Payroll",
    budget: 180000,
    actual: 172400,
    variance: -7600,
  },
  {
    id: "2",
    category: "Travel",
    budget: 40000,
    actual: 45600,
    variance: 5600,
  },
  {
    id: "3",
    category: "Advertising",
    budget: 55000,
    actual: 61200,
    variance: 6200,
  },
  {
    id: "4",
    category: "Software",
    budget: 35000,
    actual: 32800,
    variance: -2200,
  },
  {
    id: "5",
    category: "Consulting",
    budget: 80000,
    actual: 86500,
    variance: 6500,
  },
];
