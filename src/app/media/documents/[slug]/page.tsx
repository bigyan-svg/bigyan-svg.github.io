import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDocumentBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const document = await getDocumentBySlug(slug, true);
  if (!document) return {};
  return {
    title: document.title,
    description: document.description || document.title
  };
}

export default async function DocumentDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const document = await getDocumentBySlug(slug, draft.isEnabled);
  if (!document) notFound();

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-3xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">{document.title}</h1>
        <Badge variant="secondary">{document.docType}</Badge>
        <p className="text-muted-foreground">{document.description}</p>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Link href={document.fileUrl} target="_blank" className="text-primary hover:underline">
              Open document preview
            </Link>
            <iframe
              src={document.fileUrl}
              className="h-[70vh] w-full rounded-lg border border-border"
              title={document.title}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
