"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navItems, homeSectionItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { CommandPalette } from "@/components/common/command-palette";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.45 }
    );

    homeSectionItems.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-3 z-40 px-3">
      <div className="container">
        <div className="rounded-2xl border border-border/70 bg-background/75 px-3 backdrop-blur-xl shadow-[0_24px_45px_-38px_rgba(0,0,0,0.8)]">
          <div className="flex h-14 items-center justify-between gap-3">
            <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-primary md:text-base">
              BIGYAN-SVG
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative rounded-lg px-3 py-2 text-sm font-medium transition",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {active ? (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute inset-x-1 -bottom-1 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 420, damping: 35 }}
                      />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-1 md:flex">
              <CommandPalette />
              <ThemeToggle />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Toggle menu"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>

          <div className={cn("overflow-hidden transition-all lg:hidden", open ? "max-h-[380px] pb-3" : "max-h-0")}> 
            <div className="grid gap-1 border-t border-border/60 pt-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    pathname === item.href
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-1 flex items-center justify-between px-1">
                <ThemeToggle />
                <CommandPalette />
              </div>
            </div>
          </div>

          {pathname === "/" ? (
            <div className="hidden items-center justify-center gap-2 border-t border-border/60 py-2 lg:flex">
              {homeSectionItems.map((section) => (
                <div key={section.id} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all",
                      activeSection === section.id ? "bg-primary shadow-[0_0_14px_hsl(var(--primary))]" : "bg-muted-foreground/40"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-[0.12em]",
                      activeSection === section.id ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {section.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}