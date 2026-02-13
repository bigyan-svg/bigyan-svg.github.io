import type { Metadata } from "next";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeline } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Experience & Education"
};

export default async function ExperiencePage() {
  const timeline = await getTimeline();

  return (
    <>
      <PageHeader
        title="Experience & Education"
        description="A timeline of my academic and professional journey."
      />
      <section className="container pb-16">
        <div className="space-y-4">
          {timeline.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-3 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.organization}
                      {item.location ? ` • ${item.location}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(item.startDate, "MMM yyyy")} -{" "}
                      {item.isCurrent ? "Present" : item.endDate ? format(item.endDate, "MMM yyyy") : "N/A"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
