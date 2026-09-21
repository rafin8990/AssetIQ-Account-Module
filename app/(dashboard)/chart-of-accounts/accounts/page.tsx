import { CrudPage } from "@/features/crud/crud-page";
import { accountsConfig } from "@/features/chart-of-accounts/configs";

export default function AccountsPage() {
  return <CrudPage config={accountsConfig} />;
}
