import { CrudPage } from "@/features/crud/crud-page";
import { accountingPeriodConfig } from "@/features/general-accounting/configs";

export default function AccountingPeriodPage() {
  return <CrudPage config={accountingPeriodConfig} />;
}
