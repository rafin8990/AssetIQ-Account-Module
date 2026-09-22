"use client";

import { useEffect, useMemo, useState } from "react";

import { listAccounts } from "@/features/chart-of-accounts/api/accounts";
import {
  createOpeningBalance,
  deleteOpeningBalance,
  listOpeningBalances,
  updateOpeningBalance,
} from "@/features/chart-of-accounts/api/opening-balances";
import { openingBalanceConfig } from "@/features/chart-of-accounts/configs";
import { listFinancialYears } from "@/features/settings/api/financial-years";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function OpeningBalancePage() {
  const [accountOptions, setAccountOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [yearOptions, setYearOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [accounts, years] = await Promise.all([
          listAccounts(),
          listFinancialYears(),
        ]);
        if (cancelled) return;
        setAccountOptions(
          accounts.map((account) => ({
            label: String(account.name),
            value: String(account.id),
          }))
        );
        setYearOptions(
          years.map((year) => ({
            label: String(year.name),
            value: String(year.id),
          }))
        );
        setOptionsError(null);
      } catch (err) {
        if (cancelled) return;
        setOptionsError(
          err instanceof Error
            ? err.message
            : "Failed to load accounts or financial years"
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const config = useMemo<CrudPageConfig>(
    () => ({
      ...openingBalanceConfig,
      fields: openingBalanceConfig.fields.map((field) => {
        if (field.key === "account_id") {
          return { ...field, options: accountOptions };
        }
        if (field.key === "financial_year_id") {
          return { ...field, options: yearOptions };
        }
        return field;
      }),
      api: {
        list: listOpeningBalances,
        create: createOpeningBalance,
        update: updateOpeningBalance,
        delete: deleteOpeningBalance,
      },
    }),
    [accountOptions, yearOptions]
  );

  return (
    <div className="flex flex-col gap-3">
      {optionsError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {optionsError}
        </div>
      ) : null}
      <CrudPage config={config} />
    </div>
  );
}
