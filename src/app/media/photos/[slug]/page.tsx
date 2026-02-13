import type { Metadata } from "next";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ViewTracker } from "@/components/content/view-tracker";
import { getPhotoBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug, true);
  if (!photo) return {};
  return {
    title: photo.title,
    description: photo.caption || photo.title
  };
}

export default async function PhotoDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const photo = await getPhotoBySlug(slug, draft.isEnabled);

  if (!photo) notFound();

  return (
    <section className="container py-12">
      <ViewTracker entity="photo" slug={photo.slug} />
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{photo.title}</h1>
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          width={1200}
          height={900}
          className="w-full rounded-lg border border-border object-cover"
        />
        {photo.caption ? <p className="text-muted-foreground">{photo.caption}</p> : null}
        <div className="flex flex-wrap gap-2">
          {(photo.tags as string[]).map((tag: string) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
