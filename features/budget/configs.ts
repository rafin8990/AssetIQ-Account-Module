import type { CrudPageConfig } from "@/features/crud/types";

import { costCenters, departments } from "./data";

export const costCentersConfig: CrudPageConfig = {
  title: "Cost Centers",
  description: "Define cost centers for tracking spend against budgets.",
  entityName: "Cost Center",
  columns: [
    { key: "name", label: "Cost Center" },
    { key: "code", label: "Code" },
    { key: "manager", label: "Manager" },
    { key: "department", label: "Department" },
    {
      key: "budgetLimit",
      label: "Budget Limit",
      className: "text-right tabular-nums",
    },
    { key: "spent", label: "Spent", className: "text-right tabular-nums" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Name", placeholder: "e.g. Admin Office" },
    { key: "code", label: "Code", placeholder: "e.g. CC-ADM" },
    { key: "manager", label: "Manager", placeholder: "Manager name" },
    {
      key: "department",
      label: "Department",
      type: "select",
      options: departments.map((d) => ({ label: d, value: d })),
    },
    {
      key: "budgetLimit",
      label: "Budget limit",
      type: "number",
      placeholder: "0",
    },
    {
      key: "spent",
      label: "Spent to date",
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
  initialRows: costCenters.map((cc) => ({
    id: cc.id,
    name: cc.name,
    code: cc.code,
    manager: cc.manager,
    department: cc.department,
    budgetLimit: cc.budgetLimit,
    spent: cc.spent,
    status: cc.status,
  })),
};
