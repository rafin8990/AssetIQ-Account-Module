import { CrudPage } from "@/features/crud/crud-page";
import { settingsCostCentersConfig } from "@/features/settings/configs";

export default function SettingsCostCentersPage() {
  return <CrudPage config={settingsCostCentersConfig} />;
}
