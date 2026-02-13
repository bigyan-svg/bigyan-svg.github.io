import type { Metadata } from "next";
import Link from "next/link";
import { getProjectFilterOptions, listProjects } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { PaginationLinks } from "@/components/common/pagination-links";
import { ProjectCard } from "@/components/cards/project-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Projects"
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const rawTech = typeof params.tech === "string" ? params.tech : "";
  const rawType = typeof params.type === "string" ? params.type : "";
  const tech = rawTech === "all" ? "" : rawTech;
  const type = rawType === "all" ? "" : rawType;
  const page = Number(typeof params.page === "string" ? params.page : "1");

  const [result, filters] = await Promise.all([
    listProjects({ page, pageSize: 9, q: q || undefined, tech: tech || undefined, type: type || undefined }),
    getProjectFilterOptions()
  ]);

  const techOptions = filters.tech;

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (tech) query.set("tech", tech);
    if (type) query.set("type", type);
    query.set("page", String(targetPage));
    return `/projects?${query.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Selected engineering projects with architecture notes and implementation details."
      />
      <section className="container pb-16">
        <form className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4">
          <Input defaultValue={q} name="q" placeholder="Search projects..." />
          <Select
            name="type"
            defaultValue={type || "all"}
            options={[
              { label: "All Types", value: "all" },
              ...filters.types.map((item) => ({
                label: item,
                value: item
              }))
            ]}
          />
          <Select
            name="tech"
            defaultValue={tech || "all"}
            options={[
              { label: "All Tech", value: "all" },
              ...techOptions.map((item) => ({
                label: item,
                value: item
              }))
            ]}
          />
          <div className="flex gap-2">
            <Button type="submit" className="w-full">
              Apply
            </Button>
            <Link href="/projects" className="inline-flex h-10 items-center rounded-md border border-input px-4 text-sm">
              Reset
            </Link>
          </div>
        </form>

        <div className="grid gap-6 lg:grid-cols-3">
          {result.items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <PaginationLinks pagination={result.pagination} buildHref={buildHref} />
      </section>
    </>
  );
}
