import { CrudPage } from "@/features/crud/crud-page";
import { openingBalanceConfig } from "@/features/chart-of-accounts/configs";

export default function OpeningBalancePage() {
  return <CrudPage config={openingBalanceConfig} />;
}
