"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Github, Linkedin, Sparkles } from "lucide-react";
import { imageBlurDataUrl } from "@/lib/data";
import { usePortfolioContent } from "@/components/content/content-provider";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/effects/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function AboutPage() {
  const {
    content: { profile, timeline }
  } = usePortfolioContent();

  return (
    <section className="container pb-20 pt-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.62))] p-8 shadow-[var(--shadow-lg)] backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_88%_14%,rgba(90,170,255,0.12),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_40%_0%,black,transparent_60%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
                  <Sparkles className="size-3" />
                  About
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {timeline.length} timeline entries
                </Badge>
              </div>

              <SectionHeading
                eyebrow="Profile"
                title="Building elegant systems with engineering rigor"
                description="A recruiter-friendly snapshot that balances product thinking, interface craft, and backend discipline."
              />

              <div className="flex flex-wrap gap-3">
                <Link href={profile.github} target="_blank" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  <Github className="size-4" /> GitHub <ArrowUpRight className="size-4" />
                </Link>
                <Link href={profile.linkedin} target="_blank" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  <Linkedin className="size-4" /> LinkedIn <ArrowUpRight className="size-4" />
                </Link>
                <Link href={profile.resumeUrl} target="_blank" className={buttonVariants({ size: "lg" })}>
                  <FileText className="size-4" /> Resume <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Role" value={profile.role.includes("BE") ? "BE" : "Engineer"} hint={profile.role} />
              <MetricCard label="Focus" value="Full-stack" hint="Design + engineering discipline." />
              <MetricCard label="Location" value={profile.location.split(",")[0] ?? profile.location} hint="Remote-friendly collaboration." />
              <MetricCard label="Strength" value="Systems" hint="Performance, DX, reliability." />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal delay={0.05}>
          <Card className="overflow-hidden">
            <div className="relative">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={1000}
                height={1100}
                placeholder="blur"
                blurDataURL={imageBlurDataUrl}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
            <CardHeader>
              <CardTitle>{profile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{profile.role}</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{profile.intro}</p>
              <p>{profile.headline}</p>
              <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                <p>
                  <span className="font-medium text-foreground">Location:</span> {profile.location}
                </p>
                <p>
                  <span className="font-medium text-foreground">Focus:</span> Full-stack product engineering
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">A quick view of education and experience milestones.</p>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-border/60" />
                {timeline.map((item) => (
                  <article key={item.id} className="relative rounded-2xl border border-border/60 bg-background/55 p-4 pl-12 shadow-[var(--shadow-sm)]">
                    <div className="absolute left-3 top-6 grid size-5 place-items-center rounded-full border border-border/60 bg-background shadow-[var(--shadow-sm)]">
                      <span className="size-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.55)]" />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{item.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.start} - {item.end}
                      </p>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.organization}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
