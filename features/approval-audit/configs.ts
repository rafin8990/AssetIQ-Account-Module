import type { CrudPageConfig } from "@/features/crud/types";

import { approvalLimits } from "./data";

export const approvalLimitsConfig: CrudPageConfig = {
  title: "Approval Limits",
  description: "Define amount thresholds and required approval levels by role.",
  entityName: "Approval Limit",
  columns: [
    { key: "role", label: "Role" },
    { key: "module", label: "Module" },
    {
      key: "minAmount",
      label: "Min Amount",
      className: "text-right tabular-nums",
    },
    {
      key: "maxAmount",
      label: "Max Amount",
      className: "text-right tabular-nums",
    },
    { key: "levels", label: "Levels", className: "text-right" },
  ],
  fields: [
    { key: "role", label: "Role", placeholder: "e.g. Finance Officer" },
    {
      key: "module",
      label: "Module",
      type: "select",
      options: [
        { label: "Payment Voucher", value: "Payment Voucher" },
        { label: "Receipt Voucher", value: "Receipt Voucher" },
        { label: "Journal Voucher", value: "Journal Voucher" },
        { label: "Supplier Bill", value: "Supplier Bill" },
      ],
    },
    { key: "minAmount", label: "Min amount", type: "number" },
    { key: "maxAmount", label: "Max amount", type: "number" },
    { key: "levels", label: "Approval levels", type: "number" },
  ],
  initialRows: approvalLimits.map((limit) => ({
    id: limit.id,
    role: limit.role,
    module: limit.module,
    minAmount: limit.minAmount,
    maxAmount: limit.maxAmount,
    levels: limit.levels,
  })),
};
