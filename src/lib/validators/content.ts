import { DocumentType, PublishStatus, TimelineType, VideoSource } from "@prisma/client";
import { z } from "zod";

const csvArray = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}, z.array(z.string()));

const urlOrPath = z
  .string()
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Must be a valid URL or local path"
  });

const optionalUrlOrPath = z
  .union([urlOrPath, z.literal(""), z.undefined(), z.null()])
  .transform((value) => (value ? value : null));

const statusSchema = z.nativeEnum(PublishStatus).default(PublishStatus.DRAFT);

const optionalDate = z
  .union([z.string(), z.date(), z.null(), z.undefined()])
  .transform((value) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  });

export const projectSchema = z.object({
  title: z.string().min(3).max(140),
  slug: z.string().min(3).max(160),
  summary: z.string().min(10).max(300),
  content: z.string().min(10),
  coverImage: optionalUrlOrPath,
  repoUrl: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  liveUrl: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  projectType: z.string().min(2).max(60),
  techStack: csvArray,
  featured: z.coerce.boolean().default(false),
  status: statusSchema,
  publishAt: optionalDate
});

export const blogSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(180),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(20),
  coverImage: optionalUrlOrPath,
  category: z.string().min(2).max(60),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const ideaSchema = z.object({
  title: z.string().min(3).max(140),
  slug: z.string().min(3).max(180),
  content: z.string().min(10),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const photoSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160),
  imageUrl: urlOrPath,
  caption: z.string().max(500).optional().or(z.literal("")).transform((v) => v || null),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const videoSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160),
  source: z.nativeEnum(VideoSource),
  videoUrl: urlOrPath,
  thumbnailUrl: optionalUrlOrPath,
  caption: z.string().max(500).optional().or(z.literal("")).transform((v) => v || null),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const documentSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160),
  fileUrl: urlOrPath,
  docType: z.nativeEnum(DocumentType),
  description: z.string().max(500).optional().or(z.literal("")).transform((v) => v || null),
  status: statusSchema,
  publishAt: optionalDate
});

export const skillSchema = z.object({
  name: z.string().min(2).max(60),
  category: z.string().min(2).max(60),
  level: z.coerce.number().int().min(1).max(100),
  icon: z.string().max(80).optional().or(z.literal("")).transform((v) => v || null),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const timelineSchema = z.object({
  type: z.nativeEnum(TimelineType),
  title: z.string().min(2).max(120),
  organization: z.string().min(2).max(120),
  location: z.string().max(120).optional().or(z.literal("")).transform((v) => v || null),
  startDate: z.coerce.date(),
  endDate: optionalDate,
  isCurrent: z.coerce.boolean().default(false),
  description: z.string().min(10),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const resumeSchema = z.object({
  fullName: z.string().min(2).max(100),
  headline: z.string().min(5).max(180),
  summary: z.string().min(20),
  email: z.string().email(),
  phone: z.string().max(50).optional().or(z.literal("")).transform((v) => v || null),
  location: z.string().max(120).optional().or(z.literal("")).transform((v) => v || null),
  website: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  github: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  linkedin: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  resumePdfUrl: optionalUrlOrPath,
  skills: csvArray
});

export const contentSchemas = {
  projects: projectSchema,
  "blog-posts": blogSchema,
  ideas: ideaSchema,
  photos: photoSchema,
  videos: videoSchema,
  documents: documentSchema,
  skills: skillSchema,
  timeline: timelineSchema,
  resume: resumeSchema
};

export type ContentEntity = keyof typeof contentSchemas;
