import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BlogCardProps = {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    category: string;
    tags: string[];
    publishAt: Date | null;
  };
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden">
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={900}
          height={520}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          {post.publishAt ? (
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishAt).toLocaleDateString()}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
        <Link className="text-sm font-medium text-primary hover:underline" href={`/blog/${post.slug}`}>
          Read post →
        </Link>
      </CardContent>
    </Card>
  );
}
