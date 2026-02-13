import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { listMedia } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Resources"
};

export default async function ResourcesPage() {
  const { documents } = await listMedia({});

  return (
    <>
      <PageHeader
        title="Resources"
        description="Download resume, certificates, reports, and reference documents."
      />
      <section className="container pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{document.title}</p>
                  <p className="text-sm text-muted-foreground">{document.docType}</p>
                </div>
                <Link
                  href={document.fileUrl}
                  target="_blank"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <FileText className="mr-1 size-4" />
                  Open
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
