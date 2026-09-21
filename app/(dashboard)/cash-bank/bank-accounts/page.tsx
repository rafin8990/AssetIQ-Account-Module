import { CrudPage } from "@/features/crud/crud-page";
import { bankAccountsConfig } from "@/features/cash-bank/configs";

export default function BankAccountsPage() {
  return <CrudPage config={bankAccountsConfig} />;
}
