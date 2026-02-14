import Image from "next/image";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/effects/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { imageBlurDataUrl, profile, timeline } from "@/lib/data";

export default function AboutPage() {
  return (
    <section className="container pb-20 pt-16">
      <Reveal>
        <SectionHeading
          eyebrow="About"
          title="Building elegant systems with engineering rigor"
          description="A profile that balances product thinking, interface craft, and backend discipline."
        />
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal delay={0.05}>
          <Card className="overflow-hidden">
            <div className="relative">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={1000}
                height={1100}
                placeholder="blur"
                blurDataURL={imageBlurDataUrl}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
            <CardHeader>
              <CardTitle>{profile.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{profile.role}</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{profile.intro}</p>
              <p>{profile.headline}</p>
              <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                <p>
                  <span className="font-medium text-foreground">Location:</span> {profile.location}
                </p>
                <p>
                  <span className="font-medium text-foreground">Focus:</span> Full-stack product engineering
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeline.map((item) => (
                <article key={item.id} className="rounded-xl border border-border/60 bg-background/55 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-primary">{item.type}</p>
                  <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.organization} • {item.start} - {item.end}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </article>
              ))}
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
