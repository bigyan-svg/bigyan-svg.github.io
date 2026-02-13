import { cn } from "@/lib/utils";

export function RenderHtml({ html, className }: { html: string; className?: string }) {
  return (
    <article
      className={cn("prose-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
