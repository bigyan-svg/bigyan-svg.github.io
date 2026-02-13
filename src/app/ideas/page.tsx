import type { Metadata } from "next";
import Link from "next/link";
import { listIdeas } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { IdeaCard } from "@/components/cards/idea-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PaginationLinks } from "@/components/common/pagination-links";

export const metadata: Metadata = {
  title: "Ideas"
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function IdeasPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const rawTag = typeof params.tag === "string" ? params.tag : "";
  const tag = rawTag === "all" ? "" : rawTag;
  const page = Number(typeof params.page === "string" ? params.page : "1");

  const result = await listIdeas({
    page,
    pageSize: 12,
    q: q || undefined,
    tag: tag || undefined
  });

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (tag) query.set("tag", tag);
    query.set("page", String(targetPage));
    return `/ideas?${query.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Ideas & Notes"
        description="Short thoughts, experiments, and practical observations from day-to-day development."
      />
      <section className="container pb-16">
        <form className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-3">
          <Input defaultValue={q} name="q" placeholder="Search ideas..." />
          <Select
            name="tag"
            defaultValue={tag || "all"}
            options={[
              { label: "All Tags", value: "all" },
              ...result.tags.map((item) => ({ label: `#${item}`, value: item }))
            ]}
          />
          <div className="flex gap-2">
            <Button type="submit" className="w-full">
              Apply
            </Button>
            <Link href="/ideas" className="inline-flex h-10 items-center rounded-md border border-input px-4 text-sm">
              Reset
            </Link>
          </div>
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.items.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        <PaginationLinks pagination={result.pagination} buildHref={buildHref} />
      </section>
    </>
  );
}
