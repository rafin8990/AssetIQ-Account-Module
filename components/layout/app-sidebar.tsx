"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Landmark, LogOut } from "lucide-react";

import { mainNavigation, type NavItem } from "@/config/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { filterNavigation } from "@/lib/permissions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isPathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveDropdownHref(pathname: string, items: NavItem[]) {
  for (const item of items) {
    if (!item.children?.length) continue;
    if (item.children.some((child) => isPathActive(pathname, child.href))) {
      return item.href;
    }
    if (isPathActive(pathname, item.href)) {
      return item.href;
    }
  }
  return null;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function NavMenuItem({
  item,
  pathname,
  openDropdown,
  onOpenChange,
}: {
  item: NavItem;
  pathname: string;
  openDropdown: string | null;
  onOpenChange: (href: string, open: boolean) => void;
}) {
  const isActive = isPathActive(pathname, item.href);
  const childActive = item.children?.some((child) =>
    isPathActive(pathname, child.href)
  );

  if (item.children?.length) {
    const isOpen = openDropdown === item.href;

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={(open) => onOpenChange(item.href, open)}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={Boolean(childActive)}
              className={cn(
                "h-9 rounded-md text-[13px] font-medium text-sidebar-foreground/85 transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:shadow-none"
              )}
            >
              <item.icon className="size-4 shrink-0 opacity-80" />
              <span className="flex-1 truncate text-left">{item.title}</span>
              <ChevronRight
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200",
                  "group-data-[state=open]/collapsible:rotate-90 group-data-[state=open]/collapsible:text-primary"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="ml-3.5 mr-0 border-l border-sidebar-border/80 py-1 pl-2.5">
              {item.children.map((child) => {
                const childIsActive = isPathActive(pathname, child.href);
                return (
                  <SidebarMenuSubItem key={child.href}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={childIsActive}
                      className={cn(
                        "h-8 rounded-md text-[12.5px] text-sidebar-foreground/75",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        childIsActive &&
                          "bg-primary/10 font-medium text-primary data-active:bg-primary/10 data-active:text-primary"
                      )}
                    >
                      <Link href={child.href}>
                        <child.icon className="size-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{child.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "h-9 rounded-md text-[13px] font-medium text-sidebar-foreground/85 transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "data-[active=true]:bg-primary/10 data-[active=true]:font-medium data-[active=true]:text-primary data-[active=true]:shadow-none"
        )}
      >
        <Link href={item.href}>
          <item.icon className="size-4 shrink-0 opacity-80" />
          <span className="truncate">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navigation = useMemo(
    () => filterNavigation(mainNavigation, user),
    [user]
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(() =>
    getActiveDropdownHref(pathname, navigation)
  );

  useEffect(() => {
    setOpenDropdown(getActiveDropdownHref(pathname, navigation));
  }, [pathname, navigation]);

  function handleOpenChange(href: string, open: boolean) {
    setOpenDropdown(open ? href : null);
  }

  const displayName = user?.name || user?.employee_code || "User";
  const displayEmail = user?.email || user?.employee_code || "";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border print:hidden">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 overflow-hidden rounded-lg px-1 outline-none ring-sidebar-ring focus-visible:ring-2"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <Landmark className="size-4" />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
              AssetIQ Accounts
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              Finance workspace
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navigation.map((item) => (
                <NavMenuItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  openDropdown={openDropdown}
                  onOpenChange={handleOpenChange}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2.5">
        <div className="flex items-center gap-2.5 overflow-hidden rounded-lg px-1.5 py-1.5 group-data-[collapsible=icon]:justify-center">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">
              {initials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              {displayName}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {displayEmail}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
            onClick={logout}
            aria-label="Sign out"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
