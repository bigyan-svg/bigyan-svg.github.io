import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/publish";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const [projects, posts, ideas, photos, videos, docs] = await Promise.all([
    prisma.project.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.idea.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.mediaPhoto.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.mediaVideo.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.document.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } })
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/skills",
    "/projects",
    "/experience",
    "/blog",
    "/ideas",
    "/media",
    "/resources",
    "/resume",
    "/contact"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const dynamicPages: MetadataRoute.Sitemap = [
    ...projects.map((item) => ({
      url: `${baseUrl}/projects/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...posts.map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...ideas.map((item) => ({
      url: `${baseUrl}/ideas/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...photos.map((item) => ({
      url: `${baseUrl}/media/photos/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...videos.map((item) => ({
      url: `${baseUrl}/media/videos/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...docs.map((item) => ({
      url: `${baseUrl}/media/documents/${item.slug}`,
      lastModified: item.updatedAt
    }))
  ];

  return [...staticPages, ...dynamicPages];
}
