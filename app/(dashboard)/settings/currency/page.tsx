import { CrudPage } from "@/features/crud/crud-page";
import { currencyConfig } from "@/features/settings/configs";

export default function CurrencySettingsPage() {
  return <CrudPage config={currencyConfig} />;
}
