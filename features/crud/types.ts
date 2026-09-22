export type CrudFieldType = "text" | "number" | "textarea" | "select";

export type CrudField = {
  key: string;
  label: string;
  type?: CrudFieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
};

export type CrudColumn = {
  key: string;
  label: string;
  className?: string;
};

export type CrudRow = Record<string, string | number> & { id: string };

export type CrudApiAdapter = {
  list: () => Promise<CrudRow[]>;
  create: (payload: Record<string, string | number>) => Promise<CrudRow>;
  update: (
    id: string,
    payload: Record<string, string | number>
  ) => Promise<CrudRow>;
  delete: (id: string) => Promise<void>;
};

export type CrudPageConfig = {
  title: string;
  description: string;
  entityName: string;
  columns: CrudColumn[];
  fields: CrudField[];
  initialRows: CrudRow[];
  /** When set, CrudPage loads and mutates data via the live API. */
  api?: CrudApiAdapter;
};
