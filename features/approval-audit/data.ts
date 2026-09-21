export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export type ApprovalItem = {
  id: string;
  docNo: string;
  type: string;
  maker: string;
  checker?: string;
  approver?: string;
  amount: number;
  submittedOn: string;
  status: ApprovalStatus;
  remarks?: string;
};

export type ApprovalLimit = {
  id: string;
  role: string;
  module: string;
  minAmount: number;
  maxAmount: number;
  levels: number;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  reference: string;
  details: string;
};

export type ActivityEvent = {
  id: string;
  timestamp: string;
  user: string;
  activity: string;
  module: string;
  ip: string;
};

export const approvalItems: ApprovalItem[] = [
  {
    id: "ap1",
    docNo: "PV-2026-0013",
    type: "Payment Voucher",
    maker: "Cashier",
    amount: 640,
    submittedOn: "2026-03-20",
    status: "Pending",
  },
  {
    id: "ap2",
    docNo: "JV-2026-0004",
    type: "Journal Voucher",
    maker: "Accountant",
    checker: "Finance Officer",
    amount: 1200,
    submittedOn: "2026-03-17",
    status: "Pending",
  },
  {
    id: "ap3",
    docNo: "INV-2310",
    type: "Customer Invoice",
    maker: "Sales Desk",
    amount: 6200,
    submittedOn: "2026-03-18",
    status: "Pending",
  },
  {
    id: "ap4",
    docNo: "PV-2026-0012",
    type: "Payment Voucher",
    maker: "Cashier",
    checker: "Accountant",
    approver: "Finance Manager",
    amount: 2450,
    submittedOn: "2026-03-18",
    status: "Approved",
  },
  {
    id: "ap5",
    docNo: "RV-2026-0008",
    type: "Receipt Voucher",
    maker: "Cashier",
    checker: "Accountant",
    approver: "Finance Manager",
    amount: 8500,
    submittedOn: "2026-03-19",
    status: "Approved",
  },
  {
    id: "ap6",
    docNo: "RV-2026-0009",
    type: "Receipt Voucher",
    maker: "Cashier",
    checker: "Accountant",
    amount: 920,
    submittedOn: "2026-03-14",
    status: "Rejected",
    remarks: "Missing supporting receipt",
  },
  {
    id: "ap7",
    docNo: "BILL-8875",
    type: "Supplier Bill",
    maker: "Procurement",
    amount: 1500,
    submittedOn: "2026-03-18",
    status: "Rejected",
    remarks: "Duplicate bill number",
  },
];

export const approvalLimits: ApprovalLimit[] = [
  {
    id: "lim1",
    role: "Accountant",
    module: "Payment Voucher",
    minAmount: 0,
    maxAmount: 1000,
    levels: 1,
  },
  {
    id: "lim2",
    role: "Finance Officer",
    module: "Payment Voucher",
    minAmount: 1000,
    maxAmount: 10000,
    levels: 2,
  },
  {
    id: "lim3",
    role: "Finance Manager",
    module: "Payment Voucher",
    minAmount: 10000,
    maxAmount: 100000,
    levels: 3,
  },
  {
    id: "lim4",
    role: "Accountant",
    module: "Journal Voucher",
    minAmount: 0,
    maxAmount: 5000,
    levels: 1,
  },
  {
    id: "lim5",
    role: "Finance Manager",
    module: "Journal Voucher",
    minAmount: 5000,
    maxAmount: 50000,
    levels: 2,
  },
];

export const makerCheckerMatrix = [
  {
    id: "mc1",
    module: "Payment Voucher",
    maker: "Cashier",
    checker: "Accountant",
    approver: "Finance Manager",
  },
  {
    id: "mc2",
    module: "Receipt Voucher",
    maker: "Cashier",
    checker: "Accountant",
    approver: "Finance Officer",
  },
  {
    id: "mc3",
    module: "Journal Voucher",
    maker: "Accountant",
    checker: "Finance Officer",
    approver: "Finance Manager",
  },
  {
    id: "mc4",
    module: "Supplier Bill",
    maker: "Procurement",
    checker: "Accountant",
    approver: "Finance Manager",
  },
];

export const auditTrail: AuditEvent[] = [
  {
    id: "au1",
    timestamp: "2026-03-21 10:42:11",
    user: "Finance Manager",
    action: "Approved",
    entity: "Payment Voucher",
    reference: "PV-2026-0012",
    details: "Approved after checker review",
  },
  {
    id: "au2",
    timestamp: "2026-03-21 09:15:03",
    user: "Accountant",
    action: "Updated",
    entity: "Customer Invoice",
    reference: "INV-2291",
    details: "Changed due date to 2026-03-31",
  },
  {
    id: "au3",
    timestamp: "2026-03-20 16:08:44",
    user: "Cashier",
    action: "Created",
    entity: "Receipt Voucher",
    reference: "RV-2026-0008",
    details: "Created receipt for Nova Retail",
  },
  {
    id: "au4",
    timestamp: "2026-03-20 14:22:19",
    user: "Finance Officer",
    action: "Rejected",
    entity: "Receipt Voucher",
    reference: "RV-2026-0009",
    details: "Rejected — missing supporting document",
  },
  {
    id: "au5",
    timestamp: "2026-03-19 11:05:57",
    user: "Admin",
    action: "Changed",
    entity: "Approval Limit",
    reference: "LIM-PV-FO",
    details: "Raised Finance Officer limit to 10,000",
  },
];

export const activityLog: ActivityEvent[] = [
  {
    id: "act1",
    timestamp: "2026-03-21 11:02:10",
    user: "Admin User",
    activity: "Logged in",
    module: "Auth",
    ip: "10.0.1.24",
  },
  {
    id: "act2",
    timestamp: "2026-03-21 11:05:33",
    user: "Admin User",
    activity: "Opened Dashboard",
    module: "Overview",
    ip: "10.0.1.24",
  },
  {
    id: "act3",
    timestamp: "2026-03-21 11:12:48",
    user: "Finance Manager",
    activity: "Reviewed pending approvals",
    module: "Approval & Audit",
    ip: "10.0.1.31",
  },
  {
    id: "act4",
    timestamp: "2026-03-21 11:18:02",
    user: "Accountant",
    activity: "Exported Trial Balance",
    module: "Reports",
    ip: "10.0.1.18",
  },
  {
    id: "act5",
    timestamp: "2026-03-20 17:40:55",
    user: "Cashier",
    activity: "Created Payment Voucher draft",
    module: "Vouchers",
    ip: "10.0.1.42",
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

export function getApprovalsByStatus(status: ApprovalStatus) {
  return approvalItems.filter((item) => item.status === status);
}
