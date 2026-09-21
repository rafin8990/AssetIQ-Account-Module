import { CrudPage } from "@/features/crud/crud-page";
import { accountGroupsConfig } from "@/features/chart-of-accounts/configs";

export default function AccountGroupsPage() {
  return <CrudPage config={accountGroupsConfig} />;
}
