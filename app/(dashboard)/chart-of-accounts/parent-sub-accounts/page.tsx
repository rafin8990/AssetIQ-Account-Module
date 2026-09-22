"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createParentSubAccount,
  deleteParentSubAccount,
  listParentOptions,
  listParentSubAccounts,
  updateParentSubAccount,
} from "@/features/chart-of-accounts/api/parent-sub-accounts";
import { parentSubAccountsConfig } from "@/features/chart-of-accounts/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function ParentSubAccountsPage() {
  const [parentOptions, setParentOptions] = useState<
    { label: string; value: string }[]
  >([{ label: "None (Root)", value: "none" }]);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const refreshParentOptions = useCallback(async () => {
    try {
      const options = await listParentOptions();
      setParentOptions(options);
      setOptionsError(null);
    } catch (err) {
      setOptionsError(
        err instanceof Error ? err.message : "Failed to load parent accounts"
      );
    }
  }, []);

  useEffect(() => {
    void refreshParentOptions();
  }, [refreshParentOptions]);

  const api = useMemo(
    () => ({
      list: listParentSubAccounts,
      create: async (payload: Record<string, string | number>) => {
        const created = await createParentSubAccount(payload);
        void refreshParentOptions();
        return created;
      },
      update: async (id: string, payload: Record<string, string | number>) => {
        const updated = await updateParentSubAccount(id, payload);
        void refreshParentOptions();
        return updated;
      },
      delete: async (id: string) => {
        await deleteParentSubAccount(id);
        void refreshParentOptions();
      },
    }),
    [refreshParentOptions]
  );

  const config = useMemo<CrudPageConfig>(
    () => ({
      ...parentSubAccountsConfig,
      fields: parentSubAccountsConfig.fields.map((field) =>
        field.key === "parent_id"
          ? { ...field, options: parentOptions }
          : field
      ),
      api,
    }),
    [api, parentOptions]
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
