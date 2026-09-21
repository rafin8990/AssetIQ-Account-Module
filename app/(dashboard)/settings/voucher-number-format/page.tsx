import { CrudPage } from "@/features/crud/crud-page";
import { voucherNumberFormatConfig } from "@/features/settings/configs";

export default function VoucherNumberFormatPage() {
  return <CrudPage config={voucherNumberFormatConfig} />;
}
