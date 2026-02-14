"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Copy, ExternalLink, FileText } from "lucide-react";
import { imageBlurDataUrl } from "@/lib/data";
import { prepareRichText } from "@/lib/rich-text";
import { formatDate } from "@/lib/utils";
import { usePortfolioContent } from "@/components/content/content-provider";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const {
    content: { blogPosts }
  } = usePortfolioContent();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const post = useMemo(() => blogPosts.find((item) => item.slug === slug), [blogPosts, slug]);
  const [copying, setCopying] = useState(false);

  const prepared = useMemo(() => (post ? prepareRichText(post.content) : { html: "", toc: [] }), [post]);

  if (!post) {
    return (
      <section className="container pb-20 pt-16">
        <EmptyState title="Blog post not found" description="This post was removed or the slug has changed." />
      </section>
    );
  }

  const onCopyLink = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied.");
    } catch {
      toast.error("Unable to copy link.");
    } finally {
      setCopying(false);
    }
  };

  return (
    <section className="container pb-20 pt-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to blog
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <a href="#content" className={buttonVariants({ size: "sm", variant: "outline" })}>
            <FileText className="size-4" /> Jump to content
          </a>
          <Button type="button" size="sm" variant="outline" onClick={() => void onCopyLink()} disabled={copying}>
            <Copy className="size-4" /> {copying ? "Copying..." : "Copy link"}
          </Button>
          <Link href={post.coverImage} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", variant: "outline" })}>
            <ExternalLink className="size-4" /> Open cover
          </Link>
        </div>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="relative">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1600}
            height={840}
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
            className="aspect-[16/7] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-black/30 p-4 text-white backdrop-blur md:bottom-6 md:left-6 md:right-6 md:p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="secondary">{post.category}</Badge>
              <Badge variant="outline">{post.readingTime}</Badge>
              <span className="text-white/75">{formatDate(post.publishedAt)}</span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold leading-tight md:text-4xl">{post.title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/80 md:text-base">{post.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 10).map((value) => (
                <span
                  key={value}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90"
                >
                  #{value}
                </span>
              ))}
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_320px]">
            <article id="content" className="min-w-0">
              <div className="richtext" dangerouslySetInnerHTML={{ __html: prepared.html }} />
            </article>

            <aside className="space-y-4">
              <Card className="border-border/60 bg-background/60 shadow-[var(--shadow-sm)]">
                <CardHeader>
                  <CardTitle>On This Page</CardTitle>
                </CardHeader>
                <CardContent>
                  {prepared.toc.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No headings detected in this post.</p>
                  ) : (
                    <nav aria-label="Table of contents" className="space-y-2 text-sm">
                      {prepared.toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={
                            item.level === 3
                              ? "block pl-4 text-muted-foreground hover:text-foreground"
                              : "block text-muted-foreground hover:text-foreground"
                          }
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/60 shadow-[var(--shadow-sm)]">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>If you want to collaborate or ask about this post, send a short message with context.</p>
                  <Link href="/contact" className={buttonVariants({ size: "sm" })}>
                    Contact <ExternalLink className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

