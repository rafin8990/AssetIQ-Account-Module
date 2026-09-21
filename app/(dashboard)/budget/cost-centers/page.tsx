import { CrudPage } from "@/features/crud/crud-page";
import { costCentersConfig } from "@/features/budget/configs";

export default function CostCentersPage() {
  return <CrudPage config={costCentersConfig} />;
}
