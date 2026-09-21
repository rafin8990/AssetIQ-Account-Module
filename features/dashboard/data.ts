export const kpiMetrics = [
  {
    key: "income",
    title: "Total Income",
    value: 186420,
    change: 12.4,
    trend: "up" as const,
    hint: "This fiscal year",
  },
  {
    key: "expense",
    title: "Total Expense",
    value: 124680,
    change: 4.8,
    trend: "up" as const,
    hint: "This fiscal year",
  },
  {
    key: "profit",
    title: "Net Profit/Loss",
    value: 61740,
    change: 18.2,
    trend: "up" as const,
    hint: "Income − Expense",
  },
  {
    key: "cash",
    title: "Cash Balance",
    value: 28450,
    change: -2.1,
    trend: "down" as const,
    hint: "Petty cash & tills",
  },
  {
    key: "bank",
    title: "Bank Balance",
    value: 192380,
    change: 6.5,
    trend: "up" as const,
    hint: "All linked accounts",
  },
  {
    key: "receivable",
    title: "Accounts Receivable",
    value: 48200,
    change: 3.4,
    trend: "up" as const,
    hint: "Outstanding invoices",
  },
  {
    key: "payable",
    title: "Accounts Payable",
    value: 31680,
    change: -5.2,
    trend: "down" as const,
    hint: "Bills to settle",
  },
] as const;

export const monthlyIncomeExpense = [
  { month: "Jan", income: 14200, expense: 9800 },
  { month: "Feb", income: 15800, expense: 10200 },
  { month: "Mar", income: 17100, expense: 11400 },
  { month: "Apr", income: 14900, expense: 10800 },
  { month: "May", income: 18300, expense: 12100 },
  { month: "Jun", income: 19600, expense: 12900 },
  { month: "Jul", income: 16800, expense: 11500 },
  { month: "Aug", income: 20400, expense: 13200 },
  { month: "Sep", income: 22100, expense: 14100 },
  { month: "Oct", income: 19800, expense: 12600 },
  { month: "Nov", income: 21600, expense: 13800 },
  { month: "Dec", income: 15820, expense: 12280 },
];

export const cashFlowTrend = [
  { month: "Jan", balance: 148200 },
  { month: "Feb", balance: 153800 },
  { month: "Mar", balance: 159500 },
  { month: "Apr", balance: 163600 },
  { month: "May", balance: 169800 },
  { month: "Jun", balance: 176500 },
  { month: "Jul", balance: 181800 },
  { month: "Aug", balance: 189000 },
  { month: "Sep", balance: 197000 },
  { month: "Oct", balance: 204200 },
  { month: "Nov", balance: 212000 },
  { month: "Dec", balance: 220830 },
];

export const expenseBreakdown = [
  { category: "Operations", amount: 38400, fill: "var(--color-operations)" },
  { category: "Payroll", amount: 51200, fill: "var(--color-payroll)" },
  { category: "Vendors", amount: 22100, fill: "var(--color-vendors)" },
  { category: "Utilities", amount: 7800, fill: "var(--color-utilities)" },
  { category: "Other", amount: 5180, fill: "var(--color-other)" },
];

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  type: "income" | "expense";
};

export const recentTransactions: Transaction[] = [
  {
    id: "TX-10482",
    date: "2026-03-20",
    description: "Client payment — Nova Retail",
    category: "Sales",
    account: "Bank — Operating",
    amount: 8500,
    type: "income",
  },
  {
    id: "TX-10481",
    date: "2026-03-19",
    description: "Office rent — March",
    category: "Facilities",
    account: "Bank — Operating",
    amount: 3200,
    type: "expense",
  },
  {
    id: "TX-10480",
    date: "2026-03-18",
    description: "Invoice #INV-2291 settled",
    category: "Receivables",
    account: "Bank — Operating",
    amount: 4750,
    type: "income",
  },
  {
    id: "TX-10479",
    date: "2026-03-17",
    description: "Supplier bill — Apex Parts",
    category: "Purchases",
    account: "Bank — Operating",
    amount: 2140,
    type: "expense",
  },
  {
    id: "TX-10478",
    date: "2026-03-16",
    description: "Payroll run — March mid",
    category: "Payroll",
    account: "Bank — Payroll",
    amount: 18600,
    type: "expense",
  },
  {
    id: "TX-10477",
    date: "2026-03-15",
    description: "Service fee — Orion Logistics",
    category: "Sales",
    account: "Cash",
    amount: 920,
    type: "income",
  },
];

export type PaymentItem = {
  id: string;
  party: string;
  dueDate: string;
  amount: number;
  status: "upcoming" | "overdue";
  type: "receivable" | "payable";
};

export const upcomingPayments: PaymentItem[] = [
  {
    id: "PAY-441",
    party: "Horizon Supplies",
    dueDate: "2026-03-22",
    amount: 2450,
    status: "upcoming",
    type: "payable",
  },
  {
    id: "PAY-442",
    party: "Bright Media Ltd.",
    dueDate: "2026-03-18",
    amount: 3800,
    status: "overdue",
    type: "receivable",
  },
  {
    id: "PAY-443",
    party: "City Utilities",
    dueDate: "2026-03-25",
    amount: 640,
    status: "upcoming",
    type: "payable",
  },
  {
    id: "PAY-444",
    party: "Summit Contractors",
    dueDate: "2026-03-15",
    amount: 9200,
    status: "overdue",
    type: "receivable",
  },
  {
    id: "PAY-445",
    party: "CloudHost Inc.",
    dueDate: "2026-03-28",
    amount: 189,
    status: "upcoming",
    type: "payable",
  },
  {
    id: "PAY-446",
    party: "Northwind Traders",
    dueDate: "2026-03-12",
    amount: 5100,
    status: "overdue",
    type: "receivable",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
