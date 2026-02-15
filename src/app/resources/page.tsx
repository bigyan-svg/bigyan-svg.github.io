"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, FileText, Search, Sparkles } from "lucide-react";
import { usePortfolioContent } from "@/components/content/content-provider";
import { Reveal } from "@/components/effects/reveal";
import { EmptyState } from "@/components/common/empty-state";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const typeFilters = ["All", "Resume", "Certificate", "Report", "Other"] as const;
type TypeFilter = (typeof typeFilters)[number];

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-[var(--shadow-md)] backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function ResourcesPage() {
  const {
    content: { pdfResources }
  } = usePortfolioContent();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("All");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pdfResources.filter((item) => {
      const matchesType = type === "All" ? true : item.type === type;
      if (!matchesType) return false;

      if (!normalizedQuery) return true;
      const haystack = `${item.title} ${item.description}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [pdfResources, query, type]);

  const resourceTypeCount = useMemo(() => new Set(pdfResources.map((item) => item.type)).size, [pdfResources]);

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
                  Resources
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  In-browser previews
                </Badge>
              </div>

              <SectionHeading
                eyebrow="Documents"
                title="PDFs you can preview in-browser"
                description="Upload your resume, certificates, and reports from the admin dashboard. Visitors can preview them without leaving the site."
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="PDFs" value={String(pdfResources.length)} />
              <MetricCard label="Types" value={String(resourceTypeCount)} />
              <MetricCard label="Now Showing" value={String(filtered.length)} />
              <MetricCard label="Filter" value={type} />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search PDFs..." className="pl-9" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {typeFilters.map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={value === type ? "default" : "outline"}
                onClick={() => setType(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No PDFs found" description="Try a different search term, or upload a new document from Admin -> Documents." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(0.08 * index, 0.4)}>
                <Card className="group overflow-hidden border-border/60 bg-background/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-2xl border border-border/60 bg-muted/40">
                          <FileText className="size-5 text-primary" />
                        </span>
                        <div>
                          <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                          <p className="mt-1 text-xs text-muted-foreground">Preview-ready PDF resource</p>
                        </div>
                      </div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    {item.description ? <p className="text-sm text-muted-foreground">{item.description}</p> : null}
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2 pb-6">
                    <Link href={`/resources/${item.slug}`} className={buttonVariants({ size: "sm", variant: "default" })}>
                      <FileText className="size-4" /> Preview
                    </Link>
                    <Link href={item.url} target="_blank" className={buttonVariants({ size: "sm", variant: "outline" })}>
                      <ExternalLink className="size-4" /> Open
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
