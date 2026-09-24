import {
  listCustomers,
  type Customer,
} from "@/features/accounts-receivable/api/customers";
import {
  listVendors,
  mapVendorToPartyOption,
  type PartyOption,
} from "@/features/accounts-payable/api/vendors";
import { assetApi } from "@/lib/api-client";

export type { PartyOption };

async function listCustomerPartyOptions(): Promise<PartyOption[]> {
  // Prefer typed customer payload so we keep codes; fall back to CRUD rows.
  try {
    const customers = await assetApi.get<Customer[]>("/customers", {
      params: {
        page: 1,
        limit: 200,
        sortBy: "created_at",
        sortOrder: "desc",
      },
    });
    return (Array.isArray(customers) ? customers : [])
      .filter((customer) => String(customer.status ?? "active") !== "inactive")
      .map((customer) => {
        const name = String(customer.customer_name ?? "").trim();
        const code = String(customer.customer_code ?? "").trim();
        return {
          value: name || code,
          label: code ? `${name} (${code})` : name,
          code,
          kind: "customer" as const,
        };
      })
      .filter((option) => option.value);
  } catch {
    const rows = await listCustomers();
    return rows
      .map((row) => {
        const name = String(row.customer_name ?? "").trim();
        const code = String(row.customer_code ?? "").trim();
        return {
          value: name || code,
          label: code ? `${name} (${code})` : name,
          code,
          kind: "customer" as const,
        };
      })
      .filter((option) => option.value);
  }
}

async function listVendorPartyOptions(): Promise<PartyOption[]> {
  const vendors = await listVendors();
  return vendors
    .map(mapVendorToPartyOption)
    .filter((option) => option.value);
}

/** Parties for payment vouchers (vendors/suppliers). */
export async function listPaymentParties(): Promise<PartyOption[]> {
  return listVendorPartyOptions();
}

/** Parties for receipt vouchers (customers). */
export async function listReceiptParties(): Promise<PartyOption[]> {
  return listCustomerPartyOptions();
}

/** Combined party list when a voucher can involve either side. */
export async function listAllParties(): Promise<PartyOption[]> {
  const [customers, vendors] = await Promise.all([
    listCustomerPartyOptions().catch(() => [] as PartyOption[]),
    listVendorPartyOptions().catch(() => [] as PartyOption[]),
  ]);

  const seen = new Set<string>();
  return [...customers, ...vendors].filter((option) => {
    const key = option.value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
