import type { CrudPageConfig } from "@/features/crud/types";

import { bankAccounts, cashAccounts } from "./data";

export const cashAccountsConfig: CrudPageConfig = {
  title: "Cash Accounts",
  description: "Maintain cash and petty cash accounts used for daily operations.",
  entityName: "Cash Account",
  columns: [
    { key: "name", label: "Account Name" },
    { key: "code", label: "Code" },
    {
      key: "openingBalance",
      label: "Opening",
      className: "text-right tabular-nums",
    },
    {
      key: "currentBalance",
      label: "Current Balance",
      className: "text-right tabular-nums",
    },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Account name", placeholder: "e.g. Cash in Hand" },
    { key: "code", label: "Code", placeholder: "e.g. 1001" },
    {
      key: "openingBalance",
      label: "Opening balance",
      type: "number",
      placeholder: "0",
    },
    {
      key: "currentBalance",
      label: "Current balance",
      type: "number",
      placeholder: "0",
      required: false,
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
  initialRows: cashAccounts.map((account) => ({
    id: account.id,
    name: account.name,
    code: account.code,
    openingBalance: account.openingBalance,
    currentBalance: account.currentBalance,
    status: account.status,
  })),
};

export const bankAccountsConfig: CrudPageConfig = {
  title: "Bank Accounts",
  description: "Configure operating, payroll, and savings bank accounts.",
  entityName: "Bank Account",
  columns: [
    { key: "name", label: "Account Name" },
    { key: "bankName", label: "Bank" },
    { key: "accountNo", label: "Account No" },
    { key: "code", label: "Code" },
    {
      key: "currentBalance",
      label: "Balance",
      className: "text-right tabular-nums",
    },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Account name", placeholder: "e.g. Bank — Operating" },
    { key: "bankName", label: "Bank name", placeholder: "Bank name" },
    { key: "accountNo", label: "Account number", placeholder: "****0000" },
    { key: "code", label: "Code", placeholder: "e.g. 1002" },
    {
      key: "openingBalance",
      label: "Opening balance",
      type: "number",
      placeholder: "0",
    },
    {
      key: "currentBalance",
      label: "Current balance",
      type: "number",
      placeholder: "0",
      required: false,
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
  initialRows: bankAccounts.map((account) => ({
    id: account.id,
    name: account.name,
    bankName: account.bankName ?? "",
    accountNo: account.accountNo ?? "",
    code: account.code,
    openingBalance: account.openingBalance,
    currentBalance: account.currentBalance,
    status: account.status,
  })),
};
