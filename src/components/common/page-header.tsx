import { cn } from "@/lib/utils";

export function PageHeader(props: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={cn("container py-12 md:py-16", props.className)}>
      <div className="section-glass reveal-up relative overflow-hidden rounded-3xl border border-border/70 p-6 shadow-[0_20px_46px_-32px_rgba(24,80,118,0.7)] md:p-10">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-300/25 blur-3xl" />
        <p className="mb-4 inline-flex rounded-full border border-border/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Portfolio Section
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{props.title}</h1>
        {props.description ? (
          <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">{props.description}</p>
        ) : null}
      </div>
    </section>
  );
}
