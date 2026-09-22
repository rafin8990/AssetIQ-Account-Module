"use client";

import { useState } from "react";
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

import { assetCategories, formatCurrency } from "./data";

type ActionKind = "purchase" | "disposal" | "revaluation";

const titles: Record<ActionKind, string> = {
  purchase: "Asset Purchase",
  disposal: "Asset Disposal",
  revaluation: "Asset Revaluation",
};

const descriptions: Record<ActionKind, string> = {
  purchase: "Capitalize a new fixed asset and set depreciation parameters.",
  disposal: "Record sale or write-off of a fixed asset and clear balances.",
  revaluation: "Adjust carrying value of an asset up or down.",
};

export function AssetActionForm({ kind }: { kind: ActionKind }) {
  const [date, setDate] = useState("2026-03-21");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Straight Line");
  const [life, setLife] = useState("5");
  const [salvage, setSalvage] = useState("0");
  const [proceeds, setProceeds] = useState("");
  const [newValue, setNewValue] = useState("");
  const [notes, setNotes] = useState("");
  const [savedAs, setSavedAs] = useState<string | null>(null);

  function handleSave(status: "draft" | "posted") {
    const prefix =
      kind === "purchase" ? "PUR" : kind === "disposal" ? "DSP" : "REV";
    setSavedAs(
      `${prefix}-2026-${String(Math.floor(Math.random() * 90) + 10).padStart(3, "0")} (${status})`
    );
  }

  const canPost =
    kind === "purchase"
      ? Boolean(name && category && amount && Number(amount) > 0)
      : kind === "disposal"
        ? Boolean(code && amount)
        : Boolean(code && newValue && Number(newValue) >= 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {titles[kind]}
            </h2>
            <Badge variant="secondary" className="capitalize">
              {kind}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{descriptions[kind]}</p>
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
            disabled={!canPost}
            onClick={() => handleSave("posted")}
          >
            <Send className="size-4" />
            Post
          </Button>
        </div>
      </div>

      {savedAs ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Dummy {kind} recorded as{" "}
          <span className="font-semibold">{savedAs}</span>.
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription>
              Capture the required fields for this {kind}
            </CardDescription>
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
              <Label htmlFor="code">Asset code</Label>
              <Input
                id="code"
                placeholder="AST-XXX-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {kind === "purchase" ? (
              <>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="name">Asset name</Label>
                  <Input
                    id="name"
                    placeholder="Asset description"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={category || undefined}
                    onValueChange={setCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetCategories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Purchase cost</Label>
                  <Input
                    id="amount"
                    type="number"
                    className="tabular-nums"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Depreciation method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Straight Line">
                        Straight Line
                      </SelectItem>
                      <SelectItem value="Reducing Balance">
                        Reducing Balance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="life">Useful life (years)</Label>
                  <Input
                    id="life"
                    type="number"
                    value={life}
                    onChange={(e) => setLife(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salvage">Salvage value</Label>
                  <Input
                    id="salvage"
                    type="number"
                    value={salvage}
                    onChange={(e) => setSalvage(e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {kind === "disposal" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Book value</Label>
                  <Input
                    id="amount"
                    type="number"
                    className="tabular-nums"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="proceeds">Sale proceeds</Label>
                  <Input
                    id="proceeds"
                    type="number"
                    className="tabular-nums"
                    value={proceeds}
                    onChange={(e) => setProceeds(e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {kind === "revaluation" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Current book value</Label>
                  <Input
                    id="amount"
                    type="number"
                    className="tabular-nums"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newValue">Revalued amount</Label>
                  <Input
                    id="newValue"
                    type="number"
                    className="tabular-nums"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </div>
              </>
            ) : null}

            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Supporting notes / invoice reference"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-base">Summary</CardTitle>
            <CardDescription>Quick preview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Code</span>
              <span className="font-medium">{code || "—"}</span>
            </div>
            {kind === "purchase" ? (
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-semibold tabular-nums">
                  {amount ? formatCurrency(Number(amount)) : formatCurrency(0)}
                </span>
              </div>
            ) : null}
            {kind === "disposal" ? (
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Gain / Loss</span>
                <span className="font-semibold tabular-nums">
                  {amount || proceeds
                    ? formatCurrency(Number(proceeds || 0) - Number(amount || 0))
                    : formatCurrency(0)}
                </span>
              </div>
            ) : null}
            {kind === "revaluation" ? (
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Adjustment</span>
                <span className="font-semibold tabular-nums">
                  {amount || newValue
                    ? formatCurrency(Number(newValue || 0) - Number(amount || 0))
                    : formatCurrency(0)}
                </span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
