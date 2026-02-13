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
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

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
        <div className="section-glass flex items-center gap-2 rounded-xl border border-border/70 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Verifying admin session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/35 lg:flex">
      <AdminSidebar />
      <div className="relative z-10 flex-1">
        <div className="px-4 pb-0 pt-4 md:px-6">
          <div className="section-glass flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 px-5 py-4 shadow-[0_20px_38px_-30px_rgba(26,82,119,0.75)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Portfolio Control Center
              </p>
              <p className="text-sm font-medium text-foreground/90">Manage projects, media, blogs, and ideas</p>
            </div>
            <span className="rounded-full border border-border/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {today}
            </span>
          </div>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
