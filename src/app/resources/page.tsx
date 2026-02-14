"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, ExternalLink, Search } from "lucide-react";
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

  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Resources"
        title="PDFs you can preview in-browser"
        description="Upload your resume, certificates, and reports from the admin dashboard. Visitors can preview them without leaving the site."
      />

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
          <EmptyState title="No PDFs found" description="Try a different search term, or upload a new document from Admin → Documents." />
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

