import { CrudPage } from "@/features/crud/crud-page";
import { branchesConfig } from "@/features/settings/configs";

export default function BranchesSettingsPage() {
  return <CrudPage config={branchesConfig} />;
}
