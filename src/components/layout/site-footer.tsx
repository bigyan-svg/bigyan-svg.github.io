import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Bigyan Sanjyal. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="https://github.com/bigyan-svg" target="_blank">
            GitHub
          </Link>
          <Link href="https://linkedin.com/in/bigyan-svg" target="_blank">
            LinkedIn
          </Link>
          <Link href="mailto:bigyan@example.com">Email</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/resources">Resources</Link>
        </div>
      </div>
    </footer>
  );
}
