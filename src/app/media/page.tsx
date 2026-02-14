"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import { imageBlurDataUrl } from "@/lib/data";
import { usePortfolioContent } from "@/components/content/content-provider";
import { SectionHeading } from "@/components/common/section-heading";
import { MediaLightbox } from "@/components/portfolio/media-lightbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default function MediaPage() {
  const {
    content: { videos, photos, pdfResources }
  } = usePortfolioContent();

  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Media"
        title="Gallery, video demos, and resources"
        description="A media-rich showcase with lightbox interactions, embed previews, and downloadable PDFs."
      />

      <div className="mt-10 space-y-12">
        <div>
          <h3 className="mb-4 text-2xl font-semibold">Photo Gallery</h3>
          <MediaLightbox photos={photos} />
        </div>

        <div>
          <h3 className="mb-4 text-2xl font-semibold">Video Showcase</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id}>
                <div className="relative overflow-hidden rounded-t-2xl">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={900}
                    height={540}
                    placeholder="blur"
                    blurDataURL={imageBlurDataUrl}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="absolute inset-0 grid place-items-center bg-black/35">
                    <PlayCircle className="size-12 text-white/90" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{video.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{video.platform}</Badge>
                    <span className="text-xs text-muted-foreground">{video.duration}</span>
                  </div>
                  {video.platform === "Uploaded" ? (
                    <video
                      controls
                      preload="metadata"
                      className="aspect-video w-full rounded-xl border border-border/60 bg-black"
                      src={video.url}
                    />
                  ) : (
                    <iframe
                      title={video.title}
                      src={video.url}
                      className="aspect-video w-full rounded-xl border border-border/60"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-2xl font-semibold">PDF Resources</h3>
            <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground">
              Browse all resources
            </Link>
          </div>
          <div className="grid gap-4">
            {pdfResources.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.type}</Badge>
                    <Link href={`/resources/${item.slug}`} className={buttonVariants({ size: "sm", variant: "outline" })}>
                      <FileText className="size-4" /> Preview
                    </Link>
                    <Link href={item.url} target="_blank" className={buttonVariants({ size: "sm" })}>
                      <ExternalLink className="size-4" /> Open
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
