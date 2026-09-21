import type { CrudPageConfig } from "@/features/crud/types";

import { accountingPeriods, fiscalYears, journalEntries } from "./data";

export const openingBalanceConfig: CrudPageConfig = {
  title: "Opening Balance",
  description: "Carry forward opening debit/credit balances into the fiscal year.",
  entityName: "Opening Balance",
  columns: [
    { key: "account", label: "Account" },
    { key: "fiscalYear", label: "Fiscal Year" },
    { key: "debit", label: "Debit", className: "text-right tabular-nums" },
    { key: "credit", label: "Credit", className: "text-right tabular-nums" },
  ],
  fields: [
    { key: "account", label: "Account", placeholder: "Account name" },
    {
      key: "fiscalYear",
      label: "Fiscal Year",
      type: "select",
      options: fiscalYears.map((fy) => ({ label: fy.name, value: fy.name })),
    },
    { key: "debit", label: "Debit", type: "number", required: false },
    { key: "credit", label: "Credit", type: "number", required: false },
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
      account: "Accounts Payable",
      fiscalYear: "2025-2026",
      debit: 0,
      credit: 28600,
    },
  ],
};

export const fiscalYearConfig: CrudPageConfig = {
  title: "Fiscal Year",
  description: "Define and manage accounting fiscal years.",
  entityName: "Fiscal Year",
  columns: [
    { key: "name", label: "Fiscal Year" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Name", placeholder: "2025-2026" },
    { key: "startDate", label: "Start date", placeholder: "YYYY-MM-DD" },
    { key: "endDate", label: "End date", placeholder: "YYYY-MM-DD" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Upcoming", value: "Upcoming" },
        { label: "Active", value: "Active" },
        { label: "Closed", value: "Closed" },
      ],
    },
  ],
  initialRows: fiscalYears.map((fy) => ({
    id: fy.id,
    name: fy.name,
    startDate: fy.startDate,
    endDate: fy.endDate,
    status: fy.status,
  })),
};

export const accountingPeriodConfig: CrudPageConfig = {
  title: "Accounting Period",
  description: "Configure monthly or custom accounting periods within a fiscal year.",
  entityName: "Period",
  columns: [
    { key: "name", label: "Period" },
    { key: "fiscalYear", label: "Fiscal Year" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "name", label: "Period name", placeholder: "Mar 2026" },
    {
      key: "fiscalYear",
      label: "Fiscal Year",
      type: "select",
      options: fiscalYears.map((fy) => ({ label: fy.name, value: fy.name })),
    },
    { key: "startDate", label: "Start date", placeholder: "YYYY-MM-DD" },
    { key: "endDate", label: "End date", placeholder: "YYYY-MM-DD" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Open", value: "Open" },
        { label: "Soft Locked", value: "Soft Locked" },
        { label: "Closed", value: "Closed" },
      ],
    },
  ],
  initialRows: accountingPeriods.map((period) => ({
    id: period.id,
    name: period.name,
    fiscalYear: period.fiscalYear,
    startDate: period.startDate,
    endDate: period.endDate,
    status: period.status,
  })),
};

export const journalEntriesConfig: CrudPageConfig = {
  title: "Journal Entries",
  description: "Browse posted and draft journal entries.",
  entityName: "Journal Entry",
  columns: [
    { key: "entryNo", label: "Entry No" },
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "reference", label: "Reference" },
    { key: "debit", label: "Debit", className: "text-right tabular-nums" },
    { key: "credit", label: "Credit", className: "text-right tabular-nums" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "entryNo", label: "Entry No", placeholder: "JE-2026-0001" },
    { key: "date", label: "Date", placeholder: "YYYY-MM-DD" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Journal", value: "Journal" },
        { label: "Adjusting", value: "Adjusting" },
        { label: "Closing", value: "Closing" },
        { label: "Opening", value: "Opening" },
      ],
    },
    { key: "reference", label: "Reference", placeholder: "Reference" },
    {
      key: "narration",
      label: "Narration",
      type: "textarea",
      placeholder: "Entry description",
    },
    { key: "debit", label: "Debit", type: "number" },
    { key: "credit", label: "Credit", type: "number" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Draft", value: "Draft" },
        { label: "Posted", value: "Posted" },
        { label: "Reversed", value: "Reversed" },
      ],
    },
  ],
  initialRows: journalEntries.map((entry) => ({
    id: entry.id,
    entryNo: entry.entryNo,
    date: entry.date,
    type: entry.type,
    reference: entry.reference,
    narration: entry.narration,
    debit: entry.debit,
    credit: entry.credit,
    status: entry.status,
  })),
};
