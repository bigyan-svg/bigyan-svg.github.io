"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { blogPosts } from "@/lib/data";
import { SectionHeading } from "@/components/common/section-heading";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BlogCard } from "@/components/portfolio/blog-card";
import { EmptyState } from "@/components/common/empty-state";
import { SkeletonGrid } from "@/components/portfolio/skeleton-grid";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [loading, setLoading] = useState(false);

  const tags = useMemo(() => ["all", ...Array.from(new Set(blogPosts.flatMap((post) => post.tags)))], []);
  const categories = useMemo(() => ["all", ...Array.from(new Set(blogPosts.map((post) => post.category)))], []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 260);
    return () => clearTimeout(timer);
  }, [search, category, tag]);

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchSearch =
        !search.trim() ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || post.category === category;
      const matchTag = tag === "all" || post.tags.includes(tag);
      return matchSearch && matchCategory && matchTag;
    });
  }, [search, category, tag]);

  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Blog"
        title="Code-friendly writing experience"
        description="Browse by category and tag, search quickly, and read structured engineering content."
      />

      <div className="mt-8 grid gap-3 rounded-2xl border border-border/60 bg-card/65 p-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10" placeholder="Search posts..." />
        </div>
        <Select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          options={categories.map((value) => ({
            value,
            label: value === "all" ? "All Categories" : value
          }))}
        />
        <Select
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          options={tags.map((value) => ({
            value,
            label: value === "all" ? "All Tags" : `#${value}`
          }))}
        />
      </div>

      <div className="mt-8">
        {loading ? <SkeletonGrid count={6} /> : null}
        {!loading && filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
        {!loading && filtered.length === 0 ? (
          <EmptyState title="No posts found" description="Try another keyword, category, or tag." />
        ) : null}
      </div>
    </section>
  );
}