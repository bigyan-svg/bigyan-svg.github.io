import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]);
export const timelineTypeSchema = z.enum(["EXPERIENCE", "EDUCATION"]);
export const videoSourceSchema = z.enum(["YOUTUBE", "VIMEO", "UPLOADED"]);
export const documentTypeSchema = z.enum(["RESUME", "CERTIFICATE", "REPORT", "OTHER"]);

const nullableUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value && value.length ? value : null))
  .refine((value) => value === null || /^https?:\/\//i.test(value) || value.startsWith("/"), {
    message: "Must be a valid URL or absolute path."
  });

const nullableDate = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value && value.length ? value : null));

const slugField = z
  .string()
  .trim()
  .min(1)
  .max(140)
  .regex(slugRegex, "Slug must use lowercase letters, numbers, and hyphens only.");

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  username: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(180),
  location: z.string().trim().min(1).max(180),
  email: z.string().trim().email(),
  avatar: z.string().trim().min(1),
  heroImage: z.string().trim().min(1),
  aboutImage: z.string().trim().min(1),
  contactImage: z.string().trim().min(1),
  headline: z.string().trim().min(1).max(280),
  intro: z.string().trim().min(1).max(1200),
  github: z.string().trim().url(),
  linkedin: z.string().trim().url(),
  resumeUrl: z.string().trim().min(1)
});

export const controlsSchema = z.object({
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

export const navItemSchema = z.object({
  label: z.string().trim().min(1).max(60),
  href: z.string().trim().min(1).max(120)
});

export const homeSectionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(80)
});

export const siteConfigUpdateSchema = z.object({
  profile: profileSchema,
  controls: controlsSchema,
  navItems: z.array(navItemSchema).min(1),
  homeSectionItems: z.array(homeSectionSchema).min(1)
});

export const projectInputSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: slugField,
  summary: z.string().trim().min(1).max(600),
  content: z.string().trim().min(1),
  coverImage: nullableUrl,
  repoUrl: nullableUrl,
  liveUrl: nullableUrl,
  projectType: z.string().trim().min(1).max(80),
  techStack: z.array(z.string().trim().min(1).max(40)).max(30),
  featured: z.boolean(),
  status: publishStatusSchema,
  publishAt: nullableDate
});

export const blogPostInputSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: slugField,
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1),
  coverImage: nullableUrl,
  category: z.string().trim().min(1).max(80),
  tags: z.array(z.string().trim().min(1).max(32)).max(20),
  status: publishStatusSchema,
  publishAt: nullableDate
});

export const skillInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(60),
  level: z.number().int().min(0).max(100),
  icon: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value && value.length ? value : null)),
  sortOrder: z.number().int().min(0).max(1000)
});

export const timelineInputSchema = z.object({
  type: timelineTypeSchema,
  title: z.string().trim().min(1).max(180),
  organization: z.string().trim().min(1).max(180),
  location: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value && value.length ? value : null)),
  startDate: z.string().trim().min(1),
  endDate: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value && value.length ? value : null)),
  isCurrent: z.boolean(),
  description: z.string().trim().min(1).max(1200),
  sortOrder: z.number().int().min(0).max(1000)
});

export const mediaPhotoInputSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: slugField,
  imageUrl: nullableUrl,
  caption: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value && value.length ? value : null)),
  tags: z.array(z.string().trim().min(1).max(32)).max(20),
  status: publishStatusSchema,
  publishAt: nullableDate
});

export const mediaVideoInputSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: slugField,
  source: videoSourceSchema,
  videoUrl: nullableUrl,
  thumbnailUrl: nullableUrl,
  caption: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value && value.length ? value : null)),
  tags: z.array(z.string().trim().min(1).max(32)).max(20),
  status: publishStatusSchema,
  publishAt: nullableDate
});

export const documentInputSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: slugField,
  fileUrl: nullableUrl,
  docType: documentTypeSchema,
  description: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => (value && value.length ? value : null)),
  status: publishStatusSchema,
  publishAt: nullableDate
});

export function parseDateString(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
