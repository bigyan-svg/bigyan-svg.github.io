import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ViewTracker } from "@/components/content/view-tracker";
import { getVideoBySlug } from "@/lib/public-data";
import { vimeoEmbedUrl, youtubeEmbedUrl } from "@/lib/video";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug, true);
  if (!video) return {};
  return {
    title: video.title,
    description: video.caption || video.title
  };
}

export default async function VideoDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const video = await getVideoBySlug(slug, draft.isEnabled);
  if (!video) notFound();

  const embedUrl =
    video.source === "YOUTUBE"
      ? youtubeEmbedUrl(video.videoUrl)
      : video.source === "VIMEO"
        ? vimeoEmbedUrl(video.videoUrl)
        : video.videoUrl;

  return (
    <section className="container py-12">
      <ViewTracker entity="video" slug={video.slug} />
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{video.title}</h1>
        {video.source === "UPLOADED" ? (
          <video controls className="aspect-video w-full rounded-lg border border-border">
            <source src={video.videoUrl} />
          </video>
        ) : (
          <iframe
            title={video.title}
            src={embedUrl}
            className="aspect-video w-full rounded-lg border border-border"
            allowFullScreen
          />
        )}
        {video.caption ? <p className="text-muted-foreground">{video.caption}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{video.source}</Badge>
          {(video.tags as string[]).map((tag: string) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
