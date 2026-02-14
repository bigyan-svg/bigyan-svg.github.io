"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, FileDown, FileText } from "lucide-react";
import { usePortfolioContent } from "@/components/content/content-provider";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function ResourceDetailPage() {
  const params = useParams<{ slug: string }>();
  const {
    content: { pdfResources }
  } = usePortfolioContent();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const resource = useMemo(() => pdfResources.find((item) => item.slug === slug), [pdfResources, slug]);

  if (!resource) {
    return (
      <section className="container pb-20 pt-16">
        <EmptyState title="Resource not found" description="This PDF was removed, unpublished, or the slug has changed." />
      </section>
    );
  }

  return (
    <section className="container pb-20 pt-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to resources
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{resource.type}</Badge>
          <a href={resource.url} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", variant: "outline" })}>
            <ExternalLink className="size-4" /> Open
          </a>
          <a href={resource.url} className={buttonVariants({ size: "sm" })}>
            <FileDown className="size-4" /> Download
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden border-border/60 bg-background/60 backdrop-blur">
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl border border-border/60 bg-muted/40">
                  <FileText className="size-5 text-primary" />
                </span>
                <CardTitle className="text-2xl md:text-3xl">{resource.title}</CardTitle>
              </div>
              <Badge variant="secondary">{resource.type}</Badge>
            </div>
            {resource.description ? <p className="text-muted-foreground">{resource.description}</p> : null}
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[72vh] w-full border-t border-border/60 bg-muted/20">
              <iframe
                title={resource.title}
                src={resource.url}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>If the embedded preview does not load (some hosts block iframes), use the Open button.</p>
            <p>
              To add or update PDFs, go to <span className="font-medium text-foreground">Admin → Documents</span> and upload a PDF from your device.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

