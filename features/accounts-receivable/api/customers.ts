import { assetApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type CustomerStatus = "active" | "inactive";

export type CustomerType =
  | "Individual"
  | "Business"
  | "Government"
  | "NGO"
  | "Other";

export type Customer = {
  id: number | string;
  customer_code: string;
  customer_name: string;
  customer_type: CustomerType | null;
  contact_person: string | null;
  designation: string | null;
  phone: string | null;
  mobile_no: string | null;
  email: string | null;
  address: string | null;
  status: CustomerStatus;
  created_at?: string;
  updated_at?: string | null;
};

export type CustomerPayload = {
  customer_name: string;
  customer_type?: CustomerType | null;
  contact_person?: string | null;
  designation?: string | null;
  phone?: string | null;
  mobile_no?: string | null;
  email?: string | null;
  address?: string | null;
  status?: CustomerStatus;
};

function emptyToNull(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function toRow(customer: Customer): CrudRow {
  return {
    id: String(customer.id),
    customer_code: customer.customer_code,
    customer_name: customer.customer_name,
    customer_type: customer.customer_type ?? "",
    contact_person: customer.contact_person ?? "",
    designation: customer.designation ?? "",
    phone: customer.phone ?? "",
    mobile_no: customer.mobile_no ?? "",
    email: customer.email ?? "",
    address: customer.address ?? "",
    status: customer.status,
  };
}

function toPayload(data: Record<string, string | number>): CustomerPayload {
  const customerType = emptyToNull(data.customer_type) as CustomerType | null;
  const email = emptyToNull(data.email);

  return {
    customer_name: String(data.customer_name ?? "").trim(),
    customer_type: customerType,
    contact_person: emptyToNull(data.contact_person),
    designation: emptyToNull(data.designation),
    phone: emptyToNull(data.phone),
    mobile_no: emptyToNull(data.mobile_no),
    email,
    address: emptyToNull(data.address),
    status: (String(data.status ?? "active").trim() ||
      "active") as CustomerStatus,
  };
}

export async function listCustomers(): Promise<CrudRow[]> {
  const customers = await assetApi.get<Customer[]>("/customers", {
    params: {
      page: 1,
      limit: 200,
      sortBy: "created_at",
      sortOrder: "desc",
    },
  });
  return customers.map(toRow);
}

export async function createCustomer(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await assetApi.post<Customer>("/customers", toPayload(data));
  return toRow(created);
}

export async function updateCustomer(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await assetApi.patch<Customer>(
    `/customers/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteCustomer(id: string): Promise<void> {
  await assetApi.delete(`/customers/${id}`);
}
