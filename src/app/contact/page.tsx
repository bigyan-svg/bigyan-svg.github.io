"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { imageBlurDataUrl } from "@/lib/data";
import { usePortfolioContent } from "@/components/content/content-provider";
import { SectionHeading } from "@/components/common/section-heading";
import { ContactForm } from "@/components/portfolio/contact-form";
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

export default function ContactPage() {
  const {
    content: { profile }
  } = usePortfolioContent();

  return (
    <section className="container pb-20 pt-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.62))] p-8 shadow-[var(--shadow-lg)] backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_88%_14%,rgba(90,170,255,0.12),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_40%_0%,black,transparent_60%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
                  <Sparkles className="size-3" />
                  Contact
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Reply by email
                </Badge>
              </div>

              <SectionHeading
                eyebrow="Let's Talk"
                title="Design and ship something iconic"
                description="Share your project context, timeline, and goals. I will reply with a focused plan."
              />

              <div className="flex flex-wrap gap-3">
                <Link href={profile.resumeUrl} target="_blank" className={buttonVariants({ size: "lg" })}>
                  <FileText className="size-4" /> Download Resume <ArrowUpRight className="size-4" />
                </Link>
                <Link href={profile.github} target="_blank" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  <Github className="size-4" /> GitHub <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Channel" value="Email" hint={profile.email} />
              <MetricCard label="Location" value={profile.location.split(",")[0] ?? profile.location} hint={profile.location} />
              <MetricCard label="Availability" value="Remote" hint="Open to internships + projects." />
              <MetricCard label="Response" value="24-48h" hint="Typical reply window." />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal delay={0.06}>
          <Card>
            <CardHeader>
              <CardTitle>Message Form</CardTitle>
              <p className="text-sm text-muted-foreground">Send a message. It will be saved to the inbox and notify you by email.</p>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="overflow-hidden">
            <div className="relative">
              <Image
                src={profile.contactImage}
                alt="Team collaboration session"
                width={1200}
                height={760}
                placeholder="blur"
                blurDataURL={imageBlurDataUrl}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
            <CardHeader>
              <CardTitle>Reach Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="font-semibold">{profile.name}</p>
                <p className="text-muted-foreground">{profile.role}</p>
              </div>

              <Link href={`mailto:${profile.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Mail className="size-4" /> {profile.email}
              </Link>
              <Link href={profile.github} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Github className="size-4" /> github.com/{profile.username}
              </Link>
              <Link href={profile.linkedin} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Linkedin className="size-4" /> linkedin.com/in/{profile.username}
              </Link>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> {profile.location}
              </p>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
