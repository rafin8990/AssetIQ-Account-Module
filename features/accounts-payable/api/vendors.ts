import { vendorApi } from "@/lib/api-client";
import type { CrudRow } from "@/features/crud/types";

export type VendorType =
  | "Supplier"
  | "Manufacturer"
  | "Distributor"
  | "Service Provider"
  | "Contractor";

export type Vendor = {
  id: number | string;
  vendor_code: string;
  vendor_name: string;
  vendor_type?: VendorType | string | null;
  contact_person?: string | null;
  designation?: string | null;
  phone?: string | null;
  mobile_no?: string | null;
  alternative_mobile_no?: string | null;
  email?: string | null;
  website?: string | null;
  trade_license?: string | null;
  address?: string | null;
};

export type VendorPayload = {
  vendor_name: string;
  vendor_type?: VendorType | null;
  contact_person?: string | null;
  designation?: string | null;
  phone?: string | null;
  mobile_no: string;
  alternative_mobile_no?: string | null;
  email?: string | null;
  website?: string | null;
  trade_license?: string | null;
  address?: string | null;
};

export type PartyOption = {
  value: string;
  label: string;
  code: string;
  kind: "customer" | "vendor";
};

function emptyToNull(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function toRow(vendor: Vendor): CrudRow {
  return {
    id: String(vendor.id),
    vendor_code: vendor.vendor_code,
    vendor_name: vendor.vendor_name,
    vendor_type: vendor.vendor_type ?? "",
    contact_person: vendor.contact_person ?? "",
    designation: vendor.designation ?? "",
    phone: vendor.phone ?? "",
    mobile_no: vendor.mobile_no ?? "",
    email: vendor.email ?? "",
    address: vendor.address ?? "",
  };
}

function toPayload(data: Record<string, string | number>): VendorPayload {
  const vendorType =
    (emptyToNull(data.vendor_type) as VendorType | null) ?? "Supplier";
  const email = emptyToNull(data.email);

  return {
    vendor_name: String(data.vendor_name ?? "").trim(),
    vendor_type: vendorType,
    contact_person: emptyToNull(data.contact_person),
    designation: emptyToNull(data.designation),
    phone: emptyToNull(data.phone),
    mobile_no: String(data.mobile_no ?? "").trim(),
    alternative_mobile_no: emptyToNull(data.alternative_mobile_no),
    email,
    website: emptyToNull(data.website),
    trade_license: emptyToNull(data.trade_license),
    address: emptyToNull(data.address),
  };
}

export async function listVendors(): Promise<Vendor[]> {
  const vendors = await vendorApi.get<Vendor[]>("/vendors", {
    params: {
      page: 1,
      limit: 200,
      sortBy: "created_at",
      sortOrder: "desc",
    },
  });
  return Array.isArray(vendors) ? vendors : [];
}

export async function listVendorRows(): Promise<CrudRow[]> {
  const vendors = await listVendors();
  return vendors.map(toRow);
}

export async function createVendor(
  data: Record<string, string | number>
): Promise<CrudRow> {
  const created = await vendorApi.post<Vendor>("/vendors", toPayload(data));
  return toRow(created);
}

export async function updateVendor(
  id: string,
  data: Record<string, string | number>
): Promise<CrudRow> {
  const updated = await vendorApi.patch<Vendor>(
    `/vendors/${id}`,
    toPayload(data)
  );
  return toRow(updated);
}

export async function deleteVendor(id: string): Promise<void> {
  await vendorApi.delete(`/vendors/${id}`);
}

export function mapVendorToPartyOption(vendor: Vendor): PartyOption {
  const name = String(vendor.vendor_name ?? "").trim();
  const code = String(vendor.vendor_code ?? "").trim();
  return {
    value: name || code,
    label: code ? `${name} (${code})` : name,
    code,
    kind: "vendor",
  };
}
