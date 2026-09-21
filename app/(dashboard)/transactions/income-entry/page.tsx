import { TransactionEntryForm } from "@/features/transactions/transaction-entry-form";

export default function IncomeEntryPage() {
  return (
    <TransactionEntryForm
      kind="income"
      description="Record income received from sales, services, or other revenue sources."
    />
  );
}
