import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { navItems, profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/50 py-10">
      <div className="container grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Bigyan Sanjyal</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Premium futuristic portfolio UI for recruiters, teams, and product leaders.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href={profile.github} target="_blank" className="inline-flex items-center gap-1 hover:text-foreground">
              <Github className="size-4" /> GitHub
            </Link>
            <Link href={profile.linkedin} target="_blank" className="inline-flex items-center gap-1 hover:text-foreground">
              <Linkedin className="size-4" /> LinkedIn
            </Link>
            <Link href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
              <Mail className="size-4" /> Email
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Mini Sitemap</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted-foreground transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="container mt-8 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        (c) {new Date().getFullYear()} Bigyan Sanjyal. Crafted with Next.js and Framer Motion.
      </div>
    </footer>
  );
}