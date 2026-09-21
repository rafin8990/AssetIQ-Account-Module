export type VoucherType = "payment" | "receipt" | "journal" | "contra";
export type VoucherStatus = "draft" | "pending" | "approved" | "rejected";

export type VoucherLine = {
  id: string;
  account: string;
  narration: string;
  debit: number;
  credit: number;
};

export type Voucher = {
  id: string;
  voucherNo: string;
  type: VoucherType;
  date: string;
  party?: string;
  fromAccount?: string;
  toAccount?: string;
  reference: string;
  narration: string;
  amount: number;
  status: VoucherStatus;
  preparedBy: string;
  lines: VoucherLine[];
};

export const accountOptions = [
  "Cash in Hand",
  "Bank — Operating",
  "Bank — Payroll",
  "Accounts Payable",
  "Accounts Receivable",
  "Office Rent",
  "Utilities Expense",
  "Sales Revenue",
  "Service Income",
  "Petty Cash",
];

export const partyOptions = [
  "Horizon Supplies",
  "Bright Media Ltd.",
  "Nova Retail",
  "Apex Parts",
  "City Utilities",
  "Orion Logistics",
];

export const voucherTypeLabels: Record<VoucherType, string> = {
  payment: "Payment Voucher",
  receipt: "Receipt Voucher",
  journal: "Journal Voucher",
  contra: "Contra Voucher",
};

export const voucherStatusLabels: Record<VoucherStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const vouchers: Voucher[] = [
  {
    id: "v1",
    voucherNo: "PV-2026-0012",
    type: "payment",
    date: "2026-03-18",
    party: "Horizon Supplies",
    fromAccount: "Bank — Operating",
    toAccount: "Accounts Payable",
    reference: "INV-8841",
    narration: "Supplier payment for March purchase",
    amount: 2450,
    status: "approved",
    preparedBy: "Admin User",
    lines: [
      {
        id: "l1",
        account: "Accounts Payable",
        narration: "Settle invoice INV-8841",
        debit: 2450,
        credit: 0,
      },
      {
        id: "l2",
        account: "Bank — Operating",
        narration: "Bank payment",
        debit: 0,
        credit: 2450,
      },
    ],
  },
  {
    id: "v2",
    voucherNo: "RV-2026-0008",
    type: "receipt",
    date: "2026-03-19",
    party: "Nova Retail",
    fromAccount: "Accounts Receivable",
    toAccount: "Bank — Operating",
    reference: "RCPT-2291",
    narration: "Customer receipt against outstanding invoice",
    amount: 8500,
    status: "approved",
    preparedBy: "Admin User",
    lines: [
      {
        id: "l1",
        account: "Bank — Operating",
        narration: "Customer deposit",
        debit: 8500,
        credit: 0,
      },
      {
        id: "l2",
        account: "Accounts Receivable",
        narration: "Clear AR for Nova Retail",
        debit: 0,
        credit: 8500,
      },
    ],
  },
  {
    id: "v3",
    voucherNo: "JV-2026-0004",
    type: "journal",
    date: "2026-03-17",
    reference: "ADJ-0317",
    narration: "Month-end expense reclassification",
    amount: 1200,
    status: "pending",
    preparedBy: "Finance Officer",
    lines: [
      {
        id: "l1",
        account: "Office Rent",
        narration: "Reclass to rent",
        debit: 1200,
        credit: 0,
      },
      {
        id: "l2",
        account: "Utilities Expense",
        narration: "Offset utilities",
        debit: 0,
        credit: 1200,
      },
    ],
  },
  {
    id: "v4",
    voucherNo: "CV-2026-0003",
    type: "contra",
    date: "2026-03-16",
    fromAccount: "Bank — Operating",
    toAccount: "Cash in Hand",
    reference: "CTR-091",
    narration: "Cash withdrawal for petty expenses",
    amount: 1500,
    status: "draft",
    preparedBy: "Cashier",
    lines: [
      {
        id: "l1",
        account: "Cash in Hand",
        narration: "Cash received",
        debit: 1500,
        credit: 0,
      },
      {
        id: "l2",
        account: "Bank — Operating",
        narration: "Bank withdrawal",
        debit: 0,
        credit: 1500,
      },
    ],
  },
  {
    id: "v5",
    voucherNo: "PV-2026-0013",
    type: "payment",
    date: "2026-03-20",
    party: "City Utilities",
    fromAccount: "Bank — Operating",
    toAccount: "Utilities Expense",
    reference: "UTIL-320",
    narration: "Electricity bill payment",
    amount: 640,
    status: "pending",
    preparedBy: "Admin User",
    lines: [
      {
        id: "l1",
        account: "Utilities Expense",
        narration: "March electricity",
        debit: 640,
        credit: 0,
      },
      {
        id: "l2",
        account: "Bank — Operating",
        narration: "Online transfer",
        debit: 0,
        credit: 640,
      },
    ],
  },
  {
    id: "v6",
    voucherNo: "RV-2026-0009",
    type: "receipt",
    date: "2026-03-14",
    party: "Orion Logistics",
    fromAccount: "Service Income",
    toAccount: "Cash in Hand",
    reference: "CASH-441",
    narration: "Cash receipt for logistics service",
    amount: 920,
    status: "rejected",
    preparedBy: "Cashier",
    lines: [
      {
        id: "l1",
        account: "Cash in Hand",
        narration: "Cash received",
        debit: 920,
        credit: 0,
      },
      {
        id: "l2",
        account: "Service Income",
        narration: "Service fee",
        debit: 0,
        credit: 920,
      },
    ],
  },
  {
    id: "v7",
    voucherNo: "JV-2026-0005",
    type: "journal",
    date: "2026-03-21",
    reference: "ACC-ADJ-05",
    narration: "Depreciation draft entry",
    amount: 3500,
    status: "draft",
    preparedBy: "Accountant",
    lines: [
      {
        id: "l1",
        account: "Utilities Expense",
        narration: "Depreciation (placeholder)",
        debit: 3500,
        credit: 0,
      },
      {
        id: "l2",
        account: "Accounts Payable",
        narration: "Contra entry",
        debit: 0,
        credit: 3500,
      },
    ],
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

export function getVoucherByNo(voucherNo: string) {
  return vouchers.find((v) => v.voucherNo === voucherNo);
}

export function getVouchersByType(type: VoucherType) {
  return vouchers.filter((v) => v.type === type);
}

export function getVouchersByStatus(status: VoucherStatus) {
  return vouchers.filter((v) => v.status === status);
}
