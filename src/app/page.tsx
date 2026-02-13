import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/cards/project-card";
import { BlogCard } from "@/components/cards/blog-card";
import { IdeaCard } from "@/components/cards/idea-card";
import {
  getFeaturedProjects,
  getSiteResume,
  listBlogPosts,
  listIdeas
} from "@/lib/public-data";

export default async function HomePage() {
  const [resume, projects, blog, ideas] = await Promise.all([
    getSiteResume(),
    getFeaturedProjects(3),
    listBlogPosts({ page: 1, pageSize: 3 }),
    listIdeas({ page: 1, pageSize: 3 })
  ]);

  return (
    <>
      <section className="container py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-border bg-white/60 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
              BE Computer Engineering Student
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                {resume?.fullName || "Bigyan Sanjyal"}
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                {resume?.headline ||
                  "I design and build full-stack products that are fast, useful, and easy to maintain."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="https://github.com/bigyan-svg" target="_blank" className={buttonVariants({ variant: "outline" })}>
                <Github className="mr-2 size-4" />
                GitHub
              </Link>
              <Link href="https://linkedin.com/in/bigyan-svg" target="_blank" className={buttonVariants({ variant: "outline" })}>
                <Linkedin className="mr-2 size-4" />
                LinkedIn
              </Link>
              <Link href="mailto:bigyan@example.com" className={buttonVariants({ variant: "outline" })}>
                <Mail className="mr-2 size-4" />
                Email
              </Link>
              <Link href={resume?.resumePdfUrl || "/resume"} className={buttonVariants({ variant: "default" })}>
                <Download className="mr-2 size-4" />
                Download Resume
              </Link>
            </div>
          </div>
          <Card className="border-primary/20 bg-gradient-to-br from-white via-white to-accent/40">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Quick Snapshot</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold">{projects.length}</p>
                  <p className="text-xs text-muted-foreground">Featured Projects</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{blog.items.length}</p>
                  <p className="text-xs text-muted-foreground">Recent Blog Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{resume?.skills.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Core Skills</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{ideas.items.length}</p>
                  <p className="text-xs text-muted-foreground">Latest Ideas</p>
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center text-sm font-medium text-primary">
                Learn more about me <ArrowRight className="ml-1 size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
          <Link href="/projects" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Latest Blog Posts</h2>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {blog.items.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Ideas & Notes</h2>
          <Link href="/ideas" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {ideas.items.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>
    </>
  );
}
