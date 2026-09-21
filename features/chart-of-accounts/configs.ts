import type { CrudPageConfig } from "@/features/crud/types";

export const accountGroupsConfig: CrudPageConfig = {
  title: "Account Groups",
  description: "Organize ledger accounts into logical reporting groups.",
  entityName: "Account Group",
  columns: [
    { key: "name", label: "Group Name" },
    { key: "code", label: "Code" },
    { key: "nature", label: "Nature" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Group Name", placeholder: "e.g. Current Assets" },
    { key: "code", label: "Code", placeholder: "e.g. CA" },
    {
      key: "nature",
      label: "Nature",
      type: "select",
      options: [
        { label: "Asset", value: "Asset" },
        { label: "Liability", value: "Liability" },
        { label: "Equity", value: "Equity" },
        { label: "Income", value: "Income" },
        { label: "Expense", value: "Expense" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ],
  initialRows: [
    {
      id: "GRP-001",
      name: "Current Assets",
      code: "CA",
      nature: "Asset",
      status: "Active",
    },
    {
      id: "GRP-002",
      name: "Fixed Assets",
      code: "FA",
      nature: "Asset",
      status: "Active",
    },
    {
      id: "GRP-003",
      name: "Current Liabilities",
      code: "CL",
      nature: "Liability",
      status: "Active",
    },
    {
      id: "GRP-004",
      name: "Direct Income",
      code: "DI",
      nature: "Income",
      status: "Active",
    },
  ],
};

export const accountsConfig: CrudPageConfig = {
  title: "Accounts",
  description: "Manage individual ledger accounts under the chart of accounts.",
  entityName: "Account",
  columns: [
    { key: "name", label: "Account Name" },
    { key: "code", label: "Code" },
    { key: "group", label: "Group" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Account Name", placeholder: "e.g. Cash in Hand" },
    { key: "code", label: "Code", placeholder: "e.g. 1001" },
    {
      key: "group",
      label: "Group",
      type: "select",
      options: [
        { label: "Current Assets", value: "Current Assets" },
        { label: "Fixed Assets", value: "Fixed Assets" },
        { label: "Current Liabilities", value: "Current Liabilities" },
        { label: "Direct Income", value: "Direct Income" },
      ],
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Cash", value: "Cash" },
        { label: "Bank", value: "Bank" },
        { label: "Receivable", value: "Receivable" },
        { label: "Payable", value: "Payable" },
        { label: "Expense", value: "Expense" },
        { label: "Income", value: "Income" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ],
  initialRows: [
    {
      id: "ACC-001",
      name: "Cash in Hand",
      code: "1001",
      group: "Current Assets",
      type: "Cash",
      status: "Active",
    },
    {
      id: "ACC-002",
      name: "Bank — Operating",
      code: "1002",
      group: "Current Assets",
      type: "Bank",
      status: "Active",
    },
    {
      id: "ACC-003",
      name: "Accounts Receivable",
      code: "1100",
      group: "Current Assets",
      type: "Receivable",
      status: "Active",
    },
    {
      id: "ACC-004",
      name: "Accounts Payable",
      code: "2001",
      group: "Current Liabilities",
      type: "Payable",
      status: "Active",
    },
  ],
};

export const parentSubAccountsConfig: CrudPageConfig = {
  title: "Parent/Sub Accounts",
  description: "Define parent accounts and their nested sub-accounts.",
  entityName: "Parent/Sub Account",
  columns: [
    { key: "name", label: "Account Name" },
    { key: "parent", label: "Parent Account" },
    { key: "level", label: "Level" },
    { key: "code", label: "Code" },
  ],
  fields: [
    { key: "name", label: "Account Name", placeholder: "e.g. Petty Cash" },
    {
      key: "parent",
      label: "Parent Account",
      type: "select",
      options: [
        { label: "None (Root)", value: "—" },
        { label: "Cash in Hand", value: "Cash in Hand" },
        { label: "Bank Accounts", value: "Bank Accounts" },
        { label: "Operating Expenses", value: "Operating Expenses" },
      ],
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: [
        { label: "Parent", value: "Parent" },
        { label: "Sub", value: "Sub" },
      ],
    },
    { key: "code", label: "Code", placeholder: "e.g. 1001-01" },
  ],
  initialRows: [
    {
      id: "PSA-001",
      name: "Cash in Hand",
      parent: "—",
      level: "Parent",
      code: "1001",
    },
    {
      id: "PSA-002",
      name: "Petty Cash",
      parent: "Cash in Hand",
      level: "Sub",
      code: "1001-01",
    },
    {
      id: "PSA-003",
      name: "Bank Accounts",
      parent: "—",
      level: "Parent",
      code: "1002",
    },
    {
      id: "PSA-004",
      name: "Bank — Operating",
      parent: "Bank Accounts",
      level: "Sub",
      code: "1002-01",
    },
  ],
};

export const accountCodesConfig: CrudPageConfig = {
  title: "Account Codes",
  description: "Maintain standardized codes used across the ledger.",
  entityName: "Account Code",
  columns: [
    { key: "code", label: "Code" },
    { key: "name", label: "Linked Account" },
    { key: "series", label: "Series" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "code", label: "Code", placeholder: "e.g. 4000" },
    {
      key: "name",
      label: "Linked Account",
      placeholder: "e.g. Sales Revenue",
    },
    {
      key: "series",
      label: "Series",
      type: "select",
      options: [
        { label: "1000 — Assets", value: "1000 — Assets" },
        { label: "2000 — Liabilities", value: "2000 — Liabilities" },
        { label: "3000 — Equity", value: "3000 — Equity" },
        { label: "4000 — Income", value: "4000 — Income" },
        { label: "5000 — Expense", value: "5000 — Expense" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Reserved", value: "Reserved" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ],
  initialRows: [
    {
      id: "COD-001",
      code: "1001",
      name: "Cash in Hand",
      series: "1000 — Assets",
      status: "Active",
    },
    {
      id: "COD-002",
      code: "2001",
      name: "Accounts Payable",
      series: "2000 — Liabilities",
      status: "Active",
    },
    {
      id: "COD-003",
      code: "4000",
      name: "Sales Revenue",
      series: "4000 — Income",
      status: "Active",
    },
    {
      id: "COD-004",
      code: "5100",
      name: "Office Rent",
      series: "5000 — Expense",
      status: "Active",
    },
  ],
};

export const openingBalanceConfig: CrudPageConfig = {
  title: "Opening Balance",
  description: "Set opening debit/credit balances for the fiscal period.",
  entityName: "Opening Balance",
  columns: [
    { key: "account", label: "Account" },
    { key: "fiscalYear", label: "Fiscal Year" },
    { key: "debit", label: "Debit", className: "text-right tabular-nums" },
    { key: "credit", label: "Credit", className: "text-right tabular-nums" },
  ],
  fields: [
    {
      key: "account",
      label: "Account",
      type: "select",
      options: [
        { label: "Cash in Hand", value: "Cash in Hand" },
        { label: "Bank — Operating", value: "Bank — Operating" },
        { label: "Accounts Receivable", value: "Accounts Receivable" },
        { label: "Accounts Payable", value: "Accounts Payable" },
      ],
    },
    {
      key: "fiscalYear",
      label: "Fiscal Year",
      type: "select",
      options: [
        { label: "2025-2026", value: "2025-2026" },
        { label: "2024-2025", value: "2024-2025" },
      ],
    },
    {
      key: "debit",
      label: "Debit",
      type: "number",
      placeholder: "0",
      required: false,
    },
    {
      key: "credit",
      label: "Credit",
      type: "number",
      placeholder: "0",
      required: false,
    },
  ],
  initialRows: [
    {
      id: "OB-001",
      account: "Cash in Hand",
      fiscalYear: "2025-2026",
      debit: 12500,
      credit: 0,
    },
    {
      id: "OB-002",
      account: "Bank — Operating",
      fiscalYear: "2025-2026",
      debit: 185000,
      credit: 0,
    },
    {
      id: "OB-003",
      account: "Accounts Receivable",
      fiscalYear: "2025-2026",
      debit: 42000,
      credit: 0,
    },
    {
      id: "OB-004",
      account: "Accounts Payable",
      fiscalYear: "2025-2026",
      debit: 0,
      credit: 28600,
    },
  ],
};

export const accountTypesConfig: CrudPageConfig = {
  title: "Account Types",
  description: "Configure account types used for classification and reporting.",
  entityName: "Account Type",
  columns: [
    { key: "name", label: "Type Name" },
    { key: "normalBalance", label: "Normal Balance" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Type Name", placeholder: "e.g. Bank" },
    {
      key: "normalBalance",
      label: "Normal Balance",
      type: "select",
      options: [
        { label: "Debit", value: "Debit" },
        { label: "Credit", value: "Credit" },
      ],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "Balance Sheet", value: "Balance Sheet" },
        { label: "Profit & Loss", value: "Profit & Loss" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ],
  initialRows: [
    {
      id: "TYP-001",
      name: "Cash",
      normalBalance: "Debit",
      category: "Balance Sheet",
      status: "Active",
    },
    {
      id: "TYP-002",
      name: "Bank",
      normalBalance: "Debit",
      category: "Balance Sheet",
      status: "Active",
    },
    {
      id: "TYP-003",
      name: "Payable",
      normalBalance: "Credit",
      category: "Balance Sheet",
      status: "Active",
    },
    {
      id: "TYP-004",
      name: "Income",
      normalBalance: "Credit",
      category: "Profit & Loss",
      status: "Active",
    },
  ],
};
