export type BudgetScope = "department" | "branch" | "project";
export type BudgetStatus = "Draft" | "Approved" | "Active" | "Closed";

export type BudgetRecord = {
  id: string;
  name: string;
  code: string;
  scope: BudgetScope;
  owner: string;
  fiscalYear: string;
  budgetAmount: number;
  actualAmount: number;
  status: BudgetStatus;
};

export type CostCenter = {
  id: string;
  name: string;
  code: string;
  manager: string;
  department: string;
  budgetLimit: number;
  spent: number;
  status: "Active" | "Inactive";
};

export type BudgetComparison = {
  id: string;
  category: string;
  scope: string;
  budget: number;
  actual: number;
};

export const departments = [
  "Operations",
  "Sales",
  "Marketing",
  "Finance",
  "HR",
  "IT",
];

export const branches = [
  "Head Office",
  "North Branch",
  "South Branch",
  "East Branch",
];

export const projects = [
  "ERP Rollout",
  "Warehouse Expansion",
  "Retail Refresh",
  "Mobile App",
];

export const budgets: BudgetRecord[] = [
  {
    id: "BUD-001",
    name: "Operations FY26",
    code: "DEP-OPS-26",
    scope: "department",
    owner: "Operations",
    fiscalYear: "2025-2026",
    budgetAmount: 420000,
    actualAmount: 286500,
    status: "Active",
  },
  {
    id: "BUD-002",
    name: "Sales FY26",
    code: "DEP-SAL-26",
    scope: "department",
    owner: "Sales",
    fiscalYear: "2025-2026",
    budgetAmount: 180000,
    actualAmount: 142200,
    status: "Active",
  },
  {
    id: "BUD-003",
    name: "Marketing FY26",
    code: "DEP-MKT-26",
    scope: "department",
    owner: "Marketing",
    fiscalYear: "2025-2026",
    budgetAmount: 95000,
    actualAmount: 101400,
    status: "Active",
  },
  {
    id: "BUD-004",
    name: "North Branch FY26",
    code: "BR-NTH-26",
    scope: "branch",
    owner: "North Branch",
    fiscalYear: "2025-2026",
    budgetAmount: 210000,
    actualAmount: 168800,
    status: "Active",
  },
  {
    id: "BUD-005",
    name: "South Branch FY26",
    code: "BR-STH-26",
    scope: "branch",
    owner: "South Branch",
    fiscalYear: "2025-2026",
    budgetAmount: 175000,
    actualAmount: 121300,
    status: "Approved",
  },
  {
    id: "BUD-006",
    name: "ERP Rollout",
    code: "PRJ-ERP-26",
    scope: "project",
    owner: "ERP Rollout",
    fiscalYear: "2025-2026",
    budgetAmount: 250000,
    actualAmount: 198700,
    status: "Active",
  },
  {
    id: "BUD-007",
    name: "Warehouse Expansion",
    code: "PRJ-WH-26",
    scope: "project",
    owner: "Warehouse Expansion",
    fiscalYear: "2025-2026",
    budgetAmount: 320000,
    actualAmount: 145000,
    status: "Draft",
  },
  {
    id: "BUD-008",
    name: "East Branch Capex",
    code: "BR-EST-26",
    scope: "branch",
    owner: "East Branch",
    fiscalYear: "2025-2026",
    budgetAmount: 90000,
    actualAmount: 0,
    status: "Closed",
  },
];

export const costCenters: CostCenter[] = [
  {
    id: "CC-001",
    name: "Admin Office",
    code: "CC-ADM",
    manager: "A. Rahman",
    department: "Operations",
    budgetLimit: 60000,
    spent: 41200,
    status: "Active",
  },
  {
    id: "CC-002",
    name: "Field Sales",
    code: "CC-SAL",
    manager: "N. Chowdhury",
    department: "Sales",
    budgetLimit: 85000,
    spent: 72350,
    status: "Active",
  },
  {
    id: "CC-003",
    name: "Digital Marketing",
    code: "CC-MKT",
    manager: "S. Islam",
    department: "Marketing",
    budgetLimit: 45000,
    spent: 48600,
    status: "Active",
  },
  {
    id: "CC-004",
    name: "IT Infrastructure",
    code: "CC-IT",
    manager: "R. Hasan",
    department: "IT",
    budgetLimit: 120000,
    spent: 88400,
    status: "Active",
  },
  {
    id: "CC-005",
    name: "Training Desk",
    code: "CC-HR",
    manager: "M. Akter",
    department: "HR",
    budgetLimit: 25000,
    spent: 9800,
    status: "Inactive",
  },
];

export const budgetComparisons: BudgetComparison[] = [
  {
    id: "cmp1",
    category: "Payroll",
    scope: "Operations",
    budget: 180000,
    actual: 172400,
  },
  {
    id: "cmp2",
    category: "Rent & Utilities",
    scope: "Operations",
    budget: 72000,
    actual: 69800,
  },
  {
    id: "cmp3",
    category: "Travel",
    scope: "Sales",
    budget: 40000,
    actual: 45600,
  },
  {
    id: "cmp4",
    category: "Advertising",
    scope: "Marketing",
    budget: 55000,
    actual: 61200,
  },
  {
    id: "cmp5",
    category: "Software Licenses",
    scope: "IT",
    budget: 35000,
    actual: 32800,
  },
  {
    id: "cmp6",
    category: "Capex Materials",
    scope: "Warehouse Expansion",
    budget: 150000,
    actual: 98000,
  },
  {
    id: "cmp7",
    category: "Consulting",
    scope: "ERP Rollout",
    budget: 80000,
    actual: 86500,
  },
];

export { formatCurrency } from "@/lib/format-currency";

export function getBudgetsByScope(scope: BudgetScope) {
  return budgets.filter((budget) => budget.scope === scope);
}

export function getVariance(budget: number, actual: number) {
  return actual - budget;
}

export function getVariancePct(budget: number, actual: number) {
  if (budget === 0) return 0;
  return ((actual - budget) / budget) * 100;
}
