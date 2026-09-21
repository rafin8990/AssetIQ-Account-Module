import { VoucherEntryForm } from "@/features/vouchers/voucher-entry-form";

export default function ReceiptVoucherPage() {
  return (
    <VoucherEntryForm
      type="receipt"
      description="Record money received into cash or bank from customers, income, or receivable accounts."
    />
  );
}
