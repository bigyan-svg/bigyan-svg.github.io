"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { projects } from "@/lib/data";
import { SectionHeading } from "@/components/common/section-heading";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ProjectCard } from "@/components/portfolio/project-card";
import { EmptyState } from "@/components/common/empty-state";
import { SkeletonGrid } from "@/components/portfolio/skeleton-grid";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(false);

  const techOptions = useMemo(() => {
    const allTags = new Set(projects.flatMap((project) => project.tech));
    return ["all", ...Array.from(allTags)];
  }, []);

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
  }, [search, tech, type, sort]);

  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Projects"
        title="Advanced project grid"
        description="Filter by stack and type, search across metadata, and inspect cinematic card interactions."
      />

      <div className="mt-8 grid gap-3 rounded-2xl border border-border/60 bg-card/65 p-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" placeholder="Search projects..." />
        </div>

        <Select
          value={type}
          onChange={(event) => setType(event.target.value)}
          options={[
            { label: "All Types", value: "all" },
            ...Array.from(new Set(projects.map((project) => project.type))).map((value) => ({
              label: value,
              value
            }))
          ]}
        />

        <Select
          value={tech}
          onChange={(event) => setTech(event.target.value)}
          options={techOptions.map((value) => ({
            label: value === "all" ? "All Tech" : value,
            value
          }))}
        />

        <Select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          options={[
            { label: "Sort: Featured", value: "featured" },
            { label: "Sort: Latest", value: "latest" },
            { label: "Sort: A-Z", value: "az" }
          ]}
          className="md:col-span-2"
        />
      </div>

      <div className="mt-8">
        {loading ? <SkeletonGrid count={6} /> : null}

        {!loading && filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : null}

        {!loading && filtered.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Try changing search terms, tech stack, or project type."
          />
        ) : null}
      </div>
    </section>
  );
}