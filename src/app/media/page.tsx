import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhotoLightbox } from "@/components/media/photo-lightbox";
import { listMedia } from "@/lib/public-data";
import { vimeoEmbedUrl, youtubeEmbedUrl } from "@/lib/video";

export const metadata: Metadata = {
  title: "Media"
};

export default async function MediaPage() {
  const { photos, videos, documents } = await listMedia({});

  return (
    <>
      <PageHeader
        title="Media Gallery"
        description="Photos, videos, and downloadable resources from projects, events, and learning journeys."
      />
      <section className="container space-y-12 pb-16">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Photos</h2>
            <span className="text-sm text-muted-foreground">{photos.length} items</span>
          </div>
          <PhotoLightbox photos={photos.map((p) => ({ id: p.id, title: p.title, imageUrl: p.imageUrl }))} />
          <div className="flex flex-wrap gap-2">
            {photos.slice(0, 8).map((photo) => (
              <Link
                key={photo.id}
                href={`/media/photos/${photo.slug}`}
                className="text-xs text-primary hover:underline"
              >
                {photo.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Videos</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {videos.map((video) => {
              const embedUrl =
                video.source === "YOUTUBE"
                  ? youtubeEmbedUrl(video.videoUrl)
                  : video.source === "VIMEO"
                    ? vimeoEmbedUrl(video.videoUrl)
                    : video.videoUrl;

              return (
                <Card key={video.id}>
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{video.source}</Badge>
                      {video.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                    <p className="text-sm text-muted-foreground">{video.caption}</p>
                    <Link href={`/media/videos/${video.slug}`} className="text-sm text-primary hover:underline">
                      Open detail
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Documents & Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((document) => (
              <Card key={document.id}>
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-medium">{document.title}</p>
                    <p className="text-sm text-muted-foreground">{document.docType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={document.fileUrl}
                      target="_blank"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <FileText className="mr-1 size-4" />
                      Preview
                    </Link>
                    <Link
                      href={`/media/documents/${document.slug}`}
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="mr-1 size-4" />
                      Detail
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
