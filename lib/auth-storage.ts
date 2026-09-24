import type { AuthUser } from "@/types/auth";

const KEYS = {
  accessToken: "accessToken",
  user: "user",
} as const;

const JWT_CLOCK_SKEW_MS = 5_000;
const MAX_TIMEOUT_MS = 2_147_483_647;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const segments = token.split(".");
    if (segments.length < 2) return null;
    const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

function getAccessTokenExpiryMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp * 1000;
}

export function isAccessTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const expiryMs = getAccessTokenExpiryMs(token);
  if (expiryMs === null) return true;
  return Date.now() >= expiryMs - JWT_CLOCK_SKEW_MS;
}

function getAccessTokenTtlMs(token: string): number {
  const expiryMs = getAccessTokenExpiryMs(token);
  if (expiryMs === null) return 0;
  return Math.max(0, expiryMs - JWT_CLOCK_SKEW_MS - Date.now());
}

export function getAccessTokenTimeoutDelayMs(token: string): number {
  return Math.min(getAccessTokenTtlMs(token), MAX_TIMEOUT_MS);
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(KEYS.accessToken);
}

export function getStoredUser(): AuthUser | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function persistSession(accessToken: string, user: AuthUser): void {
  if (!canUseStorage()) return;
  localStorage.setItem(KEYS.accessToken, accessToken);
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function clearSession(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(KEYS.accessToken);
  localStorage.removeItem(KEYS.user);
}

export function readSession(): { accessToken: string; user: AuthUser } | null {
  const accessToken = getAccessToken();
  const user = getStoredUser();
  if (!accessToken || !user) return null;
  if (isAccessTokenExpired(accessToken)) {
    clearSession();
    return null;
  }
  return { accessToken, user };
}
