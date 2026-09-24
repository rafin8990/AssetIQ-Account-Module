"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Printer, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { CrudField, CrudPageConfig, CrudRow } from "./types";

function emptyForm(fields: CrudField[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.key, ""]));
}

function rowToForm(row: CrudRow, fields: CrudField[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((field) => [field.key, String(row[field.key] ?? "")])
  );
}

function formToPayload(
  form: Record<string, string>,
  fields: CrudField[]
): Record<string, string | number> {
  return Object.fromEntries(
    fields.map((field) => [
      field.key,
      field.type === "number" ? Number(form[field.key] || 0) : form[field.key],
    ])
  );
}

function formatCellValue(value: string | number | undefined): string {
  if (value === undefined || value === null || value === "") return "—";
  const text = String(value);
  if (text.includes("_")) {
    return text
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  if (!text.includes(" ") && text === text.toLowerCase()) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text;
}

export function CrudPage({ config }: { config: CrudPageConfig }) {
  const isLive = Boolean(config.api);
  const [rows, setRows] = useState<CrudRow[]>(
    isLive ? [] : config.initialRows
  );
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(
    emptyForm(config.fields)
  );
  const [loading, setLoading] = useState(isLive);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRows = useCallback(async () => {
    if (!config.api) return;
    setLoading(true);
    setError(null);
    try {
      const data = await config.api.list();
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [config.api]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      config.columns.some((column) =>
        String(row[column.key] ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [config.columns, query, rows]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm(config.fields));
    setError(null);
    setOpen(true);
  }

  function openEdit(row: CrudRow) {
    setEditingId(row.id);
    setForm(rowToForm(row, config.fields));
    setError(null);
    setOpen(true);
  }

  async function handleDelete(id: string) {
    if (config.api) {
      setError(null);
      try {
        await config.api.delete(id);
        setRows((prev) => prev.filter((row) => row.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete");
      }
      return;
    }
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  async function handleSave() {
    const requiredMissing = config.fields.some(
      (field) => field.required !== false && !form[field.key]?.trim()
    );
    if (requiredMissing) return;

    const payload = formToPayload(form, config.fields);

    if (config.api) {
      setSaving(true);
      setError(null);
      try {
        if (editingId) {
          const updated = await config.api.update(editingId, payload);
          setRows((prev) =>
            prev.map((row) => (row.id === editingId ? updated : row))
          );
        } else {
          const created = await config.api.create(payload);
          setRows((prev) => [created, ...prev]);
        }
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (editingId) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                ...payload,
              }
            : row
        )
      );
    } else {
      const nextId = `${config.entityName.slice(0, 3).toUpperCase()}-${String(
        rows.length + 1
      ).padStart(3, "0")}`;
      setRows((prev) => [
        {
          id: nextId,
          ...payload,
        },
        ...prev,
      ]);
    }

    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {config.title}
          </h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-1.5 shadow-sm shadow-primary/20"
          disabled={loading}
        >
          <Plus className="size-4" />
          Add {config.entityName}
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">
                {config.title} list
              </CardTitle>
              <CardDescription>
                {isLive
                  ? config.apiSourceLabel ?? "Live data from Accounts API"
                  : "Dummy CRUD — create, edit, and delete locally"}
              </CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${config.title.toLowerCase()}…`}
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">ID</TableHead>
                {config.columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={config.columns.length + 2}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={config.columns.length + 2}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4">
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {row.id}
                      </Badge>
                    </TableCell>
                    {config.columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {formatCellValue(row[column.key])}
                      </TableCell>
                    ))}
                    <TableCell className="pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-7"
                            aria-label="Row actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(row)}>
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          {(config.extraActions ?? []).map((action) =>
                            action.href ? (
                              <DropdownMenuItem key={action.label} asChild>
                                <Link href={action.href(row)}>
                                  <Printer className="size-4" />
                                  {action.label}
                                </Link>
                              </DropdownMenuItem>
                            ) : null
                          )}
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => void handleDelete(row.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? `Edit ${config.entityName}` : `Add ${config.entityName}`}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? `Update this ${config.entityName.toLowerCase()} record.`
                : `Create a new ${config.entityName.toLowerCase()} record.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-1">
            {config.fields.map((field) => (
              <div key={field.key} className="grid gap-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required !== false ? (
                    <span className="text-destructive"> *</span>
                  ) : null}
                </Label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={form[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: event.target.value,
                      }))
                    }
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={form[field.key] || undefined}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, [field.key]: value }))
                    }
                  >
                    <SelectTrigger id={field.key} className="w-full">
                      <SelectValue
                        placeholder={field.placeholder ?? `Select ${field.label}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type === "number" ? "number" : "text"}
                    value={form[field.key] ?? ""}
                    placeholder={field.placeholder}
                    className={cn(field.type === "number" && "tabular-nums")}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: event.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
