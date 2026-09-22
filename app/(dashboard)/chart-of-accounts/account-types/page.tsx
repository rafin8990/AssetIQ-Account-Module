"use client";

import { useMemo } from "react";

import {
  createAccountType,
  deleteAccountType,
  listAccountTypes,
  updateAccountType,
} from "@/features/chart-of-accounts/api/account-types";
import { accountTypesConfig } from "@/features/chart-of-accounts/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function AccountTypesPage() {
  const config = useMemo<CrudPageConfig>(
    () => ({
      ...accountTypesConfig,
      api: {
        list: listAccountTypes,
        create: createAccountType,
        update: updateAccountType,
        delete: deleteAccountType,
      },
    }),
    []
  );

  return <CrudPage config={config} />;
}
