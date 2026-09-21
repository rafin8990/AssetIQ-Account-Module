"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppNavbar } from "./app-navbar";
import { AppSidebar } from "./app-sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.02_195)_0%,_transparent_55%),linear-gradient(180deg,var(--background),oklch(0.975_0.008_220))]">
          <AppNavbar />
          <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
