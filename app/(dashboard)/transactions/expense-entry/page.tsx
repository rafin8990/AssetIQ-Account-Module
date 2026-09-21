import { TransactionEntryForm } from "@/features/transactions/transaction-entry-form";

export default function ExpenseEntryPage() {
  return (
    <TransactionEntryForm
      kind="expense"
      description="Record business expenses paid from cash, bank, or card accounts."
    />
  );
}
