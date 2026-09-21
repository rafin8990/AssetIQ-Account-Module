import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  PieChart,
  BookOpen,
  Layers,
  Network,
  Hash,
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
  Target,
  PlusCircle,
  Building,
  GitBranch,
  FolderKanban,
  Boxes,
  ChartNoAxesCombined,
  Diff,
  Calculator,
  ScrollText,
  Library,
  BookCopy,
  DoorOpen,
  DoorClosed,
  SlidersHorizontal,
  CalendarRange,
  CalendarDays,
  Lock,
  Package,
  ShoppingCart,
  TrendingDown,
  Layers2,
  Recycle,
  RefreshCw,
  FileOutput,
  FileBarChart,
  Sheet,
  Waves,
  Scroll,
  TrendingUp,
  ArrowDownCircle,
  Clock3,
  Percent,
  BadgeCheck,
  BadgeX,
  Hourglass,
  UsersRound,
  Gauge,
  ShieldCheck,
  Activity,
  Coins,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
};

export const mainNavigation: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Analytics", href: "/analytics", icon: PieChart },
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
        title: "Account Codes",
        href: "/chart-of-accounts/account-codes",
        icon: Hash,
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
    title: "Budget & Cost Center",
    href: "/budget",
    icon: Target,
    children: [
      { title: "Create Budget", href: "/budget/create", icon: PlusCircle },
      {
        title: "Department Budget",
        href: "/budget/department",
        icon: Building,
      },
      { title: "Branch Budget", href: "/budget/branch", icon: GitBranch },
      {
        title: "Project Budget",
        href: "/budget/project",
        icon: FolderKanban,
      },
      { title: "Cost Centers", href: "/budget/cost-centers", icon: Boxes },
      {
        title: "Budget vs Actual",
        href: "/budget/vs-actual",
        icon: ChartNoAxesCombined,
      },
      { title: "Variance Report", href: "/budget/variance", icon: Diff },
    ],
  },
  {
    title: "General Accounting",
    href: "/general-accounting",
    icon: Calculator,
    children: [
      {
        title: "Journal Entries",
        href: "/general-accounting/journal-entries",
        icon: ScrollText,
      },
      {
        title: "General Ledger",
        href: "/general-accounting/general-ledger",
        icon: Library,
      },
      {
        title: "Subsidiary Ledger",
        href: "/general-accounting/subsidiary-ledger",
        icon: BookCopy,
      },
      {
        title: "Opening Balance",
        href: "/general-accounting/opening-balance",
        icon: DoorOpen,
      },
      {
        title: "Closing Entries",
        href: "/general-accounting/closing-entries",
        icon: DoorClosed,
      },
      {
        title: "Adjusting Entries",
        href: "/general-accounting/adjusting-entries",
        icon: SlidersHorizontal,
      },
      {
        title: "Fiscal Year",
        href: "/general-accounting/fiscal-year",
        icon: CalendarRange,
      },
      {
        title: "Accounting Period",
        href: "/general-accounting/accounting-period",
        icon: CalendarDays,
      },
      {
        title: "Period Closing/Locking",
        href: "/general-accounting/period-locking",
        icon: Lock,
      },
    ],
  },
  {
    title: "Fixed Assets Accounting",
    href: "/fixed-assets",
    icon: Package,
    children: [
      {
        title: "Asset Accounts",
        href: "/fixed-assets/asset-accounts",
        icon: Layers2,
      },
      {
        title: "Asset Purchase",
        href: "/fixed-assets/purchase",
        icon: ShoppingCart,
      },
      {
        title: "Depreciation",
        href: "/fixed-assets/depreciation",
        icon: TrendingDown,
      },
      {
        title: "Accumulated Depreciation",
        href: "/fixed-assets/accumulated-depreciation",
        icon: Scale,
      },
      {
        title: "Asset Disposal",
        href: "/fixed-assets/disposal",
        icon: Recycle,
      },
      {
        title: "Asset Revaluation",
        href: "/fixed-assets/revaluation",
        icon: RefreshCw,
      },
      {
        title: "Depreciation Journal Posting",
        href: "/fixed-assets/depreciation-posting",
        icon: FileOutput,
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
      { title: "VAT & Tax Report", href: "/reports/vat-tax", icon: Percent },
      {
        title: "Budget vs Actual",
        href: "/reports/budget-vs-actual",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "Approval & Audit",
    href: "/approval-audit",
    icon: ShieldCheck,
    children: [
      {
        title: "Pending Approvals",
        href: "/approval-audit/pending",
        icon: Hourglass,
      },
      {
        title: "Approved Transactions",
        href: "/approval-audit/approved",
        icon: BadgeCheck,
      },
      {
        title: "Rejected Transactions",
        href: "/approval-audit/rejected",
        icon: BadgeX,
      },
      {
        title: "Maker–Checker–Approver",
        href: "/approval-audit/maker-checker",
        icon: UsersRound,
      },
      {
        title: "Approval Limits",
        href: "/approval-audit/limits",
        icon: Gauge,
      },
      {
        title: "Audit Trail",
        href: "/approval-audit/audit-trail",
        icon: ScrollText,
      },
      {
        title: "Activity Log",
        href: "/approval-audit/activity-log",
        icon: Activity,
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
      {
        title: "Account Settings",
        href: "/settings/account-settings",
        icon: SlidersHorizontal,
      },
      {
        title: "Voucher Number Format",
        href: "/settings/voucher-number-format",
        icon: Hash,
      },
      {
        title: "Payment Methods",
        href: "/settings/payment-methods",
        icon: CreditCard,
      },
      {
        title: "Tax/VAT Rates",
        href: "/settings/tax-vat-rates",
        icon: Percent,
      },
      {
        title: "Cost Centers",
        href: "/settings/cost-centers",
        icon: Boxes,
      },
      { title: "Branches", href: "/settings/branches", icon: Building2 },
      {
        title: "Roles & Permissions",
        href: "/settings/roles-permissions",
        icon: Lock,
      },
      {
        title: "Approval Workflow",
        href: "/settings/approval-workflow",
        icon: Workflow,
      },
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
