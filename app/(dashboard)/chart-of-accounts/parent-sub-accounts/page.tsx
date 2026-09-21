import { CrudPage } from "@/features/crud/crud-page";
import { parentSubAccountsConfig } from "@/features/chart-of-accounts/configs";

export default function ParentSubAccountsPage() {
  return <CrudPage config={parentSubAccountsConfig} />;
}
