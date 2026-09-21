import { VoucherEntryForm } from "@/features/vouchers/voucher-entry-form";

export default function JournalVoucherPage() {
  return (
    <VoucherEntryForm
      type="journal"
      description="Post non-cash adjustments with balanced multi-line debit and credit entries."
    />
  );
}
