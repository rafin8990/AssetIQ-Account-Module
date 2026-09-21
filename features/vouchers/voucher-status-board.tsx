"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, FileEdit, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  formatCurrency,
  getVouchersByStatus,
  vouchers,
  type VoucherStatus,
} from "./data";
import { VoucherListView } from "./voucher-list-view";

const tabs: {
  key: VoucherStatus;
  label: string;
  icon: typeof FileEdit;
  tone: string;
}[] = [
  {
    key: "draft",
    label: "Draft",
    icon: FileEdit,
    tone: "data-[active=true]:bg-slate-900 data-[active=true]:text-white",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
    tone: "data-[active=true]:bg-amber-600 data-[active=true]:text-white",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    tone: "data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    tone: "data-[active=true]:bg-rose-600 data-[active=true]:text-white",
  },
];

export function VoucherStatusBoard() {
  const [active, setActive] = useState<VoucherStatus>("pending");

  const counts = useMemo(
    () => ({
      draft: getVouchersByStatus("draft").length,
      pending: getVouchersByStatus("pending").length,
      approved: getVouchersByStatus("approved").length,
      rejected: getVouchersByStatus("rejected").length,
    }),
    []
  );

  const activeAmount = useMemo(
    () =>
      getVouchersByStatus(active).reduce((sum, item) => sum + item.amount, 0),
    [active]
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Draft / Pending / Approved / Rejected
        </h2>
        <p className="text-sm text-muted-foreground">
          Track voucher approval workflow across all voucher types.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              data-active={active === tab.key}
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-2xl border border-border/70 bg-card/90 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                "data-[active=true]:border-transparent data-[active=true]:shadow-md",
                tab.tone
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon className="size-5 opacity-80" />
                <Badge
                  variant="secondary"
                  className="border-0 bg-black/5 text-inherit"
                >
                  {counts[tab.key]}
                </Badge>
              </div>
              <p className="text-sm font-medium">{tab.label}</p>
              <p className="mt-1 text-xs opacity-80">
                {tab.key === active
                  ? formatCurrency(activeAmount)
                  : `${counts[tab.key]} vouchers`}
              </p>
            </button>
          );
        })}
      </div>

      <Card className="border-0 bg-primary/5 shadow-none ring-1 ring-primary/15">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Workflow tip</CardTitle>
          <CardDescription className="text-foreground/70">
            Draft → Pending (submit) → Approved / Rejected. Approved vouchers
            are ready for print and posting.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActive("draft")}
            >
              Review drafts
            </Button>
            <Button size="sm" onClick={() => setActive("pending")}>
              Approve pending
            </Button>
          </div>
        </CardContent>
      </Card>

      <VoucherListView
        title={`${active.charAt(0).toUpperCase()}${active.slice(1)} vouchers`}
        description={`Showing ${counts[active]} of ${vouchers.length} total vouchers in ${active} status.`}
        fixedStatus={active}
        showStatusFilter={false}
      />
    </div>
  );
}
