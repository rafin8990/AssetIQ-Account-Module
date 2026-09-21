import { CrudPage } from "@/features/crud/crud-page";
import { financialYearConfig } from "@/features/settings/configs";

export default function FinancialYearSettingsPage() {
  return <CrudPage config={financialYearConfig} />;
}
