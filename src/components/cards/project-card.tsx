import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectCardProps = {
  project: {
    title: string;
    slug: string;
    summary: string;
    coverImage: string | null;
    techStack: string[];
    projectType: string;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt={project.title}
          width={900}
          height={520}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge variant="secondary">{project.projectType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
        <Link className="text-sm font-medium text-primary hover:underline" href={`/projects/${project.slug}`}>
          Read project →
        </Link>
      </CardContent>
    </Card>
  );
}
