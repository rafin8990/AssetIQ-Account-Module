import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  BookOpen,
  Layers,
  Network,
  Scale,
  Tags,
  Ticket,
  CreditCard,
  Banknote,
  BookMarked,
  ArrowLeftRight,
  List,
  ClipboardList,
  Printer,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  History,
  Paperclip,
  HandCoins,
  UserRound,
  FileSpreadsheet,
  CircleDollarSign,
  BookOpenCheck,
  AlarmClock,
  ChartColumnIncreasing,
  Building2,
  FileMinus2,
  WalletCards,
  PiggyBank,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale3d,
  NotebookTabs,
  Coins,
  CalendarRange,
  FileBarChart,
  Sheet,
  Waves,
  Scroll,
  TrendingUp,
  ArrowDownCircle,
  Clock3,
  Library,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
};

/** Sidebar: Dashboard + API-connected pages only. */
export const mainNavigation: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    title: "Chart Of Accounts",
    href: "/chart-of-accounts",
    icon: BookOpen,
    children: [
      {
        title: "Account Groups",
        href: "/chart-of-accounts/account-groups",
        icon: Layers,
      },
      {
        title: "Accounts",
        href: "/chart-of-accounts/accounts",
        icon: Wallet,
      },
      {
        title: "Parent/Sub Accounts",
        href: "/chart-of-accounts/parent-sub-accounts",
        icon: Network,
      },
      {
        title: "Opening Balance",
        href: "/chart-of-accounts/opening-balance",
        icon: Scale,
      },
      {
        title: "Account Types",
        href: "/chart-of-accounts/account-types",
        icon: Tags,
      },
    ],
  },
  {
    title: "Vouchers",
    href: "/vouchers",
    icon: Ticket,
    children: [
      {
        title: "Payment Voucher",
        href: "/vouchers/payment",
        icon: CreditCard,
      },
      {
        title: "Receipt Voucher",
        href: "/vouchers/receipt",
        icon: Banknote,
      },
      {
        title: "Journal Voucher",
        href: "/vouchers/journal",
        icon: BookMarked,
      },
      {
        title: "Contra Voucher",
        href: "/vouchers/contra",
        icon: ArrowLeftRight,
      },
      { title: "Voucher List", href: "/vouchers/list", icon: List },
      {
        title: "Draft / Pending / Approved / Rejected",
        href: "/vouchers/status",
        icon: ClipboardList,
      },
      { title: "Voucher Print", href: "/vouchers/print", icon: Printer },
    ],
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: Receipt,
    children: [
      {
        title: "Income Entry",
        href: "/transactions/income-entry",
        icon: ArrowDownLeft,
      },
      {
        title: "Expense Entry",
        href: "/transactions/expense-entry",
        icon: ArrowUpRight,
      },
      {
        title: "Cash Transaction",
        href: "/transactions/cash",
        icon: Banknote,
      },
      {
        title: "Bank Transaction",
        href: "/transactions/bank",
        icon: Landmark,
      },
      {
        title: "Fund Transfer",
        href: "/transactions/fund-transfer",
        icon: ArrowLeftRight,
      },
      {
        title: "Transaction History",
        href: "/transactions/history",
        icon: History,
      },
      {
        title: "Attach Invoice/Bill/Supporting Documents",
        href: "/transactions/attachments",
        icon: Paperclip,
      },
    ],
  },
  {
    title: "Accounts Receivable",
    href: "/accounts-receivable",
    icon: HandCoins,
    children: [
      {
        title: "Customers",
        href: "/accounts-receivable/customers",
        icon: UserRound,
      },
      {
        title: "Customer Invoices",
        href: "/accounts-receivable/customer-invoices",
        icon: FileSpreadsheet,
      },
      {
        title: "Receive Payment",
        href: "/accounts-receivable/receive-payment",
        icon: CircleDollarSign,
      },
      {
        title: "Customer Ledger",
        href: "/accounts-receivable/customer-ledger",
        icon: BookOpenCheck,
      },
      {
        title: "Outstanding Receivables",
        href: "/accounts-receivable/outstanding",
        icon: ClipboardList,
      },
      {
        title: "Due/Overdue Invoices",
        href: "/accounts-receivable/due-overdue",
        icon: AlarmClock,
      },
      {
        title: "Receivable Aging",
        href: "/accounts-receivable/aging",
        icon: ChartColumnIncreasing,
      },
    ],
  },
  {
    title: "Accounts Payable",
    href: "/accounts-payable",
    icon: WalletCards,
    children: [
      {
        title: "Suppliers/Vendors",
        href: "/accounts-payable/suppliers",
        icon: Building2,
      },
      {
        title: "Supplier Bills",
        href: "/accounts-payable/supplier-bills",
        icon: FileMinus2,
      },
      {
        title: "Supplier Payments",
        href: "/accounts-payable/supplier-payments",
        icon: CreditCard,
      },
      {
        title: "Vendor Ledger",
        href: "/accounts-payable/vendor-ledger",
        icon: BookOpenCheck,
      },
      {
        title: "Outstanding Payables",
        href: "/accounts-payable/outstanding",
        icon: ClipboardList,
      },
      {
        title: "Due/Overdue Bills",
        href: "/accounts-payable/due-overdue",
        icon: AlarmClock,
      },
      {
        title: "Payable Aging",
        href: "/accounts-payable/aging",
        icon: ChartColumnIncreasing,
      },
    ],
  },
  {
    title: "Cash & Bank",
    href: "/cash-bank",
    icon: PiggyBank,
    children: [
      {
        title: "Cash Accounts",
        href: "/cash-bank/cash-accounts",
        icon: Banknote,
      },
      {
        title: "Bank Accounts",
        href: "/cash-bank/bank-accounts",
        icon: Landmark,
      },
      {
        title: "Deposit",
        href: "/cash-bank/deposit",
        icon: ArrowDownToLine,
      },
      {
        title: "Withdrawal",
        href: "/cash-bank/withdrawal",
        icon: ArrowUpFromLine,
      },
      {
        title: "Account-to-Account Transfer",
        href: "/cash-bank/transfer",
        icon: ArrowLeftRight,
      },
      {
        title: "Bank Reconciliation",
        href: "/cash-bank/reconciliation",
        icon: Scale3d,
      },
      {
        title: "Cash Book",
        href: "/cash-bank/cash-book",
        icon: NotebookTabs,
      },
      {
        title: "Bank Book",
        href: "/cash-bank/bank-book",
        icon: BookOpenCheck,
      },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
    children: [
      { title: "Trial Balance", href: "/reports/trial-balance", icon: Scale },
      {
        title: "Profit & Loss Statement",
        href: "/reports/profit-loss",
        icon: TrendingUp,
      },
      { title: "Balance Sheet", href: "/reports/balance-sheet", icon: Sheet },
      {
        title: "Cash Flow Statement",
        href: "/reports/cash-flow",
        icon: Waves,
      },
      {
        title: "General Ledger",
        href: "/reports/general-ledger",
        icon: Library,
      },
      { title: "Journal Report", href: "/reports/journal", icon: Scroll },
      {
        title: "Income Report",
        href: "/reports/income",
        icon: ArrowDownLeft,
      },
      {
        title: "Expense Report",
        href: "/reports/expense",
        icon: ArrowDownCircle,
      },
      {
        title: "Receivable Report",
        href: "/reports/receivable",
        icon: HandCoins,
      },
      {
        title: "Payable Report",
        href: "/reports/payable",
        icon: WalletCards,
      },
      { title: "Aging Reports", href: "/reports/aging", icon: Clock3 },
      {
        title: "Cash/Bank Report",
        href: "/reports/cash-bank",
        icon: Landmark,
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      {
        title: "Financial Year",
        href: "/settings/financial-year",
        icon: CalendarRange,
      },
      { title: "Currency", href: "/settings/currency", icon: Coins },
    ],
  },
];

export function findNavByPath(pathname: string): {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
} {
  if (pathname === "/") {
    return {
      title: "Dashboard",
      breadcrumbs: [{ label: "Home", href: "/" }, { label: "Dashboard" }],
    };
  }

  for (const item of mainNavigation) {
    if (item.children?.length) {
      const child = item.children.find(
        (c) => pathname === c.href || pathname.startsWith(`${c.href}/`)
      );
      if (child) {
        return {
          title: child.title,
          breadcrumbs: [
            { label: "Home", href: "/" },
            { label: item.title },
            { label: child.title },
          ],
        };
      }
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return {
          title: item.title,
          breadcrumbs: [{ label: "Home", href: "/" }, { label: item.title }],
        };
      }
    }

    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      return {
        title: item.title,
        breadcrumbs: [{ label: "Home", href: "/" }, { label: item.title }],
      };
    }
  }

  return {
    title: "Accounts",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Page" }],
  };
}
