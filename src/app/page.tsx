import Link from "next/link";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Orbit,
  Sparkles,
  Zap
} from "lucide-react";
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

  const quickStats = [
    {
      label: "Featured Projects",
      value: projects.length,
      icon: Orbit
    },
    {
      label: "Recent Blog Posts",
      value: blog.items.length,
      icon: Sparkles
    },
    {
      label: "Core Skills",
      value: resume?.skills.length || 0,
      icon: Zap
    }
  ];

  return (
    <>
      <section className="container pb-10 pt-8 md:pb-14 md:pt-12">
        <div className="section-glass bg-grid-soft reveal-up relative overflow-hidden rounded-[2rem] border border-border/70 p-6 shadow-[0_30px_62px_-42px_rgba(22,80,120,0.74)] md:p-10">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-amber-300/25 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div className="space-y-6">
              <p className="inline-flex items-center rounded-full border border-border/70 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                BE Computer Engineering Student
              </p>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                  {resume?.fullName || "Bigyan Sanjyal"}
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  {resume?.headline ||
                    "I architect and build full-stack products with iconic user experience, reliable backend design, and sharp execution speed."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="https://github.com/bigyan-svg" target="_blank" className={buttonVariants({ variant: "outline" })}>
                  <Github className="size-4" />
                  GitHub
                </Link>
                <Link href="https://linkedin.com/in/bigyan-svg" target="_blank" className={buttonVariants({ variant: "outline" })}>
                  <Linkedin className="size-4" />
                  LinkedIn
                </Link>
                <Link href="mailto:bigyan@example.com" className={buttonVariants({ variant: "outline" })}>
                  <Mail className="size-4" />
                  Email
                </Link>
                <Link href={resume?.resumePdfUrl || "/resume"} className={buttonVariants({ variant: "default" })}>
                  <Download className="size-4" />
                  Download Resume
                </Link>
              </div>
            </div>

            <Card className="shine-sweep border-primary/20 bg-white/80">
              <CardContent className="space-y-5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Orbit Snapshot</p>
                <div className="space-y-3">
                  {quickStats.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="rounded-xl border border-border/70 bg-white/72 p-3"
                      >
                        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          <Icon className="size-3.5" />
                          {item.label}
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
                <Link href="/about" className="inline-flex items-center text-sm font-medium text-primary">
                  Explore profile <ArrowRight className="ml-1 size-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Build</p>
            <h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
          </div>
          <Link href="/projects" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(projects as any[]).map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Write</p>
            <h2 className="text-2xl font-semibold tracking-tight">Latest Blog Posts</h2>
          </div>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {(blog.items as any[]).map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="container pb-16 pt-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Think</p>
            <h2 className="text-2xl font-semibold tracking-tight">Ideas and Notes</h2>
          </div>
          <Link href="/ideas" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {(ideas.items as any[]).map((idea: any) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>
    </>
  );
}