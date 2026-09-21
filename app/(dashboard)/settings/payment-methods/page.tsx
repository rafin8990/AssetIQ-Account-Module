import { CrudPage } from "@/features/crud/crud-page";
import { paymentMethodsConfig } from "@/features/settings/configs";

export default function PaymentMethodsPage() {
  return <CrudPage config={paymentMethodsConfig} />;
}
