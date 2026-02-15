import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { getAdminCredentials, getAdminSessionFromCookies } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/app/admin/login/login-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { imageBlurDataUrl } from "@/lib/data";

export default async function AdminLoginPage() {
  const session = await getAdminSessionFromCookies();
  if (session) {
    redirect("/admin");
  }

  const creds = getAdminCredentials();

  return (
    <section className="container pb-20 pt-16">
      <div className="relative overflow-hidden rounded-3xl border border-border/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.64))] p-8 shadow-[var(--shadow-lg)] backdrop-blur-xl md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_92%_18%,rgba(90,170,255,0.12),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_40%_0%,black,transparent_60%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="flex flex-col justify-center gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
                <Sparkles className="size-3" /> Admin
              </Badge>
              <Badge variant="outline" className="inline-flex items-center gap-1 text-[10px]">
                <ShieldCheck className="size-3" /> Secure login
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Secure dashboard login
              </h1>
              <p className="max-w-prose text-sm text-muted-foreground md:text-base">
                Sign in to manage content, uploads, and settings. Only authenticated admins can access the CMS.
              </p>
            </div>

            <AdminLoginForm defaultEmail={creds.email} />

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <Link href="/" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-primary hover:bg-primary/5">
                Back to site <ArrowUpRight className="size-3.5" />
              </Link>
              <span className="inline-flex items-center gap-2">
                Public URL:
                <a
                  href="https://bigyan-svggithubio.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                >
                  bigyan-svggithubio.vercel.app
                </a>
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/20 shadow-[var(--shadow-lg)]">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1600&q=80"
                alt="Abstract sci-fi circuit board"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={imageBlurDataUrl}
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,32,72,0.08),rgba(10,32,72,0.2))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(255,255,255,0.95),transparent_56%),radial-gradient(circle_at_84%_18%,rgba(234,246,255,0.72),transparent_55%)] opacity-90" />
            </div>

            <div className="relative flex h-full flex-col justify-end p-6">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-5 shadow-[var(--shadow-md)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Admin capabilities</p>
                <ul className="mt-4 grid gap-3 text-sm text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-9 place-items-center rounded-xl border border-border/60 bg-muted/30 text-primary">
                      <ShieldCheck className="size-4" />
                    </span>
                    <span className="leading-relaxed">
                      CRUD for projects, blog, skills, timeline, photos, videos, and PDFs with draft + schedule.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-9 place-items-center rounded-xl border border-border/60 bg-muted/30 text-primary">
                      <Sparkles className="size-4" />
                    </span>
                    <span className="leading-relaxed">
                      Upload manager for images, PDFs, and videos. Paste links or upload from your device.
                    </span>
                  </li>
                </ul>
                <div className="mt-5">
                  <a href="/admin" className={buttonVariants({ variant: "outline" })}>
                    Go to dashboard (after login) <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
