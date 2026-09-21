import { CrudPage } from "@/features/crud/crud-page";
import { supplierBillsConfig } from "@/features/accounts-payable/configs";

export default function SupplierBillsPage() {
  return <CrudPage config={supplierBillsConfig} />;
}
