"use client";

import { useMemo } from "react";

import {
  createFinancialYear,
  deleteFinancialYear,
  listFinancialYears,
  updateFinancialYear,
} from "@/features/settings/api/financial-years";
import { financialYearConfig } from "@/features/settings/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function FinancialYearSettingsPage() {
  const config = useMemo<CrudPageConfig>(
    () => ({
      ...financialYearConfig,
      api: {
        list: listFinancialYears,
        create: createFinancialYear,
        update: updateFinancialYear,
        delete: deleteFinancialYear,
      },
    }),
    []
  );

  return <CrudPage config={config} />;
}
