import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { getSiteResume, getTimeline } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Resume"
};

export default async function ResumePage() {
  const [resume, timeline] = await Promise.all([getSiteResume(), getTimeline()]);

  return (
    <>
      <PageHeader
        title="Resume"
        description="Structured resume data fetched from the database, plus downloadable PDF."
      />
      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>{resume?.fullName || "Bigyan Sanjyal"}</CardTitle>
              <p className="text-sm text-muted-foreground">{resume?.headline}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-7 text-muted-foreground">{resume?.summary}</p>

              <div className="space-y-3">
                <h3 className="font-medium">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(resume?.skills || []).map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Timeline</h3>
                <div className="space-y-3">
                  {timeline.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{item.title}</p>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6 text-sm">
              <p>
                <strong>Email:</strong> {resume?.email}
              </p>
              <p>
                <strong>Phone:</strong> {resume?.phone}
              </p>
              <p>
                <strong>Location:</strong> {resume?.location}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                {resume?.website ? (
                  <Link href={resume.website} target="_blank" className="text-primary hover:underline">
                    {resume.website}
                  </Link>
                ) : (
                  "-"
                )}
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                {resume?.github ? (
                  <Link href={resume.github} target="_blank" className="text-primary hover:underline">
                    Profile
                  </Link>
                ) : (
                  "-"
                )}
              </p>
              {resume?.resumePdfUrl ? (
                <Link href={resume.resumePdfUrl} className={buttonVariants({ variant: "default" })} target="_blank">
                  <Download className="mr-2 size-4" />
                  Download PDF
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
