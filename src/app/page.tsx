"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { usePortfolioContent } from "@/components/content/content-provider";
import { HeroSection } from "@/components/portfolio/hero-section";
import { AboutPreview } from "@/components/portfolio/about-preview";
import { SkillsRadar } from "@/components/portfolio/skills-radar";
import { ProjectCard } from "@/components/portfolio/project-card";
import { BlogCard } from "@/components/portfolio/blog-card";
import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  const { content } = usePortfolioContent();
  const { controls, skills, projects, blogPosts } = content;

  return (
    <>
      <HeroSection />

      {controls.showHomeAboutPreview ? <AboutPreview /> : null}

      {controls.showHomeSkillsPreview ? (
        <section id="skills-preview" className="container pt-20" data-home-section>
          <Reveal>
            <SectionHeading
              eyebrow="Skill Matrix"
              title="Data-informed engineering depth"
              description="From UI systems to backend architecture, here is a quick visual snapshot."
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <Card>
                <CardContent className="pt-6">
                  <SkillsRadar items={skills} />
                </CardContent>
              </Card>
              <div className="grid gap-3 sm:grid-cols-2">
                {skills.slice(0, 6).map((skill) => (
                  <Card key={skill.id}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{skill.category}</p>
                      <p className="mt-1 text-lg font-semibold">{skill.name}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.12em] text-primary">Level {skill.level}%</p>
                      <div className="mt-2 h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${skill.level}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      ) : null}

      {controls.showHomeProjectsPreview ? (
        <section id="projects-preview" className="container pt-20" data-home-section>
          <Reveal>
            <div className="mb-6 flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Projects"
                title="Cinematic products with production foundations"
                description="Selected projects designed for impact, performance, and maintainability."
              />
              <Link href="/projects" className="text-sm text-primary hover:underline">
                Explore all
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {controls.showHomeBlogPreview ? (
        <section id="blog-preview" className="container pt-20" data-home-section>
          <Reveal>
            <div className="mb-6 flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Writing"
                title="Engineering notes from real builds"
                description="Readable posts with architecture insights and practical lessons."
              />
              <Link href="/blog" className="text-sm text-primary hover:underline">
                View blog
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {controls.showHomeContactPreview ? (
        <section id="contact-preview" className="container pb-20 pt-20" data-home-section>
          <Reveal>
            <Card className="overflow-hidden">
              <CardContent className="relative p-8 md:p-10">
                <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-primary">Next mission</p>
                    <h2 className="mt-2 text-3xl font-semibold text-balance md:text-4xl">
                      Let us build your next standout digital product.
                    </h2>
                  </div>
                  <Link href="/contact" className={buttonVariants({ size: "lg" })}>
                    <Send className="size-4" /> Start conversation <ArrowRight className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>
      ) : null}
    </>
  );
}
