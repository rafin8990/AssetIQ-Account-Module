import { CrudPage } from "@/features/crud/crud-page";
import { approvalLimitsConfig } from "@/features/approval-audit/configs";

export default function ApprovalLimitsPage() {
  return <CrudPage config={approvalLimitsConfig} />;
}
