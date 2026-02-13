import { cn } from "@/lib/utils";

export function PageHeader(props: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={cn("container py-12 md:py-16", props.className)}>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{props.title}</h1>
      {props.description ? (
        <p className="mt-3 max-w-3xl text-muted-foreground">{props.description}</p>
      ) : null}
    </section>
  );
}
