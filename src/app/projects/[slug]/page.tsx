import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { RenderHtml } from "@/components/content/render-html";
import { ViewTracker } from "@/components/content/view-tracker";
import { getProjectBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, true);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : []
    }
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const project = await getProjectBySlug(slug, draft.isEnabled);

  if (!project) {
    notFound();
  }

  return (
    <section className="container py-12">
      <ViewTracker entity="project" slug={project.slug} />
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.projectType}</Badge>
            <span className="text-xs text-muted-foreground">{project.views} views</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{project.title}</h1>
          <p className="text-muted-foreground">{project.summary}</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {project.liveUrl ? (
              <Link href={project.liveUrl} target="_blank" className="text-primary hover:underline">
                Live Demo
              </Link>
            ) : null}
            {project.repoUrl ? (
              <Link href={project.repoUrl} target="_blank" className="text-primary hover:underline">
                Repository
              </Link>
            ) : null}
          </div>
        </div>

        <RenderHtml html={project.content} />
      </div>
    </section>
  );
}
