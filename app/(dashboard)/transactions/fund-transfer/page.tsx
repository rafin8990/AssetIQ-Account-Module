import { TransactionEntryForm } from "@/features/transactions/transaction-entry-form";

export default function FundTransferPage() {
  return (
    <TransactionEntryForm
      kind="transfer"
      description="Move funds between cash and bank accounts without affecting profit or loss."
    />
  );
}
