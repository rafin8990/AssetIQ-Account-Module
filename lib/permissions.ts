import type { NavItem } from "@/config/navigation";
import type { AuthUser } from "@/types/auth";

export const PATH_PERMISSION_RULES: { prefix: string; permission: string }[] = [
  { prefix: "/chart-of-accounts", permission: "accounts_chart_of_accounts.view" },
  { prefix: "/vouchers", permission: "accounts_vouchers.view" },
  { prefix: "/transactions", permission: "accounts_transactions.view" },
  { prefix: "/accounts-receivable", permission: "accounts_receivable.view" },
  { prefix: "/accounts-payable", permission: "accounts_payable.view" },
  { prefix: "/cash-bank", permission: "accounts_cash_bank.view" },
  { prefix: "/reports", permission: "accounts_reports.view" },
  { prefix: "/settings", permission: "accounts_settings.view" },
  { prefix: "/", permission: "accounts_dashboard.view" },
];

export const NAV_HREF_PERMISSION: Record<string, string> = {
  "/": "accounts_dashboard.view",
  "/chart-of-accounts": "accounts_chart_of_accounts.view",
  "/vouchers": "accounts_vouchers.view",
  "/transactions": "accounts_transactions.view",
  "/accounts-receivable": "accounts_receivable.view",
  "/accounts-payable": "accounts_payable.view",
  "/cash-bank": "accounts_cash_bank.view",
  "/reports": "accounts_reports.view",
  "/settings": "accounts_settings.view",
};

export function hasPermission(
  user: Pick<AuthUser, "permissions"> | null | undefined,
  permission: string
): boolean {
  if (!user) return false;
  return (user.permissions ?? []).includes(permission);
}

export function permissionForPath(pathname: string): string | null {
  if (pathname === "/") return "accounts_dashboard.view";
  const match = PATH_PERMISSION_RULES.find(
    (rule) =>
      rule.prefix !== "/" &&
      (pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`))
  );
  return match?.permission ?? null;
}

export function canAccessPath(
  user: Pick<AuthUser, "permissions"> | null | undefined,
  pathname: string
): boolean {
  if (!user) return false;
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  const required = permissionForPath(pathname);
  if (!required) return true;
  return hasPermission(user, required);
}

export function filterNavigation(
  items: NavItem[],
  user: Pick<AuthUser, "permissions"> | null | undefined
): NavItem[] {
  if (!user) return [];

  return items
    .map((item) => {
      const required =
        NAV_HREF_PERMISSION[item.href] ?? permissionForPath(item.href);
      if (required && !hasPermission(user, required)) {
        return null;
      }
      if (!item.children?.length) return item;
      return item;
    })
    .filter((item): item is NavItem => item !== null);
}

export function firstAllowedPath(
  user: Pick<AuthUser, "permissions"> | null | undefined,
  items: NavItem[]
): string | null {
  const allowed = filterNavigation(items, user);
  if (!allowed.length) return null;
  const first = allowed[0];
  if (first.children?.length) return first.children[0].href;
  return first.href;
}
