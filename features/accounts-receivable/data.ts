export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  creditLimit: number;
  balance: number;
  status: "Active" | "Inactive";
};

export type CustomerInvoice = {
  id: string;
  invoiceNo: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paid: number;
  balance: number;
  status: InvoiceStatus;
};

export type LedgerEntry = {
  id: string;
  date: string;
  customer: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type AgingBucket = {
  customer: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  total: number;
};

export const customers: Customer[] = [
  {
    id: "CUS-001",
    name: "Nova Retail",
    email: "accounts@novaretail.com",
    phone: "+1 202-555-0142",
    city: "Austin",
    creditLimit: 50000,
    balance: 12800,
    status: "Active",
  },
  {
    id: "CUS-002",
    name: "Bright Media Ltd.",
    email: "billing@brightmedia.io",
    phone: "+1 415-555-0198",
    city: "San Francisco",
    creditLimit: 25000,
    balance: 3800,
    status: "Active",
  },
  {
    id: "CUS-003",
    name: "Orion Logistics",
    email: "finance@orionlog.com",
    phone: "+1 312-555-0177",
    city: "Chicago",
    creditLimit: 40000,
    balance: 920,
    status: "Active",
  },
  {
    id: "CUS-004",
    name: "Summit Contractors",
    email: "ap@summitco.com",
    phone: "+1 646-555-0133",
    city: "New York",
    creditLimit: 75000,
    balance: 15400,
    status: "Active",
  },
  {
    id: "CUS-005",
    name: "Northwind Traders",
    email: "ar@northwind.com",
    phone: "+1 206-555-0110",
    city: "Seattle",
    creditLimit: 30000,
    balance: 0,
    status: "Inactive",
  },
];

export const customerInvoices: CustomerInvoice[] = [
  {
    id: "inv1",
    invoiceNo: "INV-2291",
    customer: "Nova Retail",
    issueDate: "2026-03-01",
    dueDate: "2026-03-31",
    amount: 8500,
    paid: 0,
    balance: 8500,
    status: "sent",
  },
  {
    id: "inv2",
    invoiceNo: "INV-2288",
    customer: "Bright Media Ltd.",
    issueDate: "2026-02-10",
    dueDate: "2026-03-12",
    amount: 3800,
    paid: 0,
    balance: 3800,
    status: "overdue",
  },
  {
    id: "inv3",
    invoiceNo: "INV-2275",
    customer: "Summit Contractors",
    issueDate: "2026-01-20",
    dueDate: "2026-02-19",
    amount: 12000,
    paid: 2800,
    balance: 9200,
    status: "overdue",
  },
  {
    id: "inv4",
    invoiceNo: "INV-2301",
    customer: "Orion Logistics",
    issueDate: "2026-03-15",
    dueDate: "2026-04-14",
    amount: 920,
    paid: 0,
    balance: 920,
    status: "sent",
  },
  {
    id: "inv5",
    invoiceNo: "INV-2260",
    customer: "Nova Retail",
    issueDate: "2026-02-01",
    dueDate: "2026-03-03",
    amount: 4300,
    paid: 0,
    balance: 4300,
    status: "overdue",
  },
  {
    id: "inv6",
    invoiceNo: "INV-2310",
    customer: "Summit Contractors",
    issueDate: "2026-03-18",
    dueDate: "2026-04-17",
    amount: 6200,
    paid: 0,
    balance: 6200,
    status: "draft",
  },
  {
    id: "inv7",
    invoiceNo: "INV-2251",
    customer: "Northwind Traders",
    issueDate: "2026-01-05",
    dueDate: "2026-02-04",
    amount: 2100,
    paid: 2100,
    balance: 0,
    status: "paid",
  },
];

export const customerLedger: LedgerEntry[] = [
  {
    id: "led1",
    date: "2026-03-01",
    customer: "Nova Retail",
    reference: "INV-2291",
    description: "Sales invoice",
    debit: 8500,
    credit: 0,
    balance: 8500,
  },
  {
    id: "led2",
    date: "2026-02-01",
    customer: "Nova Retail",
    reference: "INV-2260",
    description: "Sales invoice",
    debit: 4300,
    credit: 0,
    balance: 12800,
  },
  {
    id: "led3",
    date: "2026-02-10",
    customer: "Bright Media Ltd.",
    reference: "INV-2288",
    description: "Media campaign invoice",
    debit: 3800,
    credit: 0,
    balance: 3800,
  },
  {
    id: "led4",
    date: "2026-01-20",
    customer: "Summit Contractors",
    reference: "INV-2275",
    description: "Project milestone billing",
    debit: 12000,
    credit: 0,
    balance: 12000,
  },
  {
    id: "led5",
    date: "2026-02-28",
    customer: "Summit Contractors",
    reference: "RCPT-1102",
    description: "Partial payment received",
    debit: 0,
    credit: 2800,
    balance: 9200,
  },
  {
    id: "led6",
    date: "2026-03-15",
    customer: "Orion Logistics",
    reference: "INV-2301",
    description: "Logistics service invoice",
    debit: 920,
    credit: 0,
    balance: 920,
  },
];

export const receivableAging: AgingBucket[] = [
  {
    customer: "Nova Retail",
    current: 8500,
    days1to30: 4300,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    total: 12800,
  },
  {
    customer: "Bright Media Ltd.",
    current: 0,
    days1to30: 3800,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    total: 3800,
  },
  {
    customer: "Summit Contractors",
    current: 6200,
    days1to30: 0,
    days31to60: 9200,
    days61to90: 0,
    over90: 0,
    total: 15400,
  },
  {
    customer: "Orion Logistics",
    current: 920,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    over90: 0,
    total: 920,
  },
];

export const depositAccounts = [
  "Bank — Operating",
  "Bank — Savings",
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

export function getOutstandingInvoices() {
  return customerInvoices.filter((invoice) => invoice.balance > 0);
}

export function getDueOverdueInvoices() {
  return customerInvoices.filter(
    (invoice) =>
      invoice.balance > 0 &&
      (invoice.status === "overdue" ||
        invoice.status === "sent" ||
        invoice.status === "partial")
  );
}
