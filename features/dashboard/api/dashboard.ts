import {
  listCustomerInvoices,
  type CustomerInvoice,
} from "@/features/accounts-receivable/api/customer-invoices";
import {
  listSupplierBills,
  type SupplierBill,
} from "@/features/accounts-payable/api/supplier-bills";
import { getCashBankBook } from "@/features/cash-bank/api/cash-bank-books";
import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import { fetchProfitLoss } from "@/features/reports/api/financial-reports";
import { listExpenseEntries } from "@/features/transactions/api/expense-entries";
import { listIncomeEntries } from "@/features/transactions/api/income-entries";
import { listTransactionHistory } from "@/features/transactions/api/transaction-history";

export type DashboardKpi = {
  key:
    | "income"
    | "expense"
    | "profit"
    | "cash"
    | "bank"
    | "receivable"
    | "payable";
  title: string;
  value: number;
  change: number;
  trend: "up" | "down";
  hint: string;
};

export type MonthlyPoint = { month: string; income: number; expense: number };
export type CashTrendPoint = { month: string; balance: number };
export type ExpenseSlice = {
  category: string;
  amount: number;
  fill: string;
  key: string;
};

export type DashboardTransaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  type: "income" | "expense";
};

export type DashboardPayment = {
  id: string;
  party: string;
  dueDate: string;
  amount: number;
  status: "upcoming" | "overdue";
  type: "receivable" | "payable";
};

export type DashboardData = {
  kpis: DashboardKpi[];
  monthlyIncomeExpense: MonthlyPoint[];
  cashFlowTrend: CashTrendPoint[];
  expenseBreakdown: ExpenseSlice[];
  recentTransactions: DashboardTransaction[];
  upcomingPayments: DashboardPayment[];
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const EXPENSE_COLORS = [
  "oklch(0.55 0.11 195)",
  "oklch(0.62 0.12 170)",
  "oklch(0.7 0.1 85)",
  "oklch(0.65 0.1 230)",
  "oklch(0.7 0.05 220)",
  "oklch(0.65 0.14 25)",
];

function yearStart() {
  return `${new Date().getFullYear()}-01-01`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function monthIndex(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00`).getMonth();
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / Math.abs(previous)) * 100).toFixed(1));
}

function daysPastDue(dueDate: string) {
  const due = new Date(`${dueDate}T00:00:00`).getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - due) / (1000 * 60 * 60 * 24));
}

function buildMonthlySeries(
  incomes: { date: string; amount: number }[],
  expenses: { date: string; amount: number }[]
): MonthlyPoint[] {
  const year = new Date().getFullYear();
  const incomeByMonth = Array(12).fill(0) as number[];
  const expenseByMonth = Array(12).fill(0) as number[];

  for (const row of incomes) {
    if (!row.date.startsWith(String(year))) continue;
    incomeByMonth[monthIndex(row.date)] += row.amount;
  }
  for (const row of expenses) {
    if (!row.date.startsWith(String(year))) continue;
    expenseByMonth[monthIndex(row.date)] += row.amount;
  }

  const currentMonth = new Date().getMonth();
  return MONTHS.slice(0, currentMonth + 1).map((month, index) => ({
    month,
    income: incomeByMonth[index],
    expense: expenseByMonth[index],
  }));
}

function buildCashTrend(
  books: Array<{ openingBalance: number; entries: Array<{ date: string; debit: number; credit: number }> }>
): CashTrendPoint[] {
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const opening = books.reduce((sum, book) => sum + book.openingBalance, 0);

  const netByMonth = Array(12).fill(0) as number[];
  for (const book of books) {
    for (const entry of book.entries) {
      if (!entry.date.startsWith(String(year))) continue;
      netByMonth[monthIndex(entry.date)] += entry.debit - entry.credit;
    }
  }

  let running = opening;
  return MONTHS.slice(0, currentMonth + 1).map((month, index) => {
    running += netByMonth[index];
    return { month, balance: running };
  });
}

function buildExpenseSlices(
  expenses: { expenseAccount?: string; amount: number; date: string }[]
): ExpenseSlice[] {
  const year = String(new Date().getFullYear());
  const map = new Map<string, number>();
  for (const entry of expenses) {
    if (!entry.date.startsWith(year)) continue;
    const category = entry.expenseAccount?.trim() || "Other";
    map.set(category, (map.get(category) ?? 0) + entry.amount);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount], index) => ({
      category,
      amount,
      fill: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
      key: `cat-${index}`,
    }));
}

function mapUpcomingFromInvoices(invoices: CustomerInvoice[]): DashboardPayment[] {
  const rows: DashboardPayment[] = [];
  for (const invoice of invoices) {
    if (invoice.invoiceKind === "payment" || invoice.balance <= 0) continue;
    const days = daysPastDue(invoice.dueDate);
    if (days <= -30) continue;
    rows.push({
      id: `ar-${invoice.id}`,
      party: invoice.customer,
      dueDate: invoice.dueDate,
      amount: invoice.balance,
      status: days > 0 ? "overdue" : "upcoming",
      type: "receivable",
    });
  }
  return rows;
}

function mapUpcomingFromBills(bills: SupplierBill[]): DashboardPayment[] {
  const rows: DashboardPayment[] = [];
  for (const bill of bills) {
    if (bill.balance <= 0) continue;
    const days = daysPastDue(bill.dueDate);
    if (days <= -30) continue;
    rows.push({
      id: `ap-${bill.id}`,
      party: bill.vendor,
      dueDate: bill.dueDate,
      amount: bill.balance,
      status: days > 0 ? "overdue" : "upcoming",
      type: "payable",
    });
  }
  return rows;
}

export async function loadDashboardData(): Promise<DashboardData> {
  const fromDate = yearStart();
  const toDate = today();

  const [
    profitLoss,
    cashAccounts,
    bankAccounts,
    incomeEntries,
    expenseEntries,
    history,
    invoices,
    bills,
  ] = await Promise.all([
    fetchProfitLoss(fromDate, toDate),
    listAccounts({ type: "cash", status: "active" }),
    listAccounts({ type: "bank", status: "active" }),
    listIncomeEntries({ status: "posted" }),
    listExpenseEntries({ status: "posted" }),
    listTransactionHistory({ status: "posted" }),
    listCustomerInvoices({ outstanding: true }),
    listSupplierBills({ outstanding: true }),
  ]);

  const moneyAccounts = [...cashAccounts, ...bankAccounts];
  const books = await Promise.all(
    moneyAccounts.map((account) =>
      getCashBankBook({
        accountId: account.id,
        dateFrom: fromDate,
        dateTo: toDate,
      })
    )
  );

  const cashBalanceTyped = books
    .filter((book) => book.account.type === "cash")
    .reduce((sum, book) => sum + book.closingBalance, 0);
  const bankBalanceTyped = books
    .filter((book) => book.account.type === "bank")
    .reduce((sum, book) => sum + book.closingBalance, 0);

  const totalIncome = profitLoss.sections.find((s) => s.title === "Income")?.total ?? 0;
  const totalExpense =
    profitLoss.sections.find((s) => s.title === "Expenses")?.total ?? 0;
  const netProfit = profitLoss.netAmount;

  const receivable = invoices
    .filter((invoice) => invoice.invoiceKind !== "payment")
    .reduce((sum, invoice) => sum + Math.max(0, invoice.balance), 0);
  const payable = bills.reduce(
    (sum, bill) => sum + Math.max(0, bill.balance),
    0
  );

  const monthlyIncomeExpense = buildMonthlySeries(incomeEntries, expenseEntries);
  const last = monthlyIncomeExpense.at(-1);
  const prev = monthlyIncomeExpense.at(-2);
  const incomeChange = pctChange(last?.income ?? 0, prev?.income ?? 0);
  const expenseChange = pctChange(last?.expense ?? 0, prev?.expense ?? 0);
  const profitChange = pctChange(
    (last?.income ?? 0) - (last?.expense ?? 0),
    (prev?.income ?? 0) - (prev?.expense ?? 0)
  );

  const cashFlowTrend = buildCashTrend(books);
  const cashTrendLast = cashFlowTrend.at(-1)?.balance ?? 0;
  const cashTrendPrev = cashFlowTrend.at(-2)?.balance ?? cashTrendLast;
  const liquidityChange = pctChange(cashTrendLast, cashTrendPrev);

  const kpis: DashboardKpi[] = [
    {
      key: "income",
      title: "Total Income",
      value: totalIncome,
      change: incomeChange,
      trend: incomeChange >= 0 ? "up" : "down",
      hint: "This fiscal year",
    },
    {
      key: "expense",
      title: "Total Expense",
      value: totalExpense,
      change: expenseChange,
      trend: expenseChange >= 0 ? "up" : "down",
      hint: "This fiscal year",
    },
    {
      key: "profit",
      title: "Net Profit/Loss",
      value: netProfit,
      change: profitChange,
      trend: profitChange >= 0 ? "up" : "down",
      hint: "Income − Expense",
    },
    {
      key: "cash",
      title: "Cash Balance",
      value: cashBalanceTyped,
      change: liquidityChange,
      trend: liquidityChange >= 0 ? "up" : "down",
      hint: "All cash accounts",
    },
    {
      key: "bank",
      title: "Bank Balance",
      value: bankBalanceTyped,
      change: liquidityChange,
      trend: liquidityChange >= 0 ? "up" : "down",
      hint: "All bank accounts",
    },
    {
      key: "receivable",
      title: "Accounts Receivable",
      value: receivable,
      change: 0,
      trend: "up",
      hint: "Outstanding invoices",
    },
    {
      key: "payable",
      title: "Accounts Payable",
      value: payable,
      change: 0,
      trend: "down",
      hint: "Bills to settle",
    },
  ];

  const recentTransactions: DashboardTransaction[] = history.items
    .filter((item) => item.kind === "income" || item.kind === "expense")
    .slice(0, 8)
    .map((item) => ({
      id: item.txnNo || item.id,
      date: item.date,
      description:
        item.narration ||
        item.party ||
        item.reference ||
        `${item.kind} entry`,
      category: item.category || item.kind,
      account: item.account || item.contraAccount || "—",
      amount: item.amount,
      type: item.kind === "income" ? "income" : "expense",
    }));

  const upcomingPayments = [
    ...mapUpcomingFromInvoices(invoices),
    ...mapUpcomingFromBills(bills),
  ]
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "overdue" ? -1 : 1;
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 8);

  return {
    kpis,
    monthlyIncomeExpense,
    cashFlowTrend,
    expenseBreakdown: buildExpenseSlices(expenseEntries),
    recentTransactions,
    upcomingPayments,
  };
}
