import type { CrudPageConfig } from "@/features/crud/types";

export const suppliersConfig: CrudPageConfig = {
  title: "Suppliers / Vendors",
  description:
    "Manage supplier and vendor profiles from the Vendor service (live API).",
  entityName: "Vendor",
  apiSourceLabel: "Live data from Vendor API",
  columns: [
    { key: "vendor_code", label: "Code" },
    { key: "vendor_name", label: "Vendor" },
    { key: "vendor_type", label: "Type" },
    { key: "contact_person", label: "Contact" },
    { key: "mobile_no", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
  ],
  fields: [
    {
      key: "vendor_name",
      label: "Vendor name",
      placeholder: "e.g. Horizon Supplies",
    },
    {
      key: "vendor_type",
      label: "Vendor type",
      type: "select",
      required: false,
      options: [
        { label: "Supplier", value: "Supplier" },
        { label: "Manufacturer", value: "Manufacturer" },
        { label: "Distributor", value: "Distributor" },
        { label: "Service Provider", value: "Service Provider" },
        { label: "Contractor", value: "Contractor" },
      ],
    },
    {
      key: "contact_person",
      label: "Contact person",
      placeholder: "e.g. Jane Doe",
      required: false,
    },
    {
      key: "designation",
      label: "Designation",
      placeholder: "e.g. Accounts Manager",
      required: false,
    },
    {
      key: "mobile_no",
      label: "Mobile",
      placeholder: "+1 555-0101",
    },
    {
      key: "phone",
      label: "Phone",
      placeholder: "+1 555-0100",
      required: false,
    },
    {
      key: "email",
      label: "Email",
      placeholder: "billing@example.com",
      required: false,
    },
    {
      key: "address",
      label: "Address",
      type: "textarea",
      placeholder: "Street, city, country",
      required: false,
    },
  ],
  initialRows: [],
};

export const supplierBillsConfig: CrudPageConfig = {
  title: "Supplier Bills",
  description:
    "Purchase bills synced from Procurement POs (and manual bills) via Accounts API.",
  entityName: "Bill",
  apiSourceLabel: "Live data from Accounts API",
  columns: [
    { key: "bill_no", label: "Bill No" },
    { key: "source_po_code", label: "PO No" },
    { key: "source", label: "Source" },
    { key: "vendor", label: "Vendor" },
    { key: "issue_date", label: "Issue Date" },
    { key: "due_date", label: "Due Date" },
    { key: "amount", label: "Amount", className: "text-right tabular-nums" },
    { key: "paid_amount", label: "Paid", className: "text-right tabular-nums" },
    { key: "balance", label: "Balance", className: "text-right tabular-nums" },
    { key: "status", label: "Status" },
  ],
  fields: [
    {
      key: "bill_no",
      label: "Bill No",
      placeholder: "Auto if blank (BILL-YYYY-####)",
      required: false,
    },
    {
      key: "vendor",
      label: "Vendor",
      type: "select",
      options: [],
    },
    {
      key: "vendor_code",
      label: "Vendor code",
      placeholder: "Optional code",
      required: false,
    },
    {
      key: "issue_date",
      label: "Issue date",
      placeholder: "YYYY-MM-DD",
    },
    {
      key: "due_date",
      label: "Due date",
      placeholder: "YYYY-MM-DD",
    },
    { key: "amount", label: "Amount", type: "number", placeholder: "0" },
    {
      key: "paid_amount",
      label: "Paid amount",
      type: "number",
      placeholder: "0",
      required: false,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Open", value: "open" },
        { label: "Partial", value: "partial" },
        { label: "Paid", value: "paid" },
        { label: "Overdue", value: "overdue" },
      ],
    },
  ],
  initialRows: [],
  extraActions: [
    {
      label: "View",
      href: (row) => `/accounts-payable/supplier-bills/${row.id}`,
    },
  ],
};
