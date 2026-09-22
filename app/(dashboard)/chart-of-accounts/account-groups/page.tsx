"use client";

import { useMemo } from "react";

import {
  createAccountGroup,
  deleteAccountGroup,
  listAccountGroups,
  updateAccountGroup,
} from "@/features/chart-of-accounts/api/account-groups";
import { accountGroupsConfig } from "@/features/chart-of-accounts/configs";
import { CrudPage } from "@/features/crud/crud-page";
import type { CrudPageConfig } from "@/features/crud/types";

export default function AccountGroupsPage() {
  const config = useMemo<CrudPageConfig>(
    () => ({
      ...accountGroupsConfig,
      api: {
        list: listAccountGroups,
        create: createAccountGroup,
        update: updateAccountGroup,
        delete: deleteAccountGroup,
      },
    }),
    []
  );

  return <CrudPage config={config} />;
}
