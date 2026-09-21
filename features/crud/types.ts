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

export type CrudPageConfig = {
  title: string;
  description: string;
  entityName: string;
  columns: CrudColumn[];
  fields: CrudField[];
  initialRows: CrudRow[];
};
