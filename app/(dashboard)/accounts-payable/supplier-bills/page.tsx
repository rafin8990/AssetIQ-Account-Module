"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createSupplierBill,
  deleteSupplierBill,
  listSupplierBillRows,
  updateSupplierBill,
} from "@/features/accounts-payable/api/supplier-bills";
import { listVendors } from "@/features/accounts-payable/api/vendors";
import { supplierBillsConfig } from "@/features/accounts-payable/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function SupplierBillsPage() {
  const [vendorOptions, setVendorOptions] = useState<
    { label: string; value: string; code: string }[]
  >([]);

  useEffect(() => {
    void listVendors()
      .then((rows) => {
        setVendorOptions(
          rows
            .map((row) => {
              const name = String(row.vendor_name ?? "").trim();
              const code = String(row.vendor_code ?? "").trim();
              return {
                value: name || code,
                label: code ? `${name} (${code})` : name,
                code,
              };
            })
            .filter((option) => option.value)
        );
      })
      .catch(() => setVendorOptions([]));
  }, []);

  const config = useMemo<CrudPageConfig>(() => {
    const fields = supplierBillsConfig.fields.map((field) => {
      if (field.key !== "vendor") return field;
      return {
        ...field,
        options: vendorOptions.map(({ label, value }) => ({ label, value })),
      };
    });

    return {
      ...supplierBillsConfig,
      fields,
      api: {
        list: listSupplierBillRows,
        create: async (payload) => {
          const selected = vendorOptions.find(
            (option) => option.value === String(payload.vendor ?? "")
          );
          return createSupplierBill({
            ...payload,
            vendor_code:
              payload.vendor_code || selected?.code || "",
          });
        },
        update: async (id, payload) => {
          const selected = vendorOptions.find(
            (option) => option.value === String(payload.vendor ?? "")
          );
          return updateSupplierBill(id, {
            ...payload,
            vendor_code:
              payload.vendor_code || selected?.code || "",
          });
        },
        delete: deleteSupplierBill,
      },
    };
  }, [vendorOptions]);

  return <CrudPage config={config} />;
}
