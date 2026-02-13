import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type IdeaCardProps = {
  idea: {
    title: string;
    slug: string;
    content: string;
    tags: string[];
    publishAt: Date | null;
  };
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const textContent = idea.content.replace(/<[^>]+>/g, "").slice(0, 160);
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{idea.title}</CardTitle>
        {idea.publishAt ? (
          <span className="text-xs text-muted-foreground">
            {new Date(idea.publishAt).toLocaleDateString()}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{textContent}...</p>
        <div className="flex flex-wrap gap-2">
          {idea.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
        <Link className="text-sm font-medium text-primary hover:underline" href={`/ideas/${idea.slug}`}>
          Read idea →
        </Link>
      </CardContent>
    </Card>
  );
}
