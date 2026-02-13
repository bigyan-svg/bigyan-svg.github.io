import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { TagList } from "@/components/content/tag-list";
import { RenderHtml } from "@/components/content/render-html";
import { ViewTracker } from "@/components/content/view-tracker";
import { CodeHighlight } from "@/components/content/code-highlight";
import { getBlogBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug, true);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : []
    }
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const post = await getBlogBySlug(slug, draft.isEnabled);
  if (!post) {
    notFound();
  }

  return (
    <section className="container py-12">
      <ViewTracker entity="blog" slug={post.slug} />
      <CodeHighlight />
      <article className="mx-auto max-w-4xl space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {post.publishAt ? new Date(post.publishAt).toLocaleDateString() : "Draft"}
            </span>
            <span className="text-xs text-muted-foreground">{post.views} views</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="text-muted-foreground">{post.excerpt}</p>
          <TagList tags={post.tags} />
        </div>
        <RenderHtml html={post.content} />
      </article>
    </section>
  );
}
