"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createCustomerInvoice,
  deleteCustomerInvoice,
  listCustomerInvoiceRows,
  updateCustomerInvoice,
} from "@/features/accounts-receivable/api/customer-invoices";
import { listCustomers } from "@/features/accounts-receivable/api/customers";
import { customerInvoicesConfig } from "@/features/accounts-receivable/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function CustomerInvoicesPage() {
  const [customerOptions, setCustomerOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    void listCustomers()
      .then((rows) => {
        setCustomerOptions(
          rows
            .filter((row) => String(row.status ?? "active") !== "inactive")
            .map((row) => {
              const name = String(row.customer_name ?? "").trim();
              const code = String(row.customer_code ?? "").trim();
              return {
                value: name || code,
                label: code ? `${name} (${code})` : name,
              };
            })
            .filter((option) => option.value)
        );
      })
      .catch(() => setCustomerOptions([]));
  }, []);

  const config = useMemo<CrudPageConfig>(() => {
    const fields = customerInvoicesConfig.fields.map((field) => {
      if (field.key !== "customer") return field;
      return { ...field, options: customerOptions };
    });

    return {
      ...customerInvoicesConfig,
      fields,
      api: {
        list: listCustomerInvoiceRows,
        create: async (payload) => {
          const selected = customerOptions.find(
            (option) => option.value === String(payload.customer ?? "")
          );
          const codeMatch = selected?.label.match(/\(([^)]+)\)\s*$/);
          return createCustomerInvoice({
            ...payload,
            customer_code:
              payload.customer_code ||
              codeMatch?.[1] ||
              "",
          });
        },
        update: async (id, payload) => {
          const selected = customerOptions.find(
            (option) => option.value === String(payload.customer ?? "")
          );
          const codeMatch = selected?.label.match(/\(([^)]+)\)\s*$/);
          return updateCustomerInvoice(id, {
            ...payload,
            customer_code:
              payload.customer_code ||
              codeMatch?.[1] ||
              "",
          });
        },
        delete: deleteCustomerInvoice,
      },
    };
  }, [customerOptions]);

  return <CrudPage config={config} />;
}
