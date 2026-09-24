import type { CrudPageConfig } from "@/features/crud/types";

export const customersConfig: CrudPageConfig = {
  title: "Customers",
  description: "Manage customer profiles used for receivables and invoicing.",
  entityName: "Customer",
  columns: [
    { key: "customer_code", label: "Code" },
    { key: "customer_name", label: "Customer" },
    { key: "customer_type", label: "Type" },
    { key: "contact_person", label: "Contact" },
    { key: "mobile_no", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
  ],
  fields: [
    {
      key: "customer_name",
      label: "Customer name",
      placeholder: "e.g. Nova Retail",
    },
    {
      key: "customer_type",
      label: "Customer type",
      type: "select",
      required: false,
      options: [
        { label: "Individual", value: "Individual" },
        { label: "Business", value: "Business" },
        { label: "Government", value: "Government" },
        { label: "NGO", value: "NGO" },
        { label: "Other", value: "Other" },
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
      key: "phone",
      label: "Phone",
      placeholder: "+1 555-0100",
      required: false,
    },
    {
      key: "mobile_no",
      label: "Mobile",
      placeholder: "+1 555-0101",
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

export const customerInvoicesConfig: CrudPageConfig = {
  title: "Customer Invoices",
  description: "Create and track sales invoices issued to customers.",
  entityName: "Invoice",
  columns: [
    { key: "invoice_no", label: "Invoice No" },
    { key: "invoice_kind", label: "Kind" },
    { key: "source_order_code", label: "Order No" },
    { key: "source", label: "Source" },
    { key: "customer", label: "Customer" },
    { key: "issue_date", label: "Issue Date" },
    { key: "due_date", label: "Due Date" },
    { key: "amount", label: "Amount", className: "text-right tabular-nums" },
    { key: "paid_amount", label: "Paid", className: "text-right tabular-nums" },
    { key: "balance", label: "Balance", className: "text-right tabular-nums" },
    { key: "status", label: "Status" },
  ],
  fields: [
    {
      key: "invoice_no",
      label: "Invoice No",
      placeholder: "Auto if blank (INV-YYYY-####)",
      required: false,
    },
    {
      key: "customer",
      label: "Customer",
      type: "select",
      options: [],
    },
    {
      key: "customer_code",
      label: "Customer code",
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
        { label: "Sent", value: "sent" },
        { label: "Partial", value: "partial" },
        { label: "Paid", value: "paid" },
        { label: "Overdue", value: "overdue" },
      ],
    },
  ],
  initialRows: [],
  extraActions: [
    {
      label: "Print",
      href: (row) =>
        `/accounts-receivable/customer-invoices/print?no=${encodeURIComponent(String(row.invoice_no ?? ""))}`,
    },
  ],
};
