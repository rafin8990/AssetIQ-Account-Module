export type AssetStatus = "Active" | "Fully Depreciated" | "Disposed" | "Under Revaluation";
export type DepreciationMethod = "Straight Line" | "Reducing Balance";

export type FixedAsset = {
  id: string;
  code: string;
  name: string;
  category: string;
  purchaseDate: string;
  cost: number;
  usefulLifeYears: number;
  method: DepreciationMethod;
  salvageValue: number;
  accumulatedDepreciation: number;
  bookValue: number;
  status: AssetStatus;
};

export type DepreciationRow = {
  id: string;
  assetCode: string;
  assetName: string;
  period: string;
  method: DepreciationMethod;
  amount: number;
  status: "Scheduled" | "Posted";
};

export type AccumulatedRow = {
  id: string;
  assetCode: string;
  assetName: string;
  cost: number;
  accumulated: number;
  bookValue: number;
  remainingLife: string;
};

export const assetCategories = [
  "Buildings",
  "Machinery",
  "Vehicles",
  "Furniture",
  "IT Equipment",
];

export const fixedAssets: FixedAsset[] = [
  {
    id: "FA-001",
    code: "AST-BLD-01",
    name: "Head Office Building",
    category: "Buildings",
    purchaseDate: "2020-04-01",
    cost: 850000,
    usefulLifeYears: 40,
    method: "Straight Line",
    salvageValue: 50000,
    accumulatedDepreciation: 120000,
    bookValue: 730000,
    status: "Active",
  },
  {
    id: "FA-002",
    code: "AST-MCH-12",
    name: "CNC Cutting Machine",
    category: "Machinery",
    purchaseDate: "2023-06-15",
    cost: 125000,
    usefulLifeYears: 10,
    method: "Straight Line",
    salvageValue: 5000,
    accumulatedDepreciation: 30000,
    bookValue: 95000,
    status: "Active",
  },
  {
    id: "FA-003",
    code: "AST-VEH-07",
    name: "Delivery Van — Toyota",
    category: "Vehicles",
    purchaseDate: "2022-01-10",
    cost: 42000,
    usefulLifeYears: 5,
    method: "Reducing Balance",
    salvageValue: 4000,
    accumulatedDepreciation: 24600,
    bookValue: 17400,
    status: "Active",
  },
  {
    id: "FA-004",
    code: "AST-IT-22",
    name: "Server Rack Cluster",
    category: "IT Equipment",
    purchaseDate: "2021-09-01",
    cost: 28000,
    usefulLifeYears: 4,
    method: "Straight Line",
    salvageValue: 0,
    accumulatedDepreciation: 28000,
    bookValue: 0,
    status: "Fully Depreciated",
  },
  {
    id: "FA-005",
    code: "AST-FUR-09",
    name: "Office Furniture Set",
    category: "Furniture",
    purchaseDate: "2019-03-20",
    cost: 15000,
    usefulLifeYears: 7,
    method: "Straight Line",
    salvageValue: 1000,
    accumulatedDepreciation: 14000,
    bookValue: 1000,
    status: "Disposed",
  },
];

export const depreciationSchedule: DepreciationRow[] = [
  {
    id: "DEP-001",
    assetCode: "AST-BLD-01",
    assetName: "Head Office Building",
    period: "Mar 2026",
    method: "Straight Line",
    amount: 1667,
    status: "Scheduled",
  },
  {
    id: "DEP-002",
    assetCode: "AST-MCH-12",
    assetName: "CNC Cutting Machine",
    period: "Mar 2026",
    method: "Straight Line",
    amount: 1000,
    status: "Scheduled",
  },
  {
    id: "DEP-003",
    assetCode: "AST-VEH-07",
    assetName: "Delivery Van — Toyota",
    period: "Mar 2026",
    method: "Reducing Balance",
    amount: 435,
    status: "Scheduled",
  },
  {
    id: "DEP-004",
    assetCode: "AST-MCH-12",
    assetName: "CNC Cutting Machine",
    period: "Feb 2026",
    method: "Straight Line",
    amount: 1000,
    status: "Posted",
  },
  {
    id: "DEP-005",
    assetCode: "AST-BLD-01",
    assetName: "Head Office Building",
    period: "Feb 2026",
    method: "Straight Line",
    amount: 1667,
    status: "Posted",
  },
];

export const accumulatedDepreciation: AccumulatedRow[] = fixedAssets
  .filter((asset) => asset.status !== "Disposed")
  .map((asset) => ({
    id: asset.id,
    assetCode: asset.code,
    assetName: asset.name,
    cost: asset.cost,
    accumulated: asset.accumulatedDepreciation,
    bookValue: asset.bookValue,
    remainingLife: `${Math.max(
      0,
      asset.usefulLifeYears -
        Math.floor(
          (new Date("2026-03-21").getTime() -
            new Date(asset.purchaseDate).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
    )} yrs`,
  }));

export { formatCurrency } from "@/lib/format-currency";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
