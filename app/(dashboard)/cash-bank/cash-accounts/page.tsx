"use client";

import { useEffect, useMemo, useState } from "react";

import { listAccountGroups } from "@/features/chart-of-accounts/api/account-groups";
import {
  createCashAccount,
  deleteAccount,
  listCashAccountRows,
  updateCashAccount,
} from "@/features/chart-of-accounts/api/accounts";
import { cashAccountsConfig } from "@/features/cash-bank/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function CashAccountsPage() {
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const groups = await listAccountGroups();
        if (cancelled) return;
        setGroupOptions(
          groups.map((group) => ({
            label: String(group.name),
            value: String(group.id),
          }))
        );
        setGroupsError(null);
      } catch (err) {
        if (cancelled) return;
        setGroupsError(
          err instanceof Error ? err.message : "Failed to load account groups"
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const config = useMemo<CrudPageConfig>(
    () => ({
      ...cashAccountsConfig,
      fields: cashAccountsConfig.fields.map((field) =>
        field.key === "group_id"
          ? { ...field, options: groupOptions }
          : field
      ),
      api: {
        list: listCashAccountRows,
        create: createCashAccount,
        update: updateCashAccount,
        delete: deleteAccount,
      },
    }),
    [groupOptions]
  );

  return (
    <div className="flex flex-col gap-3">
      {groupsError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {groupsError}
        </div>
      ) : null}
      <CrudPage config={config} />
    </div>
  );
}
