"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { buildCommandItems, buildSiteStats, defaultPortfolioContent } from "@/lib/data";
import type { CommandItem, PortfolioContent } from "@/lib/types";

const profileSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  email: z.string().min(1),
  avatar: z.string().min(1),
  heroImage: z.string().min(1),
  aboutImage: z.string().min(1),
  contactImage: z.string().min(1),
  headline: z.string().min(1),
  intro: z.string().min(1),
  github: z.string().min(1),
  linkedin: z.string().min(1),
  resumeUrl: z.string().min(1)
});

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1)
});

const homeSectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1)
});

const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(["Frontend", "Backend", "Cloud", "Data", "Tooling"]),
  level: z.number().min(0).max(100),
  highlight: z.string().optional()
});

const timelineSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  organization: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  type: z.enum(["Education", "Experience"]),
  description: z.string().min(1)
});

const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["Web Platform", "Mobile", "AI", "DevOps"]),
  tech: z.array(z.string()),
  year: z.string().min(1),
  image: z.string().min(1),
  role: z.string().min(1),
  status: z.enum(["Live", "Prototype", "Research"]),
  featured: z.boolean(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  highlights: z.array(z.string())
});

const blogSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImage: z.string().min(1),
  category: z.enum(["Engineering", "Design", "Career", "Architecture"]),
  tags: z.array(z.string()),
  readingTime: z.string().min(1),
  publishedAt: z.string().min(1)
});

const photoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  image: z.string().min(1),
  caption: z.string()
});

const videoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  platform: z.enum(["YouTube", "Vimeo", "Uploaded"]),
  url: z.string().min(1),
  thumbnail: z.string().min(1),
  duration: z.string().min(1)
});

const pdfSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["Resume", "Certificate", "Report", "Other"]),
  description: z.string(),
  url: z.string().min(1)
});

const controlsSchema = z.object({
  showNavbarProfilePhoto: z.boolean(),
  showHeroAvatarChip: z.boolean(),
  showHeroStats: z.boolean(),
  showHomeAboutPreview: z.boolean(),
  showHomeSkillsPreview: z.boolean(),
  showHomeProjectsPreview: z.boolean(),
  showHomeBlogPreview: z.boolean(),
  showHomeContactPreview: z.boolean(),
  enableAnimatedBackground: z.boolean(),
  enablePageTransitions: z.boolean(),
  enableRevealAnimations: z.boolean(),
  enableCardTilt: z.boolean(),
  enableScrollProgress: z.boolean(),
  enableBackToTop: z.boolean()
});

const portfolioContentSchema = z.object({
  profile: profileSchema,
  navItems: z.array(navItemSchema),
  homeSectionItems: z.array(homeSectionSchema),
  skills: z.array(skillSchema),
  timeline: z.array(timelineSchema),
  projects: z.array(projectSchema),
  blogPosts: z.array(blogSchema),
  photos: z.array(photoSchema),
  videos: z.array(videoSchema),
  pdfResources: z.array(pdfSchema),
  controls: controlsSchema
});

type ContentContextValue = {
  content: PortfolioContent;
  hydrated: boolean;
  isAdmin: boolean;
  commandItems: CommandItem[];
  siteStats: {
    projects: number;
    skills: number;
    blogs: number;
  };
  refreshContent: (scope?: "public" | "admin") => Promise<void>;
  setContent: (next: PortfolioContent | ((prev: PortfolioContent) => PortfolioContent)) => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function cloneDefaults(): PortfolioContent {
  return JSON.parse(JSON.stringify(defaultPortfolioContent)) as PortfolioContent;
}

function parseContent(input: unknown): PortfolioContent | null {
  const parsed = portfolioContentSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<PortfolioContent>(() => cloneDefaults());
  const [hydrated, setHydrated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshContent = useCallback(async (scope?: "public" | "admin") => {
    const targetScope = scope === "admin" ? "admin" : "public";
    const response = await fetch(
      targetScope === "admin" ? "/api/portfolio-content?scope=admin" : "/api/portfolio-content",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Unable to refresh content");
    }

    const json = (await response.json()) as { content?: unknown };
    const parsed = parseContent(json.content);
    if (!parsed) {
      throw new Error("Invalid content response");
    }

    setContentState(parsed);
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const sessionResponse = await fetch("/api/admin/session", { cache: "no-store" });
        const sessionJson = (await sessionResponse.json().catch(() => ({ authenticated: false }))) as {
          authenticated?: boolean;
        };
        const authenticated = Boolean(sessionJson.authenticated);

        if (!active) return;
        setIsAdmin(authenticated);

        await refreshContent(authenticated ? "admin" : "public");
      } catch {
        if (!active) return;
        setContentState(cloneDefaults());
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [refreshContent]);

  const setContent = useCallback(
    (next: PortfolioContent | ((prev: PortfolioContent) => PortfolioContent)) => {
      if (!isAdmin) return;
      setContentState((prev) =>
        typeof next === "function" ? (next as (value: PortfolioContent) => PortfolioContent)(prev) : next
      );
    },
    [isAdmin]
  );

  const commandItems = useMemo(
    () => buildCommandItems(content.navItems, content.homeSectionItems),
    [content.homeSectionItems, content.navItems]
  );

  const siteStats = useMemo(
    () => buildSiteStats(content.projects, content.skills, content.blogPosts),
    [content.blogPosts, content.projects, content.skills]
  );

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      hydrated,
      isAdmin,
      commandItems,
      siteStats,
      refreshContent,
      setContent
    }),
    [content, hydrated, isAdmin, commandItems, siteStats, refreshContent, setContent]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function usePortfolioContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("usePortfolioContent must be used inside ContentProvider.");
  }
  return context;
}
