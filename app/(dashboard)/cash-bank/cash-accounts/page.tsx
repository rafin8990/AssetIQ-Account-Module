import { CrudPage } from "@/features/crud/crud-page";
import { cashAccountsConfig } from "@/features/cash-bank/configs";

export default function CashAccountsPage() {
  return <CrudPage config={cashAccountsConfig} />;
}
