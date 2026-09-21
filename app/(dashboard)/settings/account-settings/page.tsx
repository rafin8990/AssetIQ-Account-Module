import { CrudPage } from "@/features/crud/crud-page";
import { accountSettingsConfig } from "@/features/settings/configs";

export default function AccountSettingsPage() {
  return <CrudPage config={accountSettingsConfig} />;
}
