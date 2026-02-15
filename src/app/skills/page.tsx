"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Filter, Search, Sparkles, X } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { SkillsRadar } from "@/components/portfolio/skills-radar";
import { usePortfolioContent } from "@/components/content/content-provider";
import { Reveal } from "@/components/effects/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SkillCategory } from "@/lib/types";

const categories: Array<SkillCategory | "All"> = ["All", "Frontend", "Backend", "Cloud", "Data", "Tooling"];

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-md)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function SkillsPage() {
  const {
    content: { skills }
  } = usePortfolioContent();
  const [active, setActive] = useState<SkillCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 240);
    return () => clearTimeout(timer);
  }, [active, search]);

  const filtered = useMemo(() => {
    let result = active === "All" ? skills : skills.filter((skill) => skill.category === active);

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (skill) => skill.name.toLowerCase().includes(query) || skill.highlight?.toLowerCase()?.includes(query)
      );
    }

    return result;
  }, [active, search, skills]);

  const avgLevel = useMemo(() => {
    if (!skills.length) return 0;
    const total = skills.reduce((acc, item) => acc + item.level, 0);
    return Math.round(total / skills.length);
  }, [skills]);

  const categoryCount = useMemo(() => new Set(skills.map((skill) => skill.category)).size, [skills]);

  const hasActiveFilters = Boolean(active !== "All" || search.trim());
  const clearFilters = () => {
    setActive("All");
    setSearch("");
  };

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
                  Skills
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  Avg level {avgLevel}%
                </Badge>
              </div>

              <SectionHeading
                eyebrow="Capability Map"
                title="Filterable skill spectrum"
                description="Explore skills by category and inspect capability depth via radar overview and recruiter-friendly progress."
              />

              <div className="flex flex-wrap gap-3">
                <Link href="/projects" className={buttonVariants({ size: "lg" })}>
                  View Projects <ArrowRight className="size-4" />
                </Link>
                <Link href="/contact" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  Contact <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Skills" value={String(skills.length)} />
              <MetricCard label="Categories" value={String(categoryCount)} />
              <MetricCard label="Now Showing" value={String(filtered.length)} />
              <MetricCard label="Filter" value={active === "All" ? "All" : active} />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-10 flex flex-col gap-3 rounded-3xl border border-border/60 bg-background/60 p-5 shadow-[var(--shadow-md)] backdrop-blur md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-2xl border border-border/60 bg-muted/40">
                <Filter className="size-5 text-primary" />
              </span>
              <div>
                <p className="font-semibold">Filter + Search</p>
                <p className="text-sm text-muted-foreground">Find skills fast and keep it recruiter-readable.</p>
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
              <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" placeholder="Search skills..." />
            </div>

            <div className="flex flex-wrap gap-2 md:col-span-7 md:justify-end">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={active === category ? "default" : "outline"}
                  onClick={() => setActive(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal delay={0.08}>
          <Card>
            <CardHeader>
              <CardTitle>Radar Overview</CardTitle>
              <p className="text-sm text-muted-foreground">A quick visual snapshot of relative strengths.</p>
            </CardHeader>
            <CardContent>{loading ? <div className="h-[340px] animate-pulse rounded-2xl bg-muted/40" /> : <SkillsRadar items={filtered} />}</CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.12}>
          <Card>
            <CardHeader>
              <CardTitle>Skill Chips + Progress</CardTitle>
              <p className="text-sm text-muted-foreground">Concrete levels that map to deliverables.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {filtered.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium shadow-[var(--shadow-sm)]"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
              <div className="space-y-3">
                {filtered.map((skill) => (
                  <div key={`${skill.id}-bar`} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${loading ? 0 : skill.level}%` }}
                      />
                    </div>
                    {skill.highlight ? <p className="text-xs text-muted-foreground">{skill.highlight}</p> : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
