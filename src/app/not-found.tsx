import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="container py-20 text-center">
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 inline-block text-primary hover:underline">
        Go back home
      </Link>
    </section>
  );
}
