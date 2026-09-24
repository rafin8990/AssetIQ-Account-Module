"use client";

import { useMemo } from "react";

import {
  createVendor,
  deleteVendor,
  listVendorRows,
  updateVendor,
} from "@/features/accounts-payable/api/vendors";
import { suppliersConfig } from "@/features/accounts-payable/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function SuppliersPage() {
  const config = useMemo<CrudPageConfig>(
    () => ({
      ...suppliersConfig,
      api: {
        list: listVendorRows,
        create: createVendor,
        update: updateVendor,
        delete: deleteVendor,
      },
    }),
    []
  );

  return <CrudPage config={config} />;
}
