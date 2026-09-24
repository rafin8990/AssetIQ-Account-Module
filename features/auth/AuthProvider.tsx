"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { getProfile, signIn } from "@/lib/asset-auth-api";
import {
  clearSession,
  getAccessToken,
  getAccessTokenTimeoutDelayMs,
  isAccessTokenExpired,
  persistSession,
  readSession,
} from "@/lib/auth-storage";
import { firstAllowedPath } from "@/lib/permissions";
import { mainNavigation } from "@/config/navigation";
import type { AuthUser, BackendUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  bootstrapping: boolean;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapBackendUser(user: BackendUser): AuthUser {
  const employee = user.employee;
  const name = employee
    ? [employee.first_name, employee.last_name].filter(Boolean).join(" ")
    : user.employee_code;
  return {
    id: user.id,
    name: name || user.employee_code,
    email: employee?.email ?? "",
    employee_code: user.employee_code,
    mobile: employee?.phone ?? undefined,
    role: user.role_name ?? "user",
    permissions: user.permissions ?? [],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const session = readSession();
    if (!session) {
      clearSession();
      setBootstrapping(false);
      return;
    }

    setUser({
      ...session.user,
      permissions: session.user.permissions ?? [],
    });

    getProfile(session.accessToken)
      .then((profile) => {
        const nextUser = mapBackendUser(profile);
        const merged: AuthUser = {
          ...nextUser,
          name: nextUser.name || session.user.name,
          email: nextUser.email || session.user.email,
        };
        persistSession(session.accessToken, merged);
        setUser(merged);
      })
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => {
        setBootstrapping(false);
      });
  }, []);

  const login = useCallback(
    async (identifier: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const email = identifier.trim().includes("@")
          ? identifier.trim()
          : `${identifier.trim()}@assetiq.local`;
        const result = await signIn({ email, password });
        const authUser = mapBackendUser(result.user);
        const landing = firstAllowedPath(authUser, mainNavigation);
        if (!landing) {
          clearSession();
          setUser(null);
          setError(
            "You do not have access to Accounts. Ask an admin to grant Accounts permissions in Asset."
          );
          return;
        }
        persistSession(result.accessToken, authUser);
        setUser(authUser);
        router.replace(landing);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setError(null);
    router.replace("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    const session = readSession();
    if (!session) return;
    const profile = await getProfile(session.accessToken);
    const nextUser = mapBackendUser(profile);
    const merged: AuthUser = {
      ...nextUser,
      name: nextUser.name || session.user.name,
      email: nextUser.email || session.user.email,
    };
    persistSession(session.accessToken, merged);
    setUser(merged);
  }, []);

  useEffect(() => {
    if (!user) return;

    let timeoutId = 0;

    const expireIfNeeded = () => {
      window.clearTimeout(timeoutId);
      const token = getAccessToken();
      if (!token || isAccessTokenExpired(token)) {
        logout();
        return;
      }
      timeoutId = window.setTimeout(
        expireIfNeeded,
        getAccessTokenTimeoutDelayMs(token)
      );
    };

    expireIfNeeded();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        expireIfNeeded();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user, logout]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "accessToken") return;
      if (event.newValue) return;
      setUser(null);
      setError(null);
      router.replace("/login");
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [router]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      bootstrapping,
      loading,
      error,
      login,
      logout,
      clearError,
      refreshUser,
    }),
    [
      user,
      bootstrapping,
      loading,
      error,
      login,
      logout,
      clearError,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
