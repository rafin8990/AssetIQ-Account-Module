"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  listVouchers,
  updateVoucherStatus,
} from "@/features/vouchers/api/vouchers";
import {
  formatCurrency,
  type Voucher,
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
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listVouchers();
      setVouchers(rows);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load vouchers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVouchers();
  }, [loadVouchers]);

  const counts = useMemo(
    () => ({
      draft: vouchers.filter((item) => item.status === "draft").length,
      pending: vouchers.filter((item) => item.status === "pending").length,
      approved: vouchers.filter((item) => item.status === "approved").length,
      rejected: vouchers.filter((item) => item.status === "rejected").length,
    }),
    [vouchers]
  );

  const activeAmount = useMemo(
    () =>
      vouchers
        .filter((item) => item.status === active)
        .reduce((sum, item) => sum + item.amount, 0),
    [active, vouchers]
  );

  async function handleStatusChange(voucher: Voucher, status: VoucherStatus) {
    setActionError(null);
    try {
      const updated = await updateVoucherStatus(voucher.id, status);
      setVouchers((prev) =>
        prev.map((item) =>
          String(item.id) === String(updated.id) ? { ...item, ...updated } : item
        )
      );
      setActive(status);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update voucher status";
      setActionError(message);
      throw err;
    }
  }

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

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      ) : null}

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
          <CardTitle className="text-base">How to approve</CardTitle>
          <CardDescription className="text-foreground/70">
            Open the <strong>Pending</strong> tab, then click{" "}
            <strong>Approve</strong> or <strong>Reject</strong> on each row.
            Draft vouchers can be submitted first.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setActive("draft")}
            >
              Review drafts
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setActive("pending")}
            >
              Open pending queue
            </Button>
          </div>
        </CardContent>
      </Card>

      <VoucherListView
        title={`${active.charAt(0).toUpperCase()}${active.slice(1)} vouchers`}
        description={`Showing ${counts[active]} of ${vouchers.length} total vouchers in ${active} status.`}
        fixedStatus={active}
        showStatusFilter={false}
        vouchers={vouchers}
        loading={loading}
        error={null}
        showWorkflowActions
        onStatusChange={handleStatusChange}
        onRefresh={() => void loadVouchers()}
      />
    </div>
  );
}
