import type { MetadataRoute } from "next";
import { defaultPortfolioContent } from "@/lib/data";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bigyan-svggithubio.vercel.app";
const siteUrl = (rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/skills`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/media`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 }
  ];

  const projectRoutes: MetadataRoute.Sitemap = defaultPortfolioContent.projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75
  }));

  const blogRoutes: MetadataRoute.Sitemap = defaultPortfolioContent.blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.75
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
