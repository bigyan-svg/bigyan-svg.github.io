import { PublishStatus, TimelineType, VideoSource } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { defaultPortfolioContent } from "@/lib/data";
import type {
  BlogPost,
  FrontendControls,
  HomeSectionItem,
  NavItem,
  PortfolioContent,
  Profile,
  SkillCategory
} from "@/lib/types";

const allowedProjectTypes = ["Web Platform", "Mobile", "AI", "DevOps"] as const;
const allowedSkillCategories = ["Frontend", "Backend", "Cloud", "Data", "Tooling"] as const;
const allowedBlogCategories = ["Engineering", "Design", "Career", "Architecture"] as const;

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1)
});

const homeSectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1)
});

const profileSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().min(1),
  heroImage: z.string().min(1),
  aboutImage: z.string().min(1),
  contactImage: z.string().min(1),
  headline: z.string().min(1),
  intro: z.string().min(1),
  github: z.string().url(),
  linkedin: z.string().url(),
  resumeUrl: z.string().min(1)
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

const defaultNavItems: NavItem[] = defaultPortfolioContent.navItems.filter((item) => item.href !== "/admin");
const defaultHomeSections: HomeSectionItem[] = defaultPortfolioContent.homeSectionItems;
const defaultProfile: Profile = defaultPortfolioContent.profile;
const defaultControls: FrontendControls = defaultPortfolioContent.controls;

function toPlainText(input: string) {
  return input
    .replace(/<code[^>]*>/gi, "\n")
    .replace(/<\/code>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateReadingTime(input: string) {
  const plain = toPlainText(input);
  const words = plain.length ? plain.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function safeProjectType(input: string): PortfolioContent["projects"][number]["type"] {
  return (allowedProjectTypes as readonly string[]).includes(input)
    ? (input as PortfolioContent["projects"][number]["type"])
    : "Web Platform";
}

function safeSkillCategory(input: string): SkillCategory {
  return (allowedSkillCategories as readonly string[]).includes(input) ? (input as SkillCategory) : "Tooling";
}

function safeBlogCategory(input: string): BlogPost["category"] {
  return (allowedBlogCategories as readonly string[]).includes(input) ? (input as BlogPost["category"]) : "Engineering";
}

function extractHighlights(content: string, summary: string) {
  const lines = content
    .replace(/<li>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((line) => line.replace(/[\-*]/g, "").trim())
    .filter((line) => line.length > 14);

  if (lines.length >= 3) {
    return lines.slice(0, 3);
  }

  return [summary, "Production-grade architecture", "Performance and accessibility focus"];
}

function resolvePublicWhere(includeDrafts: boolean) {
  if (includeDrafts) return undefined;

  return {
    OR: [
      { status: PublishStatus.PUBLISHED },
      { status: PublishStatus.SCHEDULED, publishAt: { lte: new Date() } }
    ]
  };
}

function parseProfile(value: unknown) {
  const parsed = profileSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultProfile;
}

function parseControls(value: unknown) {
  const parsed = controlsSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultControls;
}

function parseNavItems(value: unknown) {
  const parsed = z.array(navItemSchema).safeParse(value);
  if (!parsed.success) return defaultNavItems;
  return parsed.data.filter((item) => !item.href.startsWith("/admin"));
}

function parseHomeSections(value: unknown) {
  const parsed = z.array(homeSectionSchema).safeParse(value);
  return parsed.success ? parsed.data : defaultHomeSections;
}

export function getDefaultSiteConfigPayload() {
  return {
    profile: defaultProfile,
    controls: defaultControls,
    navItems: defaultNavItems,
    homeSectionItems: defaultHomeSections
  };
}

export async function getOrCreateSiteConfig() {
  const existing = await prisma.siteConfig.findUnique({ where: { key: "default" } });
  if (existing) return existing;

  const defaults = getDefaultSiteConfigPayload();
  return prisma.siteConfig.create({
    data: {
      key: "default",
      profile: defaults.profile,
      controls: defaults.controls,
      navItems: defaults.navItems,
      homeSectionItems: defaults.homeSectionItems
    }
  });
}

export async function getPortfolioContent(options?: { includeDrafts?: boolean }): Promise<PortfolioContent> {
  const includeDrafts = Boolean(options?.includeDrafts);
  const where = resolvePublicWhere(includeDrafts);

  const [siteConfig, skills, timeline, projects, blogPosts, photos, videos, documents] = await Promise.all([
    getOrCreateSiteConfig(),
    prisma.skill.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.timelineItem.findMany({ orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] }),
    prisma.project.findMany({ where, orderBy: [{ featured: "desc" }, { publishAt: "desc" }, { createdAt: "desc" }] }),
    prisma.blogPost.findMany({ where, orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }] }),
    prisma.mediaPhoto.findMany({ where, orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }] }),
    prisma.mediaVideo.findMany({ where, orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }] }),
    prisma.document.findMany({ where, orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }] })
  ]);

  const profile = parseProfile(siteConfig.profile);
  const controls = parseControls(siteConfig.controls);
  const navItems = parseNavItems(siteConfig.navItems);
  const homeSectionItems = parseHomeSections(siteConfig.homeSectionItems);

  return {
    profile,
    controls,
    navItems,
    homeSectionItems,
    skills: skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: safeSkillCategory(skill.category),
      level: skill.level,
      highlight: skill.icon || undefined
    })),
    timeline: timeline.map((item) => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      start: String(item.startDate.getFullYear()),
      end: item.isCurrent ? "Present" : item.endDate ? String(item.endDate.getFullYear()) : "Present",
      type: item.type === TimelineType.EDUCATION ? "Education" : "Experience",
      description: item.description
    })),
    projects: projects.map((project) => {
      const contentText = toPlainText(project.content);
      const publicationDate = project.publishAt ?? project.createdAt;

      return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        description: contentText || project.summary,
        type: safeProjectType(project.projectType),
        tech: project.techStack,
        year: String(publicationDate.getFullYear()),
        image: project.coverImage || defaultPortfolioContent.projects[0]?.image || defaultProfile.heroImage,
        role: "Full-Stack Engineer",
        status:
          project.status === PublishStatus.PUBLISHED
            ? "Live"
            : project.status === PublishStatus.SCHEDULED
              ? "Prototype"
              : "Research",
        featured: project.featured,
        liveUrl: project.liveUrl || undefined,
        githubUrl: project.repoUrl || undefined,
        highlights: extractHighlights(project.content, project.summary)
      };
    }),
    blogPosts: blogPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || defaultPortfolioContent.blogPosts[0]?.coverImage || defaultProfile.heroImage,
      category: safeBlogCategory(post.category),
      tags: post.tags,
      readingTime: calculateReadingTime(post.content),
      publishedAt: (post.publishAt ?? post.createdAt).toISOString()
    })),
    photos: photos.map((photo) => ({
      id: photo.id,
      title: photo.title,
      image: photo.imageUrl,
      caption: photo.caption || ""
    })),
    videos: videos.map((video) => ({
      id: video.id,
      title: video.title,
      platform: video.source === VideoSource.VIMEO ? "Vimeo" : video.source === VideoSource.UPLOADED ? "Uploaded" : "YouTube",
      url: video.videoUrl,
      thumbnail:
        video.thumbnailUrl || defaultPortfolioContent.videos.find((item) => item.id === "vd-1")?.thumbnail || defaultProfile.heroImage,
      duration: "Watch"
    })),
    pdfResources: documents.map((document) => ({
      id: document.id,
      title: document.title,
      type:
        document.docType === "RESUME"
          ? "Resume"
          : document.docType === "CERTIFICATE"
            ? "Certificate"
            : document.docType === "REPORT"
              ? "Report"
              : "Other",
      description: document.description || "",
      url: document.fileUrl
    }))
  };
}
