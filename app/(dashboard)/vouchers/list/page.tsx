"use client";

import { useCallback, useState } from "react";

import {
  updateVoucherStatus,
} from "@/features/vouchers/api/vouchers";
import { VoucherListView } from "@/features/vouchers/voucher-list-view";
import type { Voucher, VoucherStatus } from "@/features/vouchers/data";

export default function VoucherListPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStatusChange = useCallback(
    async (voucher: Voucher, status: VoucherStatus) => {
      await updateVoucherStatus(voucher.id, status);
      setRefreshKey((key) => key + 1);
    },
    []
  );

  return (
    <VoucherListView
      key={refreshKey}
      title="Voucher List"
      description="Live vouchers from the accounts API. Approve or reject pending rows from Actions."
      showWorkflowActions
      onStatusChange={handleStatusChange}
    />
  );
}
