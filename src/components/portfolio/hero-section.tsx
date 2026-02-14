"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { imageBlurDataUrl } from "@/lib/data";
import { usePortfolioContent } from "@/components/content/content-provider";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { TiltCard } from "@/components/effects/tilt-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { content, siteStats } = usePortfolioContent();
  const { profile, controls, projects, skills } = content;

  const featuredProject = useMemo(() => {
    const featured = projects.find((item) => item.featured) ?? projects[0];
    return featured ?? null;
  }, [projects]);

  return (
    <section id="home" className="container pt-16 md:pt-24" data-home-section>
      <div className="relative overflow-hidden rounded-3xl border border-border/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.62))] p-7 shadow-[var(--shadow-lg)] backdrop-blur-xl md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(circle_at_88%_14%,rgba(90,170,255,0.16),transparent_52%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_40%_0%,black,transparent_60%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
                <Sparkles className="size-3" />
                {profile.role}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                @{profile.username}
              </Badge>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-[var(--shadow-sm)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Open to internships
              </span>
            </div>

            <motion.h1
              className="text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl"
              initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-muted-foreground">Hi, I am</span>{" "}
              <span className="bg-gradient-to-b from-foreground to-foreground/55 bg-clip-text text-transparent">
                {profile.name}
              </span>
              <span className="text-primary">.</span>
            </motion.h1>

            <motion.p
              className="max-w-2xl text-base text-muted-foreground md:text-lg"
              initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.headline}
            </motion.p>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroValueCard
                title="Product-minded engineering"
                description="Readable UI, clear UX, and maintainable systems that scale."
              />
              <HeroValueCard
                title="Full-stack foundations"
                description="Next.js, TypeScript, PostgreSQL, Prisma, and production workflows."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <MagneticButton>
                <Link href="/projects" className={buttonVariants({ size: "lg" })}>
                  View Projects <ArrowRight className="size-4" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Mail className="size-4" /> Contact
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href={profile.resumeUrl} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Download className="size-4" /> Resume
                </Link>
              </MagneticButton>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-muted-foreground shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:text-foreground"
              >
                <Github className="size-4" /> GitHub <ArrowUpRight className="size-3.5" />
              </Link>
              <Link
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-muted-foreground shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:text-foreground"
              >
                <Linkedin className="size-4" /> LinkedIn <ArrowUpRight className="size-3.5" />
              </Link>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> {profile.location}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {controls.enableCardTilt ? (
                <TiltCard>
                  <HeroPortraitCard
                    avatar={profile.avatar}
                    heroImage={profile.heroImage}
                    name={profile.name}
                    username={profile.username}
                  />
                </TiltCard>
              ) : (
                <HeroPortraitCard avatar={profile.avatar} heroImage={profile.heroImage} name={profile.name} username={profile.username} />
              )}

              {controls.showHeroStats ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatBadge label="Projects" value={siteStats.projects} />
                  <StatBadge label="Skills" value={siteStats.skills} />
                  <StatBadge label="Blogs" value={siteStats.blogs} />
                </div>
              ) : null}

              {featuredProject ? (
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Featured</p>
                  <div className="mt-3 flex items-start gap-3">
                    <Image
                      src={featuredProject.image}
                      alt={featuredProject.title}
                      width={160}
                      height={120}
                      placeholder="blur"
                      blurDataURL={imageBlurDataUrl}
                      className="h-16 w-20 flex-none rounded-xl border border-border/60 object-cover"
                    />
                    <div className="min-w-0 space-y-2">
                      <p className="truncate font-semibold">{featuredProject.title}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{featuredProject.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {featuredProject.tech.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link
                        href={`/projects/${featuredProject.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        View case study <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="hidden rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-sm)] backdrop-blur md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Stack Snapshot</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.slice(0, 10).map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPortraitCard({
  avatar,
  heroImage,
  name,
  username
}: {
  avatar: string;
  heroImage: string;
  name: string;
  username: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 shadow-[var(--shadow-md)]">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Ambient background"
          width={1200}
          height={900}
          placeholder="blur"
          blurDataURL={imageBlurDataUrl}
          className="h-full w-full object-cover opacity-20 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative grid gap-4 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
          <Image
            src={avatar}
            alt={name}
            width={760}
            height={900}
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Profile</p>
            <p className="text-xl font-semibold leading-tight">{name}</p>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-sm)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Focus</p>
            <p className="mt-2 text-sm text-muted-foreground">
              UI polish + backend reliability. Shipping recruiter-friendly products with real constraints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroValueCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-border/60 bg-background/65 p-4 text-center backdrop-blur">
      <p className="text-3xl font-semibold">{value}+</p>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </motion.div>
  );
}

