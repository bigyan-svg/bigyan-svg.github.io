import { SkeletonGrid } from "@/components/portfolio/skeleton-grid";

export default function Loading() {
  return (
    <section className="container py-16">
      <div className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-muted/70" />
      <SkeletonGrid count={6} />
    </section>
  );
}