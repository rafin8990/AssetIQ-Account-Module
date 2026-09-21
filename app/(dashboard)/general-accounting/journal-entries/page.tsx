import { CrudPage } from "@/features/crud/crud-page";
import { journalEntriesConfig } from "@/features/general-accounting/configs";

export default function JournalEntriesPage() {
  return <CrudPage config={journalEntriesConfig} />;
}
