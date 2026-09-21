import { CrudPage } from "@/features/crud/crud-page";
import { openingBalanceConfig } from "@/features/general-accounting/configs";

export default function OpeningBalancePage() {
  return <CrudPage config={openingBalanceConfig} />;
}
