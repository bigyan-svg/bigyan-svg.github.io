import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteResume } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "About"
};

export default async function AboutPage() {
  const resume = await getSiteResume();

  return (
    <>
      <PageHeader
        title="About Me"
        description="A practical engineer who values clarity, maintainability, and user-centered outcomes."
      />
      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardContent className="space-y-4 p-6">
              <p>{resume?.summary}</p>
              <p className="text-muted-foreground">
                I focus on turning complex requirements into reliable software with clean architecture and measurable performance.
              </p>
              <p className="text-muted-foreground">
                I enjoy backend architecture, UX-driven frontend implementation, and iterative product improvement from data and feedback.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6 text-sm">
              <p>
                <strong>Name:</strong> {resume?.fullName || "Bigyan Sanjyal"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <Link href={`mailto:${resume?.email || "bigyan@example.com"}`}>
                  {resume?.email || "bigyan@example.com"}
                </Link>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <Link href={resume?.github || "https://github.com/bigyan-svg"} target="_blank">
                  bigyan-svg
                </Link>
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <Link
                  href={resume?.linkedin || "https://linkedin.com/in/bigyan-svg"}
                  target="_blank"
                >
                  /in/bigyan-svg
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
