import { VoucherEntryForm } from "@/features/vouchers/voucher-entry-form";

export default function ContraVoucherPage() {
  return (
    <VoucherEntryForm
      type="contra"
      description="Transfer funds between cash and bank accounts without affecting P&L."
    />
  );
}
