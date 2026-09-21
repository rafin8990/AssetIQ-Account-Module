import { ApprovalListView } from "@/features/approval-audit/approval-list-view";

export default function RejectedTransactionsPage() {
  return <ApprovalListView status="Rejected" />;
}
