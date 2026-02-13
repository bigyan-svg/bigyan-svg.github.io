import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPosts } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { BlogCard } from "@/components/cards/blog-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PaginationLinks } from "@/components/common/pagination-links";

export const metadata: Metadata = {
  title: "Blog"
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const rawCategory = typeof params.category === "string" ? params.category : "";
  const rawTag = typeof params.tag === "string" ? params.tag : "";
  const category = rawCategory === "all" ? "" : rawCategory;
  const tag = rawTag === "all" ? "" : rawTag;
  const page = Number(typeof params.page === "string" ? params.page : "1");

  const result = await listBlogPosts({
    page,
    pageSize: 9,
    q: q || undefined,
    category: category || undefined,
    tag: tag || undefined
  });

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (category) query.set("category", category);
    if (tag) query.set("tag", tag);
    query.set("page", String(targetPage));
    return `/blog?${query.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Blog"
        description="Engineering notes, architecture writeups, and full-stack implementation stories."
      />
      <section className="container pb-16">
        <form className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4">
          <Input defaultValue={q} name="q" placeholder="Search posts..." />
          <Select
            name="category"
            defaultValue={category || "all"}
            options={[
              { label: "All Categories", value: "all" },
              ...result.categories.map((item) => ({ label: item, value: item }))
            ]}
          />
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
            <Link href="/blog" className="inline-flex h-10 items-center rounded-md border border-input px-4 text-sm">
              Reset
            </Link>
          </div>
        </form>

        <div className="grid gap-6 lg:grid-cols-3">
          {result.items.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <PaginationLinks pagination={result.pagination} buildHref={buildHref} />
      </section>
    </>
  );
}
