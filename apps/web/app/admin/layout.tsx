"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 h-screen overflow-y-auto bg-muted/20">
        <div className="p-4 flex items-center gap-2 border-b bg-background sticky top-0 z-10">
          <SidebarTrigger />
          <h1 className="font-semibold text-lg font-heading">Restaurant Admin</h1>
        </div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
