import { VoucherEntryForm } from "@/features/vouchers/voucher-entry-form";

export default function PaymentVoucherPage() {
  return (
    <VoucherEntryForm
      type="payment"
      description="Record payments from cash or bank to parties, expenses, or payable accounts."
    />
  );
}
