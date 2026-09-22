"use client";

import { useMemo, useState } from "react";
import { Save, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  branches,
  costCenters,
  departments,
  formatCurrency,
  projects,
  type BudgetScope,
} from "./data";

export function CreateBudgetForm() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [scope, setScope] = useState<BudgetScope | "">("");
  const [owner, setOwner] = useState("");
  const [fiscalYear, setFiscalYear] = useState("2025-2026");
  const [amount, setAmount] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [notes, setNotes] = useState("");
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const owners = useMemo(() => {
    if (scope === "department") return departments;
    if (scope === "branch") return branches;
    if (scope === "project") return projects;
    return [];
  }, [scope]);

  function handleSave(status: "draft" | "submitted") {
    setSavedAs(
      `BUD-2026-${String(Math.floor(Math.random() * 90) + 10).padStart(3, "0")} (${status})`
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Create Budget
          </h2>
          <p className="text-sm text-muted-foreground">
            Set up a new department, branch, or project budget for the fiscal year.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => handleSave("draft")}
          >
            <Save className="size-4" />
            Save Draft
          </Button>
          <Button
            className="gap-1.5 shadow-sm shadow-primary/20"
            disabled={!name || !scope || !owner || !amount || Number(amount) <= 0}
            onClick={() => handleSave("submitted")}
          >
            <Send className="size-4" />
            Submit Budget
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Dummy budget saved as{" "}
          <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Budget details</CardTitle>
            <CardDescription>
              Define scope, owner, and planned amount
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="name">Budget name</Label>
              <Input
                id="name"
                placeholder="e.g. Operations FY26"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Budget code</Label>
              <Input
                id="code"
                placeholder="e.g. DEP-OPS-26"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Fiscal year</Label>
              <Select value={fiscalYear} onValueChange={setFiscalYear}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Scope</Label>
              <Select
                value={scope || undefined}
                onValueChange={(value) => {
                  setScope(value as BudgetScope);
                  setOwner("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="branch">Branch</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Owner</Label>
              <Select
                value={owner || undefined}
                onValueChange={setOwner}
                disabled={!scope}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Budget amount</Label>
              <Input
                id="amount"
                type="number"
                className="tabular-nums"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Primary cost center</Label>
              <Select
                value={costCenter || undefined}
                onValueChange={setCostCenter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {costCenters.map((cc) => (
                    <SelectItem key={cc.id} value={cc.name}>
                      {cc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Assumptions, caps, or approval notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>Quick summary of this budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{name || "—"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Scope</span>
              {scope ? (
                <Badge variant="secondary" className="capitalize">
                  {scope}
                </Badge>
              ) : (
                <span>—</span>
              )}
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-medium">{owner || "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-3">
              <span className="font-medium text-primary">Amount</span>
              <span className="font-semibold text-primary tabular-nums">
                {amount ? formatCurrency(Number(amount)) : formatCurrency(0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
