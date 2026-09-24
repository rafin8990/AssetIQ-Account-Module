import { accountsApi } from "@/lib/api-client";

export type AttachmentDocType = "Invoice" | "Bill" | "Receipt" | "Supporting";
export type AttachmentStatus = "Attached" | "Pending review";

export type TransactionAttachment = {
  id: string;
  fileName: string;
  storedName: string;
  filePath: string;
  fileSize: number;
  mimeType?: string;
  docType: AttachmentDocType;
  linkedTxnNo: string;
  linkedTxnKind?: string;
  status: AttachmentStatus;
  uploadedOn: string;
};

type ApiAttachment = {
  id: number | string;
  file_name: string;
  stored_name: string;
  file_path: string;
  file_size: number | string;
  mime_type?: string | null;
  doc_type: AttachmentDocType;
  linked_txn_no: string;
  linked_txn_kind?: string | null;
  status: AttachmentStatus;
  uploaded_on: string;
};

function mapAttachment(row: ApiAttachment): TransactionAttachment {
  return {
    id: String(row.id),
    fileName: row.file_name,
    storedName: row.stored_name,
    filePath: row.file_path,
    fileSize: Number(row.file_size),
    mimeType: row.mime_type ?? undefined,
    docType: row.doc_type,
    linkedTxnNo: row.linked_txn_no,
    linkedTxnKind: row.linked_txn_kind ?? undefined,
    status: row.status,
    uploadedOn: String(row.uploaded_on).slice(0, 10),
  };
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function listTransactionAttachments(options?: {
  searchTerm?: string;
  docType?: AttachmentDocType;
  status?: AttachmentStatus;
}): Promise<TransactionAttachment[]> {
  const rows = await accountsApi.get<ApiAttachment[]>(
    "/transaction-attachments",
    {
      params: {
        page: 1,
        limit: 200,
        sortBy: "created_at",
        sortOrder: "desc",
        searchTerm: options?.searchTerm,
        doc_type: options?.docType,
        status: options?.status,
      },
    }
  );
  return rows.map(mapAttachment);
}

export async function createTransactionAttachment(payload: {
  file: File;
  linkedTxnNo: string;
  docType: AttachmentDocType;
  status?: AttachmentStatus;
}): Promise<TransactionAttachment> {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("linked_txn_no", payload.linkedTxnNo);
  form.append("doc_type", payload.docType);
  if (payload.status) form.append("status", payload.status);

  const created = await accountsApi.post<ApiAttachment>(
    "/transaction-attachments",
    form
  );
  return mapAttachment(created);
}

export async function deleteTransactionAttachment(id: string): Promise<void> {
  await accountsApi.delete(`/transaction-attachments/${id}`);
}
