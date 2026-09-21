import { TransactionEntryForm } from "@/features/transactions/transaction-entry-form";

export default function CashTransactionPage() {
  return (
    <TransactionEntryForm
      kind="cash"
      description="Log cash-in-hand receipts and payments for day-to-day operations."
    />
  );
}
