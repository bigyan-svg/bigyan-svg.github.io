"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/ideas", label: "Ideas" },
  { href: "/media", label: "Media" },
  { href: "/resources", label: "Resources" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-4 z-50 px-3">
      <div className="container">
        <div className="section-glass border-border/70 relative rounded-2xl border shadow-[0_18px_38px_-30px_rgba(23,79,117,0.72)] backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="group inline-flex items-center gap-2 text-base font-semibold tracking-tight md:text-lg">
              <span className="glow-pulse inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                bigyan-svg
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                      active
                        ? "bg-primary/12 text-foreground shadow-[inset_0_0_0_1px_rgba(0,161,227,0.3)]"
                        : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>

          <div
            className={cn(
              "overflow-hidden border-t border-border/60 px-4 transition-all duration-300 md:hidden",
              open ? "max-h-[480px] py-4" : "max-h-0 py-0"
            )}
          >
            <div className="grid gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-primary/12 text-foreground"
                        : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}