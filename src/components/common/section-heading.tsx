import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("space-y-4", className)}>
      {eyebrow ? (
        <p className="inline-flex items-center rounded-full border border-border/70 bg-[linear-gradient(180deg,hsl(var(--background)/0.92),hsl(var(--background)/0.62))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-[var(--shadow-sm)]">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
          <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-balance text-transparent">
            {title}
          </span>
        </h2>
        {description ? <p className="max-w-3xl text-balance text-muted-foreground md:text-lg">{description}</p> : null}
      </div>
    </header>
  );
}
