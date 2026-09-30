export type VoucherType = "payment" | "receipt" | "journal" | "contra";
export type VoucherStatus = "draft" | "pending" | "approved" | "rejected";

export type VoucherLine = {
  id: string;
  account: string;
  accountId?: string;
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
  fromAccountId?: string;
  toAccount?: string;
  toAccountId?: string;
  reference: string;
  narration: string;
  amount: number;
  status: VoucherStatus;
  preparedBy: string;
  lines: VoucherLine[];
};

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

export { formatCurrency } from "@/lib/format-currency";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
