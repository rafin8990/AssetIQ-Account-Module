import { CrudPage } from "@/features/crud/crud-page";
import { suppliersConfig } from "@/features/accounts-payable/configs";

export default function SuppliersPage() {
  return <CrudPage config={suppliersConfig} />;
}
