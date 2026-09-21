import { CrudPage } from "@/features/crud/crud-page";
import { rolesPermissionsConfig } from "@/features/settings/configs";

export default function RolesPermissionsPage() {
  return <CrudPage config={rolesPermissionsConfig} />;
}
