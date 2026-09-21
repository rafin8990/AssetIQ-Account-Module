import { CrudPage } from "@/features/crud/crud-page";
import { accountTypesConfig } from "@/features/chart-of-accounts/configs";

export default function AccountTypesPage() {
  return <CrudPage config={accountTypesConfig} />;
}
