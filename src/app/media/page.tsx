"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FileText, PlayCircle, Sparkles } from "lucide-react";
import { imageBlurDataUrl } from "@/lib/data";
import { usePortfolioContent } from "@/components/content/content-provider";
import { SectionHeading } from "@/components/common/section-heading";
import { MediaLightbox } from "@/components/portfolio/media-lightbox";
import { Reveal } from "@/components/effects/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-md)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function MediaPage() {
  const {
    content: { videos, photos, pdfResources }
  } = usePortfolioContent();

  return (
    <section className="container pb-20 pt-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border/55 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.62))] p-8 shadow-[var(--shadow-lg)] backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,hsl(var(--primary)/0.16),transparent_55%),radial-gradient(circle_at_88%_14%,rgba(90,170,255,0.12),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_40%_0%,black,transparent_60%)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="inline-flex items-center gap-1 text-[10px]">
                  <Sparkles className="size-3" />
                  Media
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {photos.length + videos.length + pdfResources.length} items
                </Badge>
              </div>

              <SectionHeading
                eyebrow="Gallery"
                title="Photos, video demos, and PDF resources"
                description="A media-rich showcase with lightbox interactions, embed previews, and downloadable PDFs."
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Photos" value={String(photos.length)} />
              <MetricCard label="Videos" value={String(videos.length)} />
              <MetricCard label="PDFs" value={String(pdfResources.length)} />
              <MetricCard label="Lightbox" value="Enabled" />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 space-y-12">
        <Reveal delay={0.06}>
        <div>
          <h3 className="mb-4 text-2xl font-semibold">Photo Gallery</h3>
          <MediaLightbox photos={photos} />
        </div>
        </Reveal>

        <Reveal delay={0.1}>
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
        </Reveal>

        <Reveal delay={0.12}>
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
        </Reveal>
      </div>
    </section>
  );
}
