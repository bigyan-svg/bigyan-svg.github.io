"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <AdminSidebar />
      <div className="flex-1">
        <div className="border-b border-border bg-background px-6 py-4">
          <p className="text-sm text-muted-foreground">Portfolio CMS Dashboard</p>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
