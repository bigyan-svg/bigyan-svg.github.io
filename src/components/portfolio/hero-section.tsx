"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, Mail, Sparkles } from "lucide-react";
import { profile, siteStats } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MagneticButton } from "@/components/effects/magnetic-button";

const headlineWords = ["Out-of-the-world", "Full-Stack", "Portfolio", "Experience"];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="container pt-16 md:pt-24" data-home-section>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-7 shadow-[0_30px_60px_-35px_rgba(0,0,0,0.75)] backdrop-blur-xl md:p-12">
        <div className="absolute -left-16 -top-14 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
              <Sparkles className="size-3" />
              {profile.role}
            </Badge>

            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              {headlineWords.map((word, index) => (
                <motion.span
                  key={word}
                  className="mr-3 inline-block"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.1, duration: 0.45 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{profile.headline}</p>

            <div className="flex flex-wrap gap-3">
              <MagneticButton>
                <Link href="/projects" className={buttonVariants({ size: "lg" })}>
                  View Projects <ArrowRight className="size-4" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href={profile.resumeUrl} target="_blank" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Download className="size-4" /> Download Resume
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <Mail className="size-4" /> Contact
                </Link>
              </MagneticButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StatBadge label="Projects" value={siteStats.projects} />
            <StatBadge label="Skills" value={siteStats.skills} />
            <StatBadge label="Blogs" value={siteStats.blogs} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-border/60 bg-background/65 p-4 text-center backdrop-blur"
    >
      <p className="text-3xl font-semibold">{value}+</p>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    </motion.div>
  );
}