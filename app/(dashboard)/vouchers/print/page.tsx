import { Suspense } from "react";

import { VoucherPrintView } from "@/features/vouchers/voucher-print-view";

export default function VoucherPrintPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Loading print preview…
        </div>
      }
    >
      <VoucherPrintView />
    </Suspense>
  );
}
