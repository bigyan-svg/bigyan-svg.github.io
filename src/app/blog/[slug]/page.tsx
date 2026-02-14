import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, imageBlurDataUrl } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const blocks = post.content.split("```");

  return (
    <section className="container pb-20 pt-16">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to blog
      </Link>

      <Card className="mt-6 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          width={1600}
          height={840}
          placeholder="blur"
          blurDataURL={imageBlurDataUrl}
          className="aspect-[16/7] w-full object-cover"
        />
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-xs text-muted-foreground">{post.readingTime}</span>
            <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
          </div>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <p className="text-muted-foreground">{post.excerpt}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {blocks.map((block, index) => {
            if (index % 2 === 1) {
              return (
                <pre
                  key={index}
                  className="overflow-x-auto rounded-xl border border-border/70 bg-slate-950/95 p-4 text-sm text-cyan-200 dark:bg-black/70"
                >
                  <code>{block.trim()}</code>
                </pre>
              );
            }

            return block
              .split("\n\n")
              .filter(Boolean)
              .map((paragraph) => (
                <p key={`${index}-${paragraph.slice(0, 12)}`} className="text-[15px] leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ));
          })}
        </CardContent>
      </Card>
    </section>
  );
}
