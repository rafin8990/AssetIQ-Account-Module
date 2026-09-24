"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  createTransactionAttachment,
  deleteTransactionAttachment,
  formatFileSize,
  listTransactionAttachments,
  type AttachmentDocType,
  type TransactionAttachment,
} from "@/features/transactions/api/transaction-attachments";
import { listTransactionHistory } from "@/features/transactions/api/transaction-history";
import { formatDate } from "./data";

type TxnOption = {
  value: string;
  label: string;
};

export function TransactionAttachmentsView() {
  const [rows, setRows] = useState<TransactionAttachment[]>([]);
  const [txnOptions, setTxnOptions] = useState<TxnOption[]>([]);
  const [query, setQuery] = useState("");
  const [linkedTxn, setLinkedTxn] = useState("");
  const [docType, setDocType] = useState<AttachmentDocType | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAttachments = useCallback(async (searchTerm?: string) => {
    const data = await listTransactionAttachments({
      searchTerm: searchTerm || undefined,
    });
    setRows(data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const [attachmentsResult, historyResult] = await Promise.allSettled([
        listTransactionAttachments(),
        listTransactionHistory(),
      ]);

      if (cancelled) return;

      const errors: string[] = [];

      if (attachmentsResult.status === "fulfilled") {
        setRows(attachmentsResult.value);
      } else {
        errors.push(
          attachmentsResult.reason instanceof Error
            ? attachmentsResult.reason.message
            : "Failed to load attachments"
        );
      }

      if (historyResult.status === "fulfilled") {
        const historyOptions = historyResult.value.items.map((txn) => ({
          value: txn.txnNo,
          label: `${txn.txnNo}${
            txn.sourceOrderCode ? ` · ${txn.sourceOrderCode}` : ""
          } — ${txn.narration || txn.account || txn.kind}`,
        }));

        try {
          const { listCustomerInvoices } = await import(
            "@/features/accounts-receivable/api/customer-invoices"
          );
          const invoices = await listCustomerInvoices();
          const invoiceOptions = invoices.map((invoice) => ({
            value: invoice.invoiceNo,
            label: `${invoice.invoiceNo}${
              invoice.sourceOrderCode ? ` · ${invoice.sourceOrderCode}` : ""
            } — ${invoice.customer}`,
          }));
          setTxnOptions([...historyOptions, ...invoiceOptions]);
        } catch {
          setTxnOptions(historyOptions);
        }
      } else {
        errors.push(
          historyResult.reason instanceof Error
            ? historyResult.reason.message
            : "Failed to load transactions"
        );
      }

      setError(errors.length ? errors.join(" · ") : null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAttachments(query.trim()).catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to search attachments"
        );
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query, loadAttachments]);

  const filtered = useMemo(() => rows, [rows]);

  async function handleAttach() {
    if (!file || !linkedTxn || !docType) {
      setError("Select a transaction, document type, and file first.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const created = await createTransactionAttachment({
        file,
        linkedTxnNo: linkedTxn,
        docType,
      });
      setMessage(`Attached ${created.fileName} to ${created.linkedTxnNo}.`);
      setFile(null);
      setDocType("");
      setLinkedTxn("");
      await loadAttachments(query.trim());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload attachment"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    try {
      await deleteTransactionAttachment(id);
      await loadAttachments(query.trim());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete attachment"
      );
    } finally {
      setSaving(false);
    }
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
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card className="border-0 bg-card/90 shadow-sm shadow-primary/5 ring-border/60">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Upload attachment</CardTitle>
          <CardDescription>
            Files are stored on the server and linked to a transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 lg:grid-cols-[1.2fr_1fr]">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-10 text-center transition-colors hover:bg-primary/10">
            <FileUp className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {file?.name ?? "Drop or click to choose a file"}
              </p>
              <p className="text-xs text-muted-foreground">
                Invoice, bill, receipt, or supporting document
              </p>
            </div>
            <Input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
                  <SelectValue
                    placeholder={
                      txnOptions.length
                        ? "Select transaction"
                        : "No transactions found"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {txnOptions.map((txn) => (
                    <SelectItem key={txn.value} value={txn.value}>
                      {txn.label}
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
                  setDocType(value as AttachmentDocType)
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
              disabled={saving || !file || !linkedTxn || !docType}
              onClick={() => void handleAttach()}
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
              <CardDescription>
                {loading ? "Loading…" : `${filtered.length} file(s)`}
              </CardDescription>
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
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
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
                        <a
                          href={row.filePath}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {row.fileName}
                        </a>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(row.fileSize)}
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
                        disabled={saving}
                        onClick={() => void handleDelete(row.id)}
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
