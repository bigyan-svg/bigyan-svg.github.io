import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { imageBlurDataUrl } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group h-full overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={960}
            height={600}
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
              <Clock className="size-3.5" /> {post.readingTime}
            </span>
          </div>
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 5).map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formatDate(post.publishedAt)}</span>
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-primary hover:underline">
            Read <ArrowRight className="size-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
