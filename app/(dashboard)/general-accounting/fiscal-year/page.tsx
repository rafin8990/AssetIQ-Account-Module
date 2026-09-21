import { CrudPage } from "@/features/crud/crud-page";
import { fiscalYearConfig } from "@/features/general-accounting/configs";

export default function FiscalYearPage() {
  return <CrudPage config={fiscalYearConfig} />;
}
