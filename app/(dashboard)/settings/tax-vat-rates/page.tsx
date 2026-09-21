import { CrudPage } from "@/features/crud/crud-page";
import { taxVatRatesConfig } from "@/features/settings/configs";

export default function TaxVatRatesPage() {
  return <CrudPage config={taxVatRatesConfig} />;
}
