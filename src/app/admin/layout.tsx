"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ensureAdminSession } from "@/lib/client-api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [authorized, setAuthorized] = useState(isLogin);
  const [checking, setChecking] = useState(!isLogin);

  useEffect(() => {
    if (isLogin) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    let cancelled = false;

    const check = async () => {
      setChecking(true);
      const ok = await ensureAdminSession();
      if (cancelled) return;

      if (!ok) {
        setAuthorized(false);
        setChecking(false);
        const next = encodeURIComponent(pathname || "/admin");
        router.replace(`/admin/login?next=${next}`);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    };

    void check();

    return () => {
      cancelled = true;
    };
  }, [isLogin, pathname, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (checking || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Verifying admin session...
        </div>
      </div>
    );
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
