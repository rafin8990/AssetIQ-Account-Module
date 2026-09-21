import { CrudPage } from "@/features/crud/crud-page";
import { accountCodesConfig } from "@/features/chart-of-accounts/configs";

export default function AccountCodesPage() {
  return <CrudPage config={accountCodesConfig} />;
}
