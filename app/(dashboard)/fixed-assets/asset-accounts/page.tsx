import { CrudPage } from "@/features/crud/crud-page";
import { assetAccountsConfig } from "@/features/fixed-assets/configs";

export default function AssetAccountsPage() {
  return <CrudPage config={assetAccountsConfig} />;
}
