import { env } from "@/config/env";

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type ApiEnvelope<T> = {
  statusCode?: number;
  success: boolean;
  message?: string | null;
  meta?: ApiMeta;
  data: T;
};

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
};

function createApiClient(baseUrl: string) {
  function buildUrl(
    path: string,
    params?: RequestOptions["params"]
  ): string {
    const url = new URL(
      path.replace(/^\//, ""),
      `${baseUrl.replace(/\/+$/, "")}/`
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        url.searchParams.set(key, String(value));
      });
    }

    return url.toString();
  }

  async function request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = "GET", body, params, signal } = options;
    const response = await fetch(buildUrl(path, params), {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let payload: ApiEnvelope<T> | T | null = null;
    const text = await response.text();
    if (text) {
      try {
        payload = JSON.parse(text) as ApiEnvelope<T> | T;
      } catch {
        throw new ApiError(
          text || `Request failed (${response.status})`,
          response.status
        );
      }
    }

    if (
      payload &&
      typeof payload === "object" &&
      "success" in payload &&
      "data" in payload
    ) {
      const envelope = payload as ApiEnvelope<T>;
      if (!response.ok || envelope.success === false) {
        throw new ApiError(
          envelope.message || `Request failed (${response.status})`,
          response.status
        );
      }
      return envelope.data;
    }

    if (!response.ok) {
      throw new ApiError(
        `Request failed (${response.status})`,
        response.status
      );
    }

    return payload as T;
  }

  return {
    get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
      return request<T>(path, { ...options, method: "GET" });
    },
    post<T>(
      path: string,
      body?: unknown,
      options?: Omit<RequestOptions, "method" | "body">
    ) {
      return request<T>(path, { ...options, method: "POST", body });
    },
    patch<T>(
      path: string,
      body?: unknown,
      options?: Omit<RequestOptions, "method" | "body">
    ) {
      return request<T>(path, { ...options, method: "PATCH", body });
    },
    delete<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
      return request<T>(path, { ...options, method: "DELETE" });
    },
  };
}

export const accountsApi = createApiClient(env.accountsUrl);
export const assetApi = createApiClient(env.assetUrl);
