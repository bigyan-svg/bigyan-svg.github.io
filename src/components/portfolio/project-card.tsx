"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import type { Project } from "@/lib/types";
import { imageBlurDataUrl } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/effects/tilt-card";
import { buttonVariants } from "@/components/ui/button";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full">
      <Card className="h-full overflow-hidden">
        <div className="group relative">
          <Image
            src={project.image}
            alt={project.title}
            width={960}
            height={580}
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
          <Badge className="absolute left-3 top-3" variant="secondary">
            {project.type}
          </Badge>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle>{project.title}</CardTitle>
            <Badge variant={project.status === "Live" ? "success" : "outline"}>{project.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{project.summary}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/projects/${project.slug}`} className={buttonVariants({ size: "sm", variant: "outline" })}>
              Details <ArrowUpRight className="size-3.5" />
            </Link>
            {project.liveUrl ? (
              <Link href={project.liveUrl} target="_blank" className={buttonVariants({ size: "sm", variant: "ghost" })}>
                <Globe className="size-3.5" /> Live
              </Link>
            ) : null}
            {project.githubUrl ? (
              <Link href={project.githubUrl} target="_blank" className={buttonVariants({ size: "sm", variant: "ghost" })}>
                <Github className="size-3.5" /> Code
              </Link>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}