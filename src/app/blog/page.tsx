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
import { BlogCard } from "@/components/portfolio/blog-card";
import { EmptyState } from "@/components/common/empty-state";
import { SkeletonGrid } from "@/components/portfolio/skeleton-grid";
import { imageBlurDataUrl } from "@/lib/data";

export default function BlogPage() {
  const reduceMotion = useReducedMotion();
  const {
    content: { blogPosts }
  } = usePortfolioContent();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [loading, setLoading] = useState(false);

  const tags = useMemo(() => ["all", ...Array.from(new Set(blogPosts.flatMap((post) => post.tags)))], [blogPosts]);
  const categories = useMemo(() => ["all", ...Array.from(new Set(blogPosts.map((post) => post.category)))], [blogPosts]);
  const featuredPost = useMemo(() => blogPosts[0] ?? null, [blogPosts]);

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
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((item) => item.toLowerCase().includes(search.toLowerCase())) ||
        post.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || post.category === category;
      const matchTag = tag === "all" || post.tags.includes(tag);
      return matchSearch && matchCategory && matchTag;
    });
  }, [blogPosts, search, category, tag]);

  const hasActiveFilters = Boolean(search.trim() || category !== "all" || tag !== "all");
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setTag("all");
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
                  Engineering notes
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {blogPosts.length} posts
                </Badge>
              </div>

              <SectionHeading
                eyebrow="Blog"
                title="Readable writing for real builds"
                description="Architecture notes, implementation details, and lessons learned shipping full-stack products."
              />

              <div className="flex flex-wrap gap-3">
                <Link href="#all-posts" className={buttonVariants({ size: "lg" })}>
                  Browse Posts <ArrowRight className="size-4" />
                </Link>
                <Link href="/contact" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  Ask a question <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Categories" value={new Set(blogPosts.map((p) => p.category)).size} />
              <MetricCard label="Tags" value={new Set(blogPosts.flatMap((p) => p.tags)).size} />
              <MetricCard label="Now Showing" value={filtered.length} />
              <MetricCard label="Latest" value={featuredPost ? new Date(featuredPost.publishedAt).getFullYear() : new Date().getFullYear()} />
            </div>
          </div>
        </div>
      </Reveal>

      {featuredPost ? (
        <div className="mt-10">
          <Reveal delay={0.05}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Latest Drop</p>
                <h3 className="text-2xl font-semibold md:text-3xl">{featuredPost.title}</h3>
              </div>
              <Link href={`/blog/${featuredPost.slug}`} className="text-sm text-primary hover:underline">
                Read post
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 shadow-[var(--shadow-lg)] backdrop-blur">
              <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <Link href={`/blog/${featuredPost.slug}`} className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    width={1400}
                    height={900}
                    placeholder="blur"
                    blurDataURL={imageBlurDataUrl}
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{featuredPost.category}</Badge>
                    <Badge variant="outline">{featuredPost.readingTime}</Badge>
                  </div>
                </Link>

                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">{featuredPost.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {featuredPost.tags.slice(0, 8).map((value) => (
                      <Badge key={value} variant="outline">
                        #{value}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`} className={buttonVariants({ size: "lg" })}>
                    Read full post <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      ) : null}

      <section id="all-posts" className="mt-12 scroll-mt-24">
        <Reveal delay={0.08}>
          <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-background/60 p-5 shadow-[var(--shadow-md)] backdrop-blur md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-2xl border border-border/60 bg-muted/40">
                  <Filter className="size-5 text-primary" />
                </span>
                <div>
                  <p className="font-semibold">Filter + Search</p>
                  <p className="text-sm text-muted-foreground">Find posts by category, tag, or keyword.</p>
                </div>
              </div>

              {hasActiveFilters ? (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <X className="size-4" /> Clear filters
                </Button>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-12">
              <div className="relative md:col-span-6">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-10"
                  placeholder="Search posts by title, excerpt, or tags..."
                />
              </div>

              <Select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                options={categories.map((value) => ({
                  value,
                  label: value === "all" ? "All Categories" : value
                }))}
                className="md:col-span-3"
              />

              <Select
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                options={tags.map((value) => ({
                  value,
                  label: value === "all" ? "All Tags" : `#${value}`
                }))}
                className="md:col-span-3"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{filtered.length} results</span>
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
                  {filtered.map((post) => (
                    <motion.div
                      key={post.id}
                      layout={!reduceMotion}
                      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <BlogCard post={post} />
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
                  <EmptyState title="No posts found" description="Try another keyword, category, or tag." />
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
