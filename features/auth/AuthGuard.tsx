"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/AuthProvider";
import { mainNavigation } from "@/config/navigation";
import { canAccessPath, firstAllowedPath } from "@/lib/permissions";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, bootstrapping, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (bootstrapping) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!canAccessPath(user, pathname)) {
      const fallback = firstAllowedPath(user, mainNavigation);
      if (fallback) {
        router.replace(fallback);
      } else {
        logout();
      }
    }
  }, [bootstrapping, isAuthenticated, user, pathname, router, logout]);

  if (bootstrapping) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  if (!canAccessPath(user, pathname)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  return <>{children}</>;
}
