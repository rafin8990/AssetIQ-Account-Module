import type { CrudPageConfig } from "@/features/crud/types";

export const cashAccountsConfig: CrudPageConfig = {
  title: "Cash Accounts",
  description:
    "Maintain cash and petty cash accounts from the chart of accounts (live API).",
  entityName: "Cash Account",
  apiSourceLabel: "Live data from Accounts API",
  columns: [
    { key: "name", label: "Account Name" },
    { key: "code", label: "Code" },
    { key: "group", label: "Group" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Account name", placeholder: "e.g. Cash in Hand" },
    { key: "code", label: "Code", placeholder: "e.g. 1001" },
    {
      key: "group_id",
      label: "Group",
      type: "select",
      options: [],
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

export const bankAccountsConfig: CrudPageConfig = {
  title: "Bank Accounts",
  description:
    "Maintain operating, payroll, and savings bank accounts from the chart of accounts (live API).",
  entityName: "Bank Account",
  apiSourceLabel: "Live data from Accounts API",
  columns: [
    { key: "name", label: "Account Name" },
    { key: "code", label: "Code" },
    { key: "group", label: "Group" },
    { key: "status", label: "Status" },
  ],
  fields: [
    {
      key: "name",
      label: "Account name",
      placeholder: "e.g. Bank — Operating",
    },
    { key: "code", label: "Code", placeholder: "e.g. 1002" },
    {
      key: "group_id",
      label: "Group",
      type: "select",
      options: [],
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
