"use client";

import { useMemo } from "react";

import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from "@/features/accounts-receivable/api/customers";
import { customersConfig } from "@/features/accounts-receivable/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function CustomersPage() {
  const config = useMemo<CrudPageConfig>(
    () => ({
      ...customersConfig,
      api: {
        list: listCustomers,
        create: createCustomer,
        update: updateCustomer,
        delete: deleteCustomer,
      },
    }),
    []
  );

  return <CrudPage config={config} />;
}
