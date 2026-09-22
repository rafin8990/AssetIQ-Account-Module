/** Accounts microservice base URL — must include `/api/v1`. */
export const DEFAULT_ACCOUNTS_URL = "http://localhost:5009/api/v1";
/** Asset microservice base URL — must include `/api/v1`. */
export const DEFAULT_ASSET_URL = "http://localhost:5005/api/v1";

function normalizeApiBaseUrl(base: string | undefined, fallback: string): string {
  return (base ?? fallback).replace(/\/+$/, "");
}

export const env = {
  accountsUrl: normalizeApiBaseUrl(
    process.env.NEXT_PUBLIC_ACCOUNTS_URL,
    DEFAULT_ACCOUNTS_URL
  ),
  assetUrl: normalizeApiBaseUrl(
    process.env.NEXT_PUBLIC_ASSET_URL,
    DEFAULT_ASSET_URL
  ),
};
