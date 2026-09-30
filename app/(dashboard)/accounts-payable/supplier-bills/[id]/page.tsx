"use client";

import { useParams } from "next/navigation";

import { SupplierBillDetailView } from "@/features/accounts-payable/supplier-bill-detail-view";

export default function SupplierBillDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) return null;

  return <SupplierBillDetailView id={id} />;
}
