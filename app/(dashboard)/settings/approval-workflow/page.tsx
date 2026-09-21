import { CrudPage } from "@/features/crud/crud-page";
import { approvalWorkflowConfig } from "@/features/settings/configs";

export default function ApprovalWorkflowSettingsPage() {
  return <CrudPage config={approvalWorkflowConfig} />;
}
