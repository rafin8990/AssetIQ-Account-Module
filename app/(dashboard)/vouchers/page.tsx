import { redirect } from "next/navigation";

export default function VouchersIndexPage() {
  redirect("/vouchers/list");
}
