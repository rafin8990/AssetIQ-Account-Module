export type BillStatus = "draft" | "open" | "partial" | "paid" | "overdue";

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  paymentTerms: string;
  balance: number;
  status: "Active" | "Inactive";
};

export type SupplierBill = {
  id: string;
  billNo: string;
  supplier: string;
  billDate: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: BillStatus;
};

export type VendorLedgerEntry = {
  id: string;
  date: string;
  supplier: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type PayableAgingBucket = {
  supplier: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  total: number;
};

export const suppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Horizon Supplies",
    email: "billing@horizonsupplies.com",
    phone: "+1 214-555-0188",
    city: "Dallas",
    paymentTerms: "Net 30",
    balance: 2450,
    status: "Active",
  },
  {
    id: "SUP-002",
    name: "Apex Parts",
    email: "ap@apexparts.com",
    phone: "+1 313-555-0166",
    city: "Detroit",
    paymentTerms: "Net 15",
    balance: 2140,
    status: "Active",
  },
  {
    id: "SUP-003",
    name: "City Utilities",
    email: "collections@cityutil.gov",
    phone: "+1 512-555-0121",
    city: "Austin",
    paymentTerms: "Due on receipt",
    balance: 640,
    status: "Active",
  },
  {
    id: "SUP-004",
    name: "CloudHost Inc.",
    email: "invoices@cloudhost.io",
    phone: "+1 650-555-0190",
    city: "San Jose",
    paymentTerms: "Net 30",
    balance: 189,
    status: "Active",
  },
  {
    id: "SUP-005",
    name: "Metro Facilities",
    email: "accounts@metrofac.com",
    phone: "+1 917-555-0144",
    city: "New York",
    paymentTerms: "Net 45",
    balance: 8200,
    status: "Inactive",
  },
];

export const supplierBills: SupplierBill[] = [
  {
    id: "bill1",
    billNo: "BILL-8841",
    supplier: "Horizon Supplies",
    billDate: "2026-03-01",
    dueDate: "2026-03-31",
    amount: 2450,
    paid: 0,
    balance: 2450,
    status: "open",
  },
  {
    id: "bill2",
    billNo: "BILL-8790",
    supplier: "Apex Parts",
    billDate: "2026-02-20",
    dueDate: "2026-03-07",
    amount: 3200,
    paid: 1060,
    balance: 2140,
    status: "overdue",
  },
  {
    id: "bill3",
    billNo: "BILL-8822",
    supplier: "City Utilities",
    billDate: "2026-03-10",
    dueDate: "2026-03-20",
    amount: 640,
    paid: 0,
    balance: 640,
    status: "overdue",
  },
  {
    id: "bill4",
    billNo: "BILL-8860",
    supplier: "CloudHost Inc.",
    billDate: "2026-03-15",
    dueDate: "2026-04-14",
    amount: 189,
    paid: 0,
    balance: 189,
    status: "open",
  },
  {
    id: "bill5",
    billNo: "BILL-8701",
    supplier: "Metro Facilities",
    billDate: "2026-01-12",
    dueDate: "2026-02-26",
    amount: 8200,
    paid: 0,
    balance: 8200,
    status: "overdue",
  },
  {
    id: "bill6",
    billNo: "BILL-8875",
    supplier: "Horizon Supplies",
    billDate: "2026-03-18",
    dueDate: "2026-04-17",
    amount: 1500,
    paid: 0,
    balance: 1500,
    status: "draft",
  },
  {
    id: "bill7",
    billNo: "BILL-8650",
    supplier: "Apex Parts",
    billDate: "2026-01-05",
    dueDate: "2026-01-20",
    amount: 980,
    paid: 980,
    balance: 0,
    status: "paid",
  },
];

export const vendorLedger: VendorLedgerEntry[] = [
  {
    id: "vl1",
    date: "2026-03-01",
    supplier: "Horizon Supplies",
    reference: "BILL-8841",
    description: "Purchase bill",
    debit: 0,
    credit: 2450,
    balance: 2450,
  },
  {
    id: "vl2",
    date: "2026-02-20",
    supplier: "Apex Parts",
    reference: "BILL-8790",
    description: "Parts purchase",
    debit: 0,
    credit: 3200,
    balance: 3200,
  },
  {
    id: "vl3",
    date: "2026-03-05",
    supplier: "Apex Parts",
    reference: "PAY-2201",
    description: "Partial payment",
    debit: 1060,
    credit: 0,
    balance: 2140,
  },
  {
    id: "vl4",
    date: "2026-03-10",
    supplier: "City Utilities",
    reference: "BILL-8822",
    description: "Utility bill",
    debit: 0,
    credit: 640,
    balance: 640,
  },
  {
    id: "vl5",
    date: "2026-03-15",
    supplier: "CloudHost Inc.",
    reference: "BILL-8860",
    description: "Hosting subscription",
    debit: 0,
    credit: 189,
    balance: 189,
  },
  {
    id: "vl6",
    date: "2026-01-12",
    supplier: "Metro Facilities",
    reference: "BILL-8701",
    description: "Facility maintenance",
    debit: 0,
    credit: 8200,
    balance: 8200,
  },
];

export const payableAging: PayableAgingBucket[] = [
  {
    supplier: "Horizon Supplies",
    current: 2450,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    total: 2450,
  },
  {
    supplier: "Apex Parts",
    current: 0,
    days1to30: 2140,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    total: 2140,
  },
  {
    supplier: "City Utilities",
    current: 0,
    days1to30: 640,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    total: 640,
  },
  {
    supplier: "CloudHost Inc.",
    current: 189,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    total: 189,
  },
  {
    supplier: "Metro Facilities",
    current: 0,
    days1to30: 0,
    days31to60: 8200,
    days61to90: 0,
    over90: 0,
    total: 8200,
  },
];

export const payFromAccounts = [
  "Bank — Operating",
  "Bank — Payroll",
  "Cash in Hand",
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

export function getOutstandingBills() {
  return supplierBills.filter((bill) => bill.balance > 0);
}

export function getDueOverdueBills() {
  return supplierBills.filter(
    (bill) =>
      bill.balance > 0 &&
      (bill.status === "overdue" ||
        bill.status === "open" ||
        bill.status === "partial")
  );
}
