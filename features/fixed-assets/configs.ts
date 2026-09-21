import type { CrudPageConfig } from "@/features/crud/types";

import { assetCategories, fixedAssets } from "./data";

export const assetAccountsConfig: CrudPageConfig = {
  title: "Asset Accounts",
  description: "Maintain fixed asset master records and account mapping.",
  entityName: "Asset",
  columns: [
    { key: "code", label: "Code" },
    { key: "name", label: "Asset Name" },
    { key: "category", label: "Category" },
    { key: "cost", label: "Cost", className: "text-right tabular-nums" },
    {
      key: "bookValue",
      label: "Book Value",
      className: "text-right tabular-nums",
    },
    { key: "status", label: "Status" },
  ],
  fields: [
    { key: "code", label: "Asset code", placeholder: "AST-XXX-01" },
    { key: "name", label: "Asset name", placeholder: "Asset description" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: assetCategories.map((c) => ({ label: c, value: c })),
    },
    { key: "purchaseDate", label: "Purchase date", placeholder: "YYYY-MM-DD" },
    { key: "cost", label: "Cost", type: "number" },
    { key: "usefulLifeYears", label: "Useful life (years)", type: "number" },
    {
      key: "method",
      label: "Depreciation method",
      type: "select",
      options: [
        { label: "Straight Line", value: "Straight Line" },
        { label: "Reducing Balance", value: "Reducing Balance" },
      ],
    },
    {
      key: "salvageValue",
      label: "Salvage value",
      type: "number",
      required: false,
    },
    {
      key: "accumulatedDepreciation",
      label: "Accumulated depreciation",
      type: "number",
      required: false,
    },
    {
      key: "bookValue",
      label: "Book value",
      type: "number",
      required: false,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "Active" },
        { label: "Fully Depreciated", value: "Fully Depreciated" },
        { label: "Disposed", value: "Disposed" },
        { label: "Under Revaluation", value: "Under Revaluation" },
      ],
    },
  ],
  initialRows: fixedAssets.map((asset) => ({
    id: asset.id,
    code: asset.code,
    name: asset.name,
    category: asset.category,
    purchaseDate: asset.purchaseDate,
    cost: asset.cost,
    usefulLifeYears: asset.usefulLifeYears,
    method: asset.method,
    salvageValue: asset.salvageValue,
    accumulatedDepreciation: asset.accumulatedDepreciation,
    bookValue: asset.bookValue,
    status: asset.status,
  })),
};
