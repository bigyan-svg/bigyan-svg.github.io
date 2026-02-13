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
    <aside className="w-full border-r border-border bg-card lg:w-64">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-border px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">CMS</p>
          <h2 className="text-lg font-semibold">bigyan-svg admin</h2>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
