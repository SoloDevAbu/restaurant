"use client";

import { Home, List, UtensilsCrossed, ShoppingBag, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/admin/useAuth";

const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Categories", url: "/admin/categories", icon: List },
  { title: "Menu Items", url: "/admin/menu-items", icon: UtensilsCrossed },
  { title: "Orders", url: "/admin/orders", icon: ShoppingBag },
];

export function AppSidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-heading font-bold mb-4 mt-2 px-4 text-foreground">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout.mutate()} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
