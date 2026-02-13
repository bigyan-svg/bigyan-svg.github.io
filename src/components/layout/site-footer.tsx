import Link from "next/link";
import { Github, Linkedin, Mail, Send } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 pb-8 pt-10">
      <div className="container">
        <div className="section-glass relative overflow-hidden rounded-3xl border border-border/70 p-6 shadow-[0_24px_50px_-34px_rgba(23,79,117,0.75)] md:p-8">
          <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/66 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Send className="size-3" />
                Let us build something exceptional
              </p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Bigyan Sanjyal</h2>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Full-stack portfolio and CMS engineered for speed, clarity, and continuous growth.
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <Link href="https://github.com/bigyan-svg" target="_blank" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Github className="size-4" /> GitHub
              </Link>
              <Link href="https://linkedin.com/in/bigyan-svg" target="_blank" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Linkedin className="size-4" /> LinkedIn
              </Link>
              <Link href="mailto:bigyan@example.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Mail className="size-4" /> Email
              </Link>
              <Link href="/resume" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                Resume
              </Link>
            </div>
          </div>

          <div className="relative mt-8 border-t border-border/70 pt-4 text-xs text-muted-foreground">
            (c) {new Date().getFullYear()} Bigyan Sanjyal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}