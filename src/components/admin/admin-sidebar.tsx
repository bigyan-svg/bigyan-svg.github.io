"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  FileText,
  FolderOpen,
  GalleryVerticalEnd,
  Lightbulb,
  LogOut,
  MessageSquare,
  Newspaper,
  Sparkles,
  Upload,
  UserRound
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCsrfToken } from "@/lib/client-api";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/blog-posts", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/admin/photos", label: "Photos", icon: GalleryVerticalEnd },
  { href: "/admin/videos", label: "Videos", icon: FolderOpen },
  { href: "/admin/uploads", label: "Upload Manager", icon: Upload },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/timeline", label: "Timeline", icon: UserRound },
  { href: "/admin/resume", label: "Resume", icon: UserRound },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const logout = async () => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
        credentials: "include"
      });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    }
  };

  return (
    <aside className="relative z-10 w-full p-4 lg:w-72 lg:p-6">
      <div className="section-glass flex h-full max-h-[calc(100vh-2rem)] flex-col rounded-3xl border border-border/70 shadow-[0_24px_44px_-34px_rgba(24,80,118,0.75)]">
        <div className="border-b border-border/70 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">CMS</p>
          <h2 className="text-xl font-semibold tracking-tight">bigyan-svg admin</h2>
          <p className="mt-1 text-xs text-muted-foreground">Control your complete portfolio universe</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_14px_24px_-18px_hsl(var(--primary)/0.95)]"
                    : "text-muted-foreground hover:bg-white/80 hover:text-foreground"
                )}
              >
                <Icon className={cn("size-4", active ? "text-primary-foreground" : "text-primary")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/70 p-3">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}