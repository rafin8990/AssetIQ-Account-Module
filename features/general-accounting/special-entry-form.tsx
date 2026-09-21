"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Send, Trash2 } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { formatCurrency, glAccounts } from "./data";

type EntryKind = "closing" | "adjusting";

type LineDraft = {
  id: string;
  account: string;
  narration: string;
  debit: string;
  credit: string;
};

function createLine(): LineDraft {
  return {
    id: crypto.randomUUID(),
    account: "",
    narration: "",
    debit: "",
    credit: "",
  };
}

export function SpecialEntryForm({ kind }: { kind: EntryKind }) {
  const [date, setDate] = useState(
    kind === "closing" ? "2026-03-31" : "2026-03-21"
  );
  const [reference, setReference] = useState(
    kind === "closing" ? "CLS-FY26" : "ADJ-"
  );
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([createLine(), createLine()]);
  const [savedAs, setSavedAs] = useState<string | null>(null);

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, line) => ({
        debit: acc.debit + Number(line.debit || 0),
        credit: acc.credit + Number(line.credit || 0),
      }),
      { debit: 0, credit: 0 }
    );
  }, [lines]);

  const balanced = Math.abs(totals.debit - totals.credit) < 0.001;

  function updateLine(id: string, patch: Partial<LineDraft>) {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line))
    );
  }

  function handleSave(status: "draft" | "posted") {
    const prefix = kind === "closing" ? "CLS" : "ADJ";
    setSavedAs(
      `${prefix}-2026-${String(Math.floor(Math.random() * 90) + 10).padStart(3, "0")} (${status})`
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {kind === "closing" ? "Closing Entries" : "Adjusting Entries"}
            </h2>
            <Badge variant="secondary" className="capitalize">
              {kind}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {kind === "closing"
              ? "Close temporary accounts to income summary / retained earnings."
              : "Post accruals, deferrals, and period-end adjustments."}
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
            disabled={!balanced || totals.debit <= 0}
            onClick={() => handleSave("posted")}
          >
            <Send className="size-4" />
            Post Entry
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Dummy {kind} entry saved as{" "}
          <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Entry header</CardTitle>
          <CardDescription>Date, reference, and narration</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="narration">Narration</Label>
            <Textarea
              id="narration"
              placeholder={
                kind === "closing"
                  ? "Close income and expense accounts"
                  : "Describe the adjustment"
              }
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Ledger lines</CardTitle>
              <CardDescription>Debit and credit must balance</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setLines((prev) => [...prev, createLine()])}
            >
              <Plus className="size-4" />
              Add line
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Account</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="pl-4 min-w-48">
                    <Select
                      value={line.account || undefined}
                      onValueChange={(value) =>
                        updateLine(line.id, { account: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {glAccounts.map((account) => (
                          <SelectItem key={account} value={account}>
                            {account}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={line.narration}
                      onChange={(e) =>
                        updateLine(line.id, { narration: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="ml-auto max-w-28 text-right"
                      value={line.debit}
                      onChange={(e) =>
                        updateLine(line.id, {
                          debit: e.target.value,
                          credit: e.target.value ? "" : line.credit,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="ml-auto max-w-28 text-right"
                      value={line.credit}
                      onChange={(e) =>
                        updateLine(line.id, {
                          credit: e.target.value,
                          debit: e.target.value ? "" : line.debit,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setLines((prev) =>
                          prev.length <= 2
                            ? prev
                            : prev.filter((item) => item.id !== line.id)
                        )
                      }
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableCell className="pl-4 font-medium" colSpan={2}>
                  Totals{" "}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-2 border-0",
                      balanced
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {balanced ? "Balanced" : "Out of balance"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatCurrency(totals.debit)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatCurrency(totals.credit)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
