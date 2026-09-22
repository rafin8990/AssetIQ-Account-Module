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
        { label: "Asset", value: "asset" },
        { label: "Liability", value: "liability" },
        { label: "Equity", value: "equity" },
        { label: "Income", value: "income" },
        { label: "Expense", value: "expense" },
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
      key: "group_id",
      label: "Group",
      type: "select",
      options: [],
    },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Cash", value: "cash" },
        { label: "Bank", value: "bank" },
        { label: "Receivable", value: "receivable" },
        { label: "Payable", value: "payable" },
        { label: "Expense", value: "expense" },
        { label: "Income", value: "income" },
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
      key: "parent_id",
      label: "Parent Account",
      type: "select",
      options: [{ label: "None (Root)", value: "none" }],
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      options: [
        { label: "Parent", value: "parent" },
        { label: "Sub", value: "sub" },
      ],
    },
    { key: "code", label: "Code", placeholder: "e.g. 1001-01" },
  ],
  initialRows: [],
};

export const openingBalanceConfig: CrudPageConfig = {
  title: "Opening Balance",
  description: "Set opening debit/credit balances for the fiscal period.",
  entityName: "Opening Balance",
  columns: [
    { key: "account", label: "Account" },
    { key: "financial_year", label: "Fiscal Year" },
    { key: "debit", label: "Debit", className: "text-right tabular-nums" },
    { key: "credit", label: "Credit", className: "text-right tabular-nums" },
  ],
  fields: [
    {
      key: "account_id",
      label: "Account",
      type: "select",
      options: [],
    },
    {
      key: "financial_year_id",
      label: "Fiscal Year",
      type: "select",
      options: [],
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
  initialRows: [],
};

export const accountTypesConfig: CrudPageConfig = {
  title: "Account Types",
  description: "Configure account types used for classification and reporting.",
  entityName: "Account Type",
  columns: [
    { key: "name", label: "Type Name" },
    { key: "normal_balance", label: "Normal Balance" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Type Name", placeholder: "e.g. Bank" },
    {
      key: "normal_balance",
      label: "Normal Balance",
      type: "select",
      options: [
        { label: "Debit", value: "debit" },
        { label: "Credit", value: "credit" },
      ],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "Balance Sheet", value: "balance_sheet" },
        { label: "Profit & Loss", value: "profit_and_loss" },
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
