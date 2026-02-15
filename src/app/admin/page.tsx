import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import { SectionHeading } from "@/components/common/section-heading";
import { AdminShellPreview } from "@/components/portfolio/admin-shell-preview";
import { AdminLogoutButton } from "@/components/portfolio/admin-logout-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-md)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export default async function AdminPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <section className="container pb-20 pt-16">
      <div className="relative overflow-hidden rounded-3xl border border-border/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.64))] p-8 shadow-[var(--shadow-lg)] backdrop-blur-xl md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_88%_14%,rgba(90,170,255,0.12),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_40%_0%,black,transparent_60%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
                <Sparkles className="size-3" />
                Admin CMS
              </Badge>
              <Badge variant="outline" className="inline-flex items-center gap-1 text-[10px]">
                <ShieldCheck className="size-3" />
                {session.email}
              </Badge>
            </div>

            <SectionHeading
              eyebrow="Dashboard"
              title="Control the live portfolio"
              description="Projects, blog posts, skills, timeline, media, and documents. Changes persist to PostgreSQL and render instantly on the public site."
            />

            <div className="flex flex-wrap gap-3">
              <Link href="/" target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg", variant: "outline" })}>
                <ExternalLink className="size-4" /> Open Public Site
              </Link>
              <AdminLogoutButton />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Mode" value="Live" hint="Published + scheduled content." />
            <MetricCard label="Auth" value="JWT" hint="Secure cookie session token." />
            <MetricCard label="Uploads" value="Media" hint="Image/PDF/video upload manager." />
            <MetricCard label="SEO" value="Ready" hint="Sitemap + robots + meta." />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <AdminShellPreview />
      </div>
    </section>
  );
}
