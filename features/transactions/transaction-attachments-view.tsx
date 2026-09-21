"use client";

import { useMemo, useState } from "react";
import { FileUp, Paperclip, Search, Trash2 } from "lucide-react";

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
import { cn } from "@/lib/utils";

import {
  attachments as initialAttachments,
  formatDate,
  transactions,
  type AttachmentRecord,
} from "./data";

export function TransactionAttachmentsView() {
  const [rows, setRows] = useState<AttachmentRecord[]>(initialAttachments);
  const [query, setQuery] = useState("");
  const [linkedTxn, setLinkedTxn] = useState("");
  const [docType, setDocType] = useState<AttachmentRecord["docType"] | "">("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.fileName.toLowerCase().includes(q) ||
        row.linkedTxnNo.toLowerCase().includes(q) ||
        row.docType.toLowerCase().includes(q)
    );
  }, [query, rows]);

  function handleAttach() {
    if (!fileName || !linkedTxn || !docType) {
      setMessage("Select a transaction, document type, and file first.");
      return;
    }

    const next: AttachmentRecord = {
      id: `a${rows.length + 1}`,
      fileName,
      docType,
      linkedTxnNo: linkedTxn,
      uploadedOn: "2026-03-21",
      size: "128 KB",
      status: "Pending review",
    };

    setRows((prev) => [next, ...prev]);
    setFileName(null);
    setDocType("");
    setLinkedTxn("");
    setMessage(`Attached ${next.fileName} to ${next.linkedTxnNo}.`);
  }

  function handleDelete(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Attach Invoice / Bill / Supporting Documents
        </h2>
        <p className="text-sm text-muted-foreground">
          Link invoices, bills, and supporting files to accounting transactions.
        </p>
      </div>

      {message ? (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          {message}
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Upload attachment</CardTitle>
          <CardDescription>
            Dummy upload — files stay in local UI state only
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 lg:grid-cols-[1.2fr_1fr]">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-10 text-center transition-colors hover:bg-primary/10">
            <FileUp className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {fileName ?? "Drop or click to choose a file"}
              </p>
              <p className="text-xs text-muted-foreground">
                Invoice, bill, receipt, or supporting document
              </p>
            </div>
            <Input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>

          <div className="grid gap-4 content-start">
            <div className="grid gap-2">
              <Label>Link to transaction</Label>
              <Select
                value={linkedTxn || undefined}
                onValueChange={setLinkedTxn}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select transaction" />
                </SelectTrigger>
                <SelectContent>
                  {transactions.map((txn) => (
                    <SelectItem key={txn.id} value={txn.txnNo}>
                      {txn.txnNo} — {txn.narration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Document type</Label>
              <Select
                value={docType || undefined}
                onValueChange={(value) =>
                  setDocType(value as AttachmentRecord["docType"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Bill">Bill</SelectItem>
                  <SelectItem value="Receipt">Receipt</SelectItem>
                  <SelectItem value="Supporting">Supporting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="gap-1.5 shadow-sm shadow-primary/20"
              onClick={handleAttach}
            >
              <Paperclip className="size-4" />
              Attach document
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Attached documents</CardTitle>
              <CardDescription>{filtered.length} file(s)</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-64">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files…"
                className="h-8 pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">File</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Linked Txn</TableHead>
                <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No attachments found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{row.fileName}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.size}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.docType}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.linkedTxnNo}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDate(row.uploadedOn)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0",
                          row.status === "Attached"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(row.id)}
                        aria-label="Remove attachment"
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
