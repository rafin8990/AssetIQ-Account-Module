"use client";

import { useMemo } from "react";

import {
  createCurrency,
  deleteCurrency,
  listCurrencies,
  updateCurrency,
} from "@/features/settings/api/currencies";
import { currencyConfig } from "@/features/settings/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function CurrencySettingsPage() {
  const config = useMemo<CrudPageConfig>(
    () => ({
      ...currencyConfig,
      api: {
        list: listCurrencies,
        create: createCurrency,
        update: updateCurrency,
        delete: deleteCurrency,
      },
    }),
    []
  );

  return <CrudPage config={config} />;
}
