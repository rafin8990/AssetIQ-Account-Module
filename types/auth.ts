export type AuthUser = {
  id: number;
  name: string;
  email: string;
  employee_code: string;
  mobile?: string;
  role: string;
  permissions: string[];
};

export type BackendEmployee = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type BackendUser = {
  id: number;
  employee_code: string;
  role_id: number;
  role_name: string | null;
  is_changed_password?: boolean;
  status?: string;
  employee?: BackendEmployee;
  permissions?: string[];
};
