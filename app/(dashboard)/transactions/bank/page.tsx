import { TransactionEntryForm } from "@/features/transactions/transaction-entry-form";

export default function BankTransactionPage() {
  return (
    <TransactionEntryForm
      kind="bank"
      description="Record bank deposits, withdrawals, and cheque-based settlements."
    />
  );
}
