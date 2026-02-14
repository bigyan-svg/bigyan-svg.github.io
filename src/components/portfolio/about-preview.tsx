import { profile, timeline } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/effects/reveal";

export function AboutPreview() {
  return (
    <section id="about-preview" className="container pt-20" data-home-section>
      <Reveal>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>About {profile.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{profile.intro}</p>
              <p>
                Based in {profile.location}, I focus on recruiter-friendly products that still feel high-end, expressive,
                and technically robust.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.organization} • {item.start} - {item.end}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Reveal>
    </section>
  );
}