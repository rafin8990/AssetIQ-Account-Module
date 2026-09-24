import { env } from "@/config/env";
import {
  clearSession,
  getAccessToken,
  isAccessTokenExpired,
} from "@/lib/auth-storage";

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
  skipAuth?: boolean;
};

let endingSession = false;

function isJwtSessionFailure(status?: number, message?: string): boolean {
  if (status === 401) return true;
  const normalized = (message ?? "").toLowerCase();
  return (
    normalized.includes("jwt expired") ||
    normalized.includes("jwt malformed") ||
    normalized.includes("invalid token") ||
    normalized.includes("invalid signature") ||
    normalized.includes("tokenexpirederror") ||
    normalized.includes("jsonwebtokenerror")
  );
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/login")) return;
  window.location.assign("/login");
}

function endExpiredSession(): void {
  if (typeof window === "undefined" || endingSession) return;
  endingSession = true;
  clearSession();
  redirectToLogin();
}

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
    const { method = "GET", body, params, signal, skipAuth } = options;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;
    if (body !== undefined && !isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (!skipAuth) {
      const token = getAccessToken();
      if (token) {
        if (isAccessTokenExpired(token)) {
          endExpiredSession();
          throw new ApiError(
            "Your session has expired. Please sign in again.",
            401
          );
        }
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(buildUrl(path, params), {
      method,
      signal,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
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

    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof (payload as ApiEnvelope<T>).message === "string"
        ? (payload as ApiEnvelope<T>).message || undefined
        : undefined;

    if (
      !skipAuth &&
      isJwtSessionFailure(response.status, message)
    ) {
      endExpiredSession();
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
export const vendorApi = createApiClient(env.vendorUrl);
