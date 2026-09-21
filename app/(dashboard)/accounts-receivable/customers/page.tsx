import { CrudPage } from "@/features/crud/crud-page";
import { customersConfig } from "@/features/accounts-receivable/configs";

export default function CustomersPage() {
  return <CrudPage config={customersConfig} />;
}
