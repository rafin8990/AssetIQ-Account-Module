import { env } from "@/config/env";
import type { BackendUser } from "@/types/auth";

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResult = {
  accessToken: string;
  user: BackendUser;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string | null;
  data: T;
};

async function assetAuthRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    body?: unknown;
    token?: string | null;
    skipAuth?: boolean;
  } = {}
): Promise<T> {
  const { method = "GET", body, token, skipAuth } = options;
  const url = `${env.assetUrl.replace(/\/+$/, "")}/${path.replace(/^\//, "")}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (!skipAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let payload: ApiEnvelope<T> | T | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T> | T;
    } catch {
      throw new Error(text || `Request failed (${response.status})`);
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
      throw new Error(
        envelope.message || `Request failed (${response.status})`
      );
    }
    return envelope.data;
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return payload as T;
}

export function signIn(payload: SignInPayload): Promise<SignInResult> {
  return assetAuthRequest<SignInResult>("/auth/sign-in", {
    method: "POST",
    body: { email: payload.email.trim(), password: payload.password },
    skipAuth: true,
  });
}

export function getProfile(token: string): Promise<BackendUser> {
  return assetAuthRequest<BackendUser>("/auth/profile", {
    method: "GET",
    token,
  });
}
