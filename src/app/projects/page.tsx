"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Filter, Search, Sparkles, X } from "lucide-react";
import { usePortfolioContent } from "@/components/content/content-provider";
import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProjectCard } from "@/components/portfolio/project-card";
import { EmptyState } from "@/components/common/empty-state";
import { SkeletonGrid } from "@/components/portfolio/skeleton-grid";
import { imageBlurDataUrl } from "@/lib/data";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const reduceMotion = useReducedMotion();
  const {
    content: { projects }
  } = usePortfolioContent();
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(false);

  const featuredProject = useMemo(() => {
    const featured = projects.find((project) => project.featured) ?? projects[0];
    return featured ?? null;
  }, [projects]);

  const techOptions = useMemo(() => {
    const allTags = new Set(projects.flatMap((project) => project.tech));
    return ["all", ...Array.from(allTags)];
  }, [projects]);

  const typeOptions = useMemo(() => ["all", ...Array.from(new Set(projects.map((project) => project.type)))], [projects]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(timer);
  }, [search, tech, type, sort]);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.summary.toLowerCase().includes(query) ||
          project.tech.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (tech !== "all") {
      result = result.filter((project) => project.tech.includes(tech));
    }

    if (type !== "all") {
      result = result.filter((project) => project.type === type);
    }

    if (sort === "featured") {
      result = result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    if (sort === "latest") {
      result = result.sort((a, b) => Number(b.year) - Number(a.year));
    }
    if (sort === "az") {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [projects, search, tech, type, sort]);

  const hasActiveFilters = Boolean(search.trim() || tech !== "all" || type !== "all" || sort !== "featured");
  const clearFilters = () => {
    setSearch("");
    setTech("all");
    setType("all");
    setSort("featured");
  };

  return (
    <section className="container pb-20 pt-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.62))] p-8 shadow-[var(--shadow-lg)] backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_88%_14%,rgba(90,170,255,0.14),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_40%_0%,black,transparent_60%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
                  <Sparkles className="size-3" />
                  Curated work
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {projects.length} projects
                </Badge>
              </div>

              <SectionHeading
                eyebrow="Projects"
                title="Case studies built for impact"
                description="A recruiter-friendly portfolio with production foundations: structure, performance, and clean UX."
              />

              <div className="flex flex-wrap gap-3">
                <Link href="#all-projects" className={buttonVariants({ size: "lg" })}>
                  Browse Projects <ArrowRight className="size-4" />
                </Link>
                <Link href="/contact" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  Hire / Collaborate <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Featured" value={projects.filter((p) => p.featured).length} />
              <MetricCard label="Stacks" value={new Set(projects.flatMap((p) => p.tech)).size} />
              <MetricCard label="Types" value={new Set(projects.map((p) => p.type)).size} />
              <MetricCard label="Now Showing" value={filtered.length} />
            </div>
          </div>
        </div>
      </Reveal>

      {featuredProject ? (
        <div className="mt-10">
          <Reveal delay={0.05}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Featured Case Study</p>
                <h3 className="text-2xl font-semibold md:text-3xl">{featuredProject.title}</h3>
              </div>
              <Link href={`/projects/${featuredProject.slug}`} className="text-sm text-primary hover:underline">
                View details
              </Link>
            </div>

            <FeaturedProject project={featuredProject} reduceMotion={reduceMotion ?? false} />
          </Reveal>
        </div>
      ) : null}

      <section id="all-projects" className="mt-12 scroll-mt-24">
        <Reveal delay={0.08}>
          <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-background/60 p-5 shadow-[var(--shadow-md)] backdrop-blur md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-2xl border border-border/60 bg-muted/40">
                  <Filter className="size-5 text-primary" />
                </span>
                <div>
                  <p className="font-semibold">Filter + Search</p>
                  <p className="text-sm text-muted-foreground">Narrow by type, tech stack, or keyword.</p>
                </div>
              </div>

              {hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <X className="size-4" /> Clear filters
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-12">
              <div className="relative md:col-span-5">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-10"
                  placeholder="Search projects by title, summary, or tech..."
                />
              </div>

              <Select
                value={tech}
                onChange={(event) => setTech(event.target.value)}
                options={techOptions.map((value) => ({
                  label: value === "all" ? "All Tech" : value,
                  value
                }))}
                className="md:col-span-3"
              />

              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                options={[
                  { label: "Sort: Featured", value: "featured" },
                  { label: "Sort: Latest", value: "latest" },
                  { label: "Sort: A-Z", value: "az" }
                ]}
                className="md:col-span-4"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {typeOptions.map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={type === value ? "default" : "outline"}
                  onClick={() => setType(value)}
                >
                  {value === "all" ? "All Types" : value}
                </Button>
              ))}
              <span className="ml-auto text-sm text-muted-foreground">{filtered.length} results</span>
            </div>
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={reduceMotion ? undefined : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                >
                  <SkeletonGrid count={6} />
                </motion.div>
              ) : filtered.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filtered.map((project) => (
                    <motion.div
                      key={project.id}
                      layout={!reduceMotion}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                >
                  <EmptyState title="No projects found" description="Try changing search terms, tech stack, or type." />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-sm)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function FeaturedProject({ project, reduceMotion }: { project: Project; reduceMotion: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 shadow-[var(--shadow-lg)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,hsl(var(--primary)/0.16),transparent_55%)]" />

      <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
          <Image
            src={project.image}
            alt={project.title}
            width={1400}
            height={900}
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.type}</Badge>
            <Badge variant={project.status === "Live" ? "success" : "outline"}>{project.status}</Badge>
            <Badge variant="outline">{project.year}</Badge>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Summary</p>
            <p className="text-lg font-semibold leading-tight">{project.summary}</p>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 8).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {project.highlights.slice(0, 3).map((highlight) => (
              <motion.div
                key={highlight}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground"
              >
                {highlight}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/projects/${project.slug}`} className={buttonVariants({ size: "lg" })}>
              View Case Study <ArrowRight className="size-4" />
            </Link>
            {project.liveUrl ? (
              <Link href={project.liveUrl} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Live Demo <ArrowUpRight className="size-4" />
              </Link>
            ) : null}
            {project.githubUrl ? (
              <Link href={project.githubUrl} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Source <ArrowUpRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
