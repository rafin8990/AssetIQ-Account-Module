import type { CrudPageConfig } from "@/features/crud/types";

export const financialYearConfig: CrudPageConfig = {
  title: "Financial Year",
  description: "Configure active and upcoming financial years.",
  entityName: "Financial Year",
  columns: [
    { key: "name", label: "Year" },
    { key: "start_date", label: "Start" },
    { key: "end_date", label: "End" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Name", placeholder: "2025-2026" },
    { key: "start_date", label: "Start date", placeholder: "YYYY-MM-DD" },
    { key: "end_date", label: "End date", placeholder: "YYYY-MM-DD" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Upcoming", value: "upcoming" },
        { label: "Closed", value: "closed" },
      ],
    },
  ],
  initialRows: [],
};

export const currencyConfig: CrudPageConfig = {
  title: "Currency",
  description: "Base and multi-currency settings for the ledger.",
  entityName: "Currency",
  columns: [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "symbol", label: "Symbol" },
    {
      key: "exchange_rate",
      label: "Exchange Rate",
      className: "text-right tabular-nums",
    },
    { key: "is_base", label: "Base" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "code", label: "Code", placeholder: "BDT" },
    { key: "name", label: "Name", placeholder: "Bangladeshi Taka" },
    { key: "symbol", label: "Symbol", placeholder: "৳" },
    { key: "exchange_rate", label: "Exchange rate", type: "number" },
    {
      key: "is_base",
      label: "Base currency",
      type: "select",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ],
  initialRows: [],
};

export const accountSettingsConfig: CrudPageConfig = {
  title: "Account Settings",
  description: "Company-level accounting preferences and defaults.",
  entityName: "Setting",
  columns: [
    { key: "key", label: "Setting" },
    { key: "value", label: "Value" },
    { key: "group", label: "Group" },
  ],
  fields: [
    { key: "key", label: "Setting key", placeholder: "company_name" },
    { key: "value", label: "Value", placeholder: "Value" },
    {
      key: "group",
      label: "Group",
      type: "select",
      options: [
        { label: "Company", value: "Company" },
        { label: "Ledger", value: "Ledger" },
        { label: "Display", value: "Display" },
      ],
    },
  ],
  initialRows: [
    {
      id: "S1",
      key: "Company Name",
      value: "AssetIQ Accounts",
      group: "Company",
    },
    {
      id: "S2",
      key: "Bookkeeping Method",
      value: "Accrual",
      group: "Ledger",
    },
    {
      id: "S3",
      key: "Decimal Places",
      value: "2",
      group: "Display",
    },
  ],
};

export const voucherNumberFormatConfig: CrudPageConfig = {
  title: "Voucher Number Format",
  description: "Configure auto-number prefixes and sequences for vouchers.",
  entityName: "Format",
  columns: [
    { key: "voucherType", label: "Voucher Type" },
    { key: "prefix", label: "Prefix" },
    { key: "pattern", label: "Pattern" },
    { key: "nextNumber", label: "Next No", className: "text-right" },
  ],
  fields: [
    { key: "voucherType", label: "Voucher type", placeholder: "Payment" },
    { key: "prefix", label: "Prefix", placeholder: "PV" },
    { key: "pattern", label: "Pattern", placeholder: "PV-{YYYY}-{####}" },
    { key: "nextNumber", label: "Next number", type: "number" },
  ],
  initialRows: [
    {
      id: "VN1",
      voucherType: "Payment",
      prefix: "PV",
      pattern: "PV-{YYYY}-{####}",
      nextNumber: 14,
    },
    {
      id: "VN2",
      voucherType: "Receipt",
      prefix: "RV",
      pattern: "RV-{YYYY}-{####}",
      nextNumber: 10,
    },
    {
      id: "VN3",
      voucherType: "Journal",
      prefix: "JV",
      pattern: "JV-{YYYY}-{####}",
      nextNumber: 6,
    },
  ],
};

export const paymentMethodsConfig: CrudPageConfig = {
  title: "Payment Methods",
  description: "Available payment and receipt methods.",
  entityName: "Payment Method",
  columns: [
    { key: "name", label: "Method" },
    { key: "type", label: "Type" },
    { key: "ledgerAccount", label: "Ledger Account" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Name", placeholder: "Bank Transfer" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Cash", value: "Cash" },
        { label: "Bank", value: "Bank" },
        { label: "Card", value: "Card" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      key: "ledgerAccount",
      label: "Ledger account",
      placeholder: "Bank — Operating",
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
      id: "PM1",
      name: "Cash",
      type: "Cash",
      ledgerAccount: "Cash in Hand",
      status: "Active",
    },
    {
      id: "PM2",
      name: "Bank Transfer",
      type: "Bank",
      ledgerAccount: "Bank — Operating",
      status: "Active",
    },
    {
      id: "PM3",
      name: "Cheque",
      type: "Bank",
      ledgerAccount: "Bank — Operating",
      status: "Active",
    },
    {
      id: "PM4",
      name: "Card",
      type: "Card",
      ledgerAccount: "Bank — Operating",
      status: "Inactive",
    },
  ],
};

export const taxVatRatesConfig: CrudPageConfig = {
  title: "Tax / VAT Rates",
  description: "Maintain tax and VAT rate master data.",
  entityName: "Tax Rate",
  columns: [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "rate", label: "Rate %", className: "text-right tabular-nums" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Name", placeholder: "Standard VAT" },
    { key: "code", label: "Code", placeholder: "VAT15" },
    { key: "rate", label: "Rate %", type: "number" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "VAT", value: "VAT" },
        { label: "Withholding", value: "Withholding" },
        { label: "Sales Tax", value: "Sales Tax" },
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
      id: "TX1",
      name: "Standard VAT",
      code: "VAT15",
      rate: 15,
      type: "VAT",
      status: "Active",
    },
    {
      id: "TX2",
      name: "Zero Rated VAT",
      code: "VAT0",
      rate: 0,
      type: "VAT",
      status: "Active",
    },
    {
      id: "TX3",
      name: "Withholding Tax",
      code: "WHT5",
      rate: 5,
      type: "Withholding",
      status: "Active",
    },
  ],
};

export const settingsCostCentersConfig: CrudPageConfig = {
  title: "Cost Centers",
  description: "Configure cost centers used across budgets and vouchers.",
  entityName: "Cost Center",
  columns: [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "manager", label: "Manager" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "code", label: "Code", placeholder: "CC-ADM" },
    { key: "name", label: "Name", placeholder: "Admin Office" },
    { key: "manager", label: "Manager", placeholder: "Manager name" },
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
      id: "CC1",
      code: "CC-ADM",
      name: "Admin Office",
      manager: "A. Rahman",
      status: "Active",
    },
    {
      id: "CC2",
      code: "CC-SAL",
      name: "Field Sales",
      manager: "N. Chowdhury",
      status: "Active",
    },
  ],
};

export const branchesConfig: CrudPageConfig = {
  title: "Branches",
  description: "Company branches and locations.",
  entityName: "Branch",
  columns: [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "code", label: "Code", placeholder: "BR-NTH" },
    { key: "name", label: "Name", placeholder: "North Branch" },
    { key: "city", label: "City", placeholder: "City" },
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
      id: "BR1",
      code: "HO",
      name: "Head Office",
      city: "Dhaka",
      status: "Active",
    },
    {
      id: "BR2",
      code: "BR-NTH",
      name: "North Branch",
      city: "Chittagong",
      status: "Active",
    },
    {
      id: "BR3",
      code: "BR-STH",
      name: "South Branch",
      city: "Khulna",
      status: "Active",
    },
  ],
};

export const rolesPermissionsConfig: CrudPageConfig = {
  title: "Roles & Permissions",
  description: "Assign module access permissions to roles.",
  entityName: "Role",
  columns: [
    { key: "role", label: "Role" },
    { key: "users", label: "Users", className: "text-right" },
    { key: "modules", label: "Modules" },
    { key: "access", label: "Access" },
  ],
  fields: [
    { key: "role", label: "Role", placeholder: "Accountant" },
    { key: "users", label: "User count", type: "number" },
    {
      key: "modules",
      label: "Modules",
      placeholder: "Vouchers, Ledger",
    },
    {
      key: "access",
      label: "Access",
      type: "select",
      options: [
        { label: "Full", value: "Full" },
        { label: "Create/Edit", value: "Create/Edit" },
        { label: "View Only", value: "View Only" },
        { label: "Approve", value: "Approve" },
      ],
    },
  ],
  initialRows: [
    {
      id: "R1",
      role: "Admin",
      users: 2,
      modules: "All",
      access: "Full",
    },
    {
      id: "R2",
      role: "Finance Manager",
      users: 1,
      modules: "Approvals, Reports",
      access: "Approve",
    },
    {
      id: "R3",
      role: "Accountant",
      users: 3,
      modules: "Vouchers, Ledger",
      access: "Create/Edit",
    },
    {
      id: "R4",
      role: "Cashier",
      users: 2,
      modules: "Cash & Bank",
      access: "Create/Edit",
    },
  ],
};

export const approvalWorkflowConfig: CrudPageConfig = {
  title: "Approval Workflow",
  description: "Configure multi-step approval workflows by document type.",
  entityName: "Workflow",
  columns: [
    { key: "name", label: "Workflow" },
    { key: "document", label: "Document" },
    { key: "steps", label: "Steps", className: "text-right" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Workflow name", placeholder: "PV Standard" },
    {
      key: "document",
      label: "Document",
      type: "select",
      options: [
        { label: "Payment Voucher", value: "Payment Voucher" },
        { label: "Receipt Voucher", value: "Receipt Voucher" },
        { label: "Journal Voucher", value: "Journal Voucher" },
        { label: "Supplier Bill", value: "Supplier Bill" },
      ],
    },
    { key: "steps", label: "Steps", type: "number" },
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
      id: "WF1",
      name: "PV Standard",
      document: "Payment Voucher",
      steps: 3,
      status: "Active",
    },
    {
      id: "WF2",
      name: "RV Fast Track",
      document: "Receipt Voucher",
      steps: 2,
      status: "Active",
    },
    {
      id: "WF3",
      name: "JV Dual Review",
      document: "Journal Voucher",
      steps: 2,
      status: "Active",
    },
  ],
};
