export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export const analyticsKpis = [
  {
    key: "revenue",
    title: "Revenue (YTD)",
    value: 186420,
    change: 12.4,
    trend: "up" as const,
    hint: "vs last year",
  },
  {
    key: "expense",
    title: "Operating Expense",
    value: 124680,
    change: 4.8,
    trend: "up" as const,
    hint: "vs last year",
  },
  {
    key: "margin",
    title: "Gross Margin",
    value: 33.1,
    change: 2.6,
    trend: "up" as const,
    hint: "percentage points",
    isPercent: true,
  },
  {
    key: "burn",
    title: "Monthly Burn",
    value: 10400,
    change: -8.2,
    trend: "down" as const,
    hint: "avg last 3 months",
  },
  {
    key: "dso",
    title: "DSO (Days)",
    value: 38,
    change: -3.1,
    trend: "down" as const,
    hint: "collection cycle",
    isDays: true,
  },
  {
    key: "dpo",
    title: "DPO (Days)",
    value: 42,
    change: 1.4,
    trend: "up" as const,
    hint: "payment cycle",
    isDays: true,
  },
  {
    key: "liquidity",
    title: "Quick Ratio",
    value: 1.84,
    change: 0.12,
    trend: "up" as const,
    hint: "liquid assets / CL",
    isRatio: true,
  },
  {
    key: "runway",
    title: "Cash Runway",
    value: 21,
    change: 2.0,
    trend: "up" as const,
    hint: "months remaining",
    isMonths: true,
  },
] as const;

export const revenueExpenseTrend = [
  { month: "Jan", revenue: 14200, expense: 9800, profit: 4400 },
  { month: "Feb", revenue: 15800, expense: 10200, profit: 5600 },
  { month: "Mar", revenue: 17100, expense: 11400, profit: 5700 },
  { month: "Apr", revenue: 14900, expense: 10800, profit: 4100 },
  { month: "May", revenue: 18300, expense: 12100, profit: 6200 },
  { month: "Jun", revenue: 19600, expense: 12900, profit: 6700 },
  { month: "Jul", revenue: 16800, expense: 11500, profit: 5300 },
  { month: "Aug", revenue: 20400, expense: 13200, profit: 7200 },
  { month: "Sep", revenue: 22100, expense: 14100, profit: 8000 },
  { month: "Oct", revenue: 19800, expense: 12600, profit: 7200 },
  { month: "Nov", revenue: 21600, expense: 13800, profit: 7800 },
  { month: "Dec", revenue: 15820, expense: 12280, profit: 3540 },
];

export const marginTrend = [
  { month: "Jan", margin: 31.0 },
  { month: "Feb", margin: 35.4 },
  { month: "Mar", margin: 33.3 },
  { month: "Apr", margin: 27.5 },
  { month: "May", margin: 33.9 },
  { month: "Jun", margin: 34.2 },
  { month: "Jul", margin: 31.5 },
  { month: "Aug", margin: 35.3 },
  { month: "Sep", margin: 36.2 },
  { month: "Oct", margin: 36.4 },
  { month: "Nov", margin: 36.1 },
  { month: "Dec", margin: 22.4 },
];

export const agingBuckets = [
  { bucket: "Current", receivable: 18400, payable: 12200 },
  { bucket: "1–30", receivable: 12800, payable: 8600 },
  { bucket: "31–60", receivable: 9200, payable: 5400 },
  { bucket: "61–90", receivable: 4800, payable: 3200 },
  { bucket: "90+", receivable: 3000, payable: 2280 },
];

export const departmentPerformance = [
  { name: "Sales", budget: 42000, actual: 45800, variance: 3800 },
  { name: "Operations", budget: 36000, actual: 34200, variance: -1800 },
  { name: "Marketing", budget: 18000, actual: 21400, variance: 3600 },
  { name: "IT", budget: 15000, actual: 13800, variance: -1200 },
  { name: "HR", budget: 12000, actual: 11650, variance: -350 },
  { name: "Finance", budget: 9000, actual: 8750, variance: -250 },
];

export const incomeMix = [
  { source: "Product Sales", amount: 92400, fill: "var(--color-product)" },
  { source: "Services", amount: 51200, fill: "var(--color-services)" },
  { source: "Subscriptions", amount: 28600, fill: "var(--color-subs)" },
  { source: "Other", amount: 14220, fill: "var(--color-other)" },
];

export const topCustomers = [
  { name: "Nova Retail", invoices: 18, revenue: 42800, outstanding: 6200 },
  { name: "Bright Media Ltd.", invoices: 12, revenue: 31200, outstanding: 3800 },
  { name: "Summit Contractors", invoices: 9, revenue: 27400, outstanding: 9200 },
  { name: "Northwind Traders", invoices: 14, revenue: 24100, outstanding: 5100 },
  { name: "Orion Logistics", invoices: 7, revenue: 18650, outstanding: 0 },
];

export const topVendors = [
  { name: "Apex Parts", bills: 22, spend: 28400, outstanding: 2140 },
  { name: "Horizon Supplies", bills: 16, spend: 19800, outstanding: 2450 },
  { name: "CloudHost Inc.", bills: 12, spend: 8640, outstanding: 189 },
  { name: "City Utilities", bills: 11, spend: 7200, outstanding: 640 },
  { name: "OfficeLease Co.", bills: 12, spend: 38400, outstanding: 3200 },
];

export const cashPosition = [
  { account: "Operating Bank", balance: 142680, share: 64 },
  { account: "Payroll Bank", balance: 38400, share: 17 },
  { account: "Savings", balance: 11300, share: 5 },
  { account: "Petty Cash", balance: 28450, share: 13 },
];

export const insights = [
  {
    title: "Receivables aging risk",
    detail: "$7,800 is overdue beyond 60 days — follow up on Summit & Bright Media.",
    tone: "warning" as const,
  },
  {
    title: "Marketing over budget",
    detail: "Marketing is 20% over plan this quarter; variance driven by campaign spend.",
    tone: "warning" as const,
  },
  {
    title: "Margin recovery",
    detail: "Gross margin improved 2.6 pts YoY with stronger August–November revenue.",
    tone: "positive" as const,
  },
  {
    title: "Healthy liquidity",
    detail: "Quick ratio at 1.84 with ~21 months runway at current burn.",
    tone: "positive" as const,
  },
];
