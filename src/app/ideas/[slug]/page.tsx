import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { TagList } from "@/components/content/tag-list";
import { RenderHtml } from "@/components/content/render-html";
import { ViewTracker } from "@/components/content/view-tracker";
import { getIdeaBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug, true);
  if (!idea) return {};
  return {
    title: idea.title,
    description: idea.content.replace(/<[^>]+>/g, "").slice(0, 140)
  };
}

export default async function IdeaDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const idea = await getIdeaBySlug(slug, draft.isEnabled);

  if (!idea) {
    notFound();
  }

  return (
    <section className="container py-12">
      <ViewTracker entity="idea" slug={idea.slug} />
      <article className="mx-auto max-w-3xl space-y-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{idea.title}</h1>
          <p className="text-sm text-muted-foreground">
            {idea.publishAt ? new Date(idea.publishAt).toLocaleDateString() : "Draft"} • {idea.views} views
          </p>
          <TagList tags={idea.tags} />
        </div>
        <RenderHtml html={idea.content} />
      </article>
    </section>
  );
}
