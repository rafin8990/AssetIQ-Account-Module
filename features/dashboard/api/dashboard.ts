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
import { fetchDashboardTrends, fetchProfitLoss } from "@/features/reports/api/financial-reports";
import { listTransactionHistory } from "@/features/transactions/api/transaction-history";
import { formatCurrency } from "../data";

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
  today: number;
  month: number;
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

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function yearStart() {
  return `${new Date().getFullYear()}-01-01`;
}

function monthIndex(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00`).getMonth();
}

function daysPastDue(dueDate: string) {
  const due = new Date(`${dueDate}T00:00:00`).getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - due) / (1000 * 60 * 60 * 24));
}

function buildMonthlySeries(
  months: Array<{ month: number; income: number; expense: number }>
): MonthlyPoint[] {
  return months
    .filter((row) => row.month >= 1 && row.month <= 12)
    .map((row) => ({
      month: MONTHS[row.month - 1],
      income: row.income,
      expense: row.expense,
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
  const map = new Map<string, number>();
  for (const entry of expenses) {
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
  const toDate = localDate();
  const yearFrom = yearStart();

  const [
    todayProfitLoss,
    trends,
    cashAccounts,
    bankAccounts,
    history,
    invoices,
    bills,
  ] = await Promise.all([
    fetchProfitLoss(toDate, toDate),
    fetchDashboardTrends(yearFrom, toDate),
    listAccounts({ type: "cash", status: "active" }),
    listAccounts({ type: "bank", status: "active" }),
    listTransactionHistory({ status: "posted" }),
    listCustomerInvoices({ outstanding: true }),
    listSupplierBills({ outstanding: true }),
  ]);

  const moneyAccounts = [...cashAccounts, ...bankAccounts];
  const books = await Promise.all(
    moneyAccounts.map((account) =>
      getCashBankBook({
        accountId: account.id,
        dateFrom: yearFrom,
        dateTo: toDate,
      })
    )
  );

  const netBetween = (
    typedBooks: typeof books,
    from: string,
    to: string
  ) =>
    typedBooks.reduce(
      (sum, book) =>
        sum +
        book.entries.reduce((inner, entry) => {
          if (entry.date < from || entry.date > to) return inner;
          return inner + entry.debit - entry.credit;
        }, 0),
      0
    );

  const cashBooks = books.filter((book) => book.account.type === "cash");
  const bankBooks = books.filter((book) => book.account.type === "bank");
  const cashOnHand = cashBooks.reduce((sum, book) => sum + book.closingBalance, 0);
  const bankOnHand = bankBooks.reduce((sum, book) => sum + book.closingBalance, 0);

  const sectionTotal = (
    report: { sections: Array<{ title: string; total: number }> },
    title: string
  ) => report.sections.find((section) => section.title === title)?.total ?? 0;

  const receivable = invoices
    .filter((invoice) => invoice.invoiceKind !== "payment")
    .reduce((sum, invoice) => sum + Math.max(0, invoice.balance), 0);
  const payable = bills.reduce(
    (sum, bill) => sum + Math.max(0, bill.balance),
    0
  );

  const monthlyIncomeExpense = buildMonthlySeries(trends.months);
  const cashFlowTrend = buildCashTrend(books);

  const kpis: DashboardKpi[] = [
    {
      key: "income",
      title: "Total Income",
      today: sectionTotal(todayProfitLoss, "Income"),
      month: 0,
      hint: "Posted receipts",
    },
    {
      key: "expense",
      title: "Total Expense",
      today: sectionTotal(todayProfitLoss, "Expenses"),
      month: 0,
      hint: "Posted expenses",
    },
    {
      key: "profit",
      title: "Net Profit/Loss",
      today: todayProfitLoss.netAmount,
      month: 0,
      hint: "Income − Expense",
    },
    {
      key: "cash",
      title: "Cash Balance",
      today: cashOnHand,
      month: cashOnHand,
      hint: "Cash on hand",
    },
    {
      key: "bank",
      title: "Bank Balance",
      today: netBetween(bankBooks, toDate, toDate),
      month: 0,
      hint: `Net movement · On hand ${formatCurrency(bankOnHand)}`,
    },
    {
      key: "receivable",
      title: "Accounts Receivable",
      today: receivable,
      month: receivable,
      hint: "Outstanding invoices",
    },
    {
      key: "payable",
      title: "Accounts Payable",
      today: payable,
      month: payable,
      hint: "Bills still open",
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
    expenseBreakdown: buildExpenseSlices(
      trends.expenses.map((row) => ({
        expenseAccount: row.account,
        amount: row.amount,
        date: toDate,
      }))
    ),
    recentTransactions,
    upcomingPayments,
  };
}
