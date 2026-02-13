import { Badge } from "@/components/ui/badge";

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
