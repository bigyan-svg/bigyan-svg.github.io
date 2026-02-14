import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { ContactForm } from "@/components/portfolio/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { imageBlurDataUrl, profile } from "@/lib/data";

export default function ContactPage() {
  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Contact"
        title="Let us design and ship something iconic"
        description="Share your project context, timeline, and goals. I will reply with a focused plan."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Message Form</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="relative">
            <Image
              src={profile.contactImage}
              alt="Team collaboration session"
              width={1200}
              height={760}
              placeholder="blur"
              blurDataURL={imageBlurDataUrl}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
          <CardHeader>
            <CardTitle>Reach Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-xl border border-border/60 bg-background/60 p-4">
              <p className="font-semibold">Bigyan Sanjyal</p>
              <p className="text-muted-foreground">{profile.role}</p>
            </div>

            <Link href={`mailto:${profile.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Mail className="size-4" /> {profile.email}
            </Link>
            <Link href={profile.github} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Github className="size-4" /> github.com/{profile.username}
            </Link>
            <Link href={profile.linkedin} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Linkedin className="size-4" /> linkedin.com/in/{profile.username}
            </Link>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> {profile.location}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
