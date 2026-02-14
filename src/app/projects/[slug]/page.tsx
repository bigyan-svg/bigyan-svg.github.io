import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects, imageBlurDataUrl } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="container pb-20 pt-16">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to projects
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            width={1400}
            height={900}
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
            className="aspect-[16/9] w-full object-cover"
          />
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{project.type}</Badge>
              <Badge variant={project.status === "Live" ? "success" : "outline"}>{project.status}</Badge>
              <Badge variant="outline">{project.year}</Badge>
            </div>
            <CardTitle className="text-3xl">{project.title}</CardTitle>
            <p className="text-muted-foreground">{project.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Highlights</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Role:</span> {project.role}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {project.liveUrl ? (
                <Link href={project.liveUrl} target="_blank" className={buttonVariants({ variant: "default" })}>
                  <ExternalLink className="size-4" /> Live Preview
                </Link>
              ) : null}
              {project.githubUrl ? (
                <Link href={project.githubUrl} target="_blank" className={buttonVariants({ variant: "outline" })}>
                  <Github className="size-4" /> Repository
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
