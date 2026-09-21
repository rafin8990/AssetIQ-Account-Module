import { CrudPage } from "@/features/crud/crud-page";
import { customerInvoicesConfig } from "@/features/accounts-receivable/configs";

export default function CustomerInvoicesPage() {
  return <CrudPage config={customerInvoicesConfig} />;
}
