import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/publish";
import { getPagination } from "@/lib/utils";

type ListArgs = {
  page: number;
  pageSize: number;
};

export async function getSiteResume() {
  return prisma.resume.findFirst({
    orderBy: { updatedAt: "desc" }
  });
}

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }]
  });
}

export async function getTimeline() {
  return prisma.timelineItem.findMany({
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }]
  });
}

export async function getFeaturedProjects(limit = 3) {
  return prisma.project.findMany({
    where: {
      ...publishedFilter(),
      featured: true
    },
    orderBy: { publishAt: "desc" },
    take: limit
  });
}

export async function listProjects(args: ListArgs & {
  q?: string;
  tech?: string;
  type?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, tech, type, includeDraft } = args;
  const conditions: Prisma.ProjectWhereInput[] = [];
  if (!includeDraft) {
    conditions.push(publishedFilter());
  }
  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } }
      ]
    });
  }
  if (type) {
    conditions.push({ projectType: { equals: type, mode: "insensitive" } });
  }
  if (tech) {
    conditions.push({ techStack: { has: tech } });
  }

  const where: Prisma.ProjectWhereInput = conditions.length ? { AND: conditions } : {};

  const [total, items] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  return {
    items,
    pagination: getPagination(total, page, pageSize)
  };
}

export async function getProjectBySlug(slug: string, includeDraft = false) {
  return prisma.project.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function listBlogPosts(args: ListArgs & {
  q?: string;
  category?: string;
  tag?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, category, tag, includeDraft } = args;
  const conditions: Prisma.BlogPostWhereInput[] = [];
  if (!includeDraft) {
    conditions.push(publishedFilter());
  }
  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } }
      ]
    });
  }
  if (category) {
    conditions.push({ category: { equals: category, mode: "insensitive" } });
  }
  if (tag) {
    conditions.push({ tags: { has: tag } });
  }

  const where: Prisma.BlogPostWhereInput = conditions.length ? { AND: conditions } : {};

  const [total, items] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  const [categories, tags] = await Promise.all([
    prisma.blogPost.findMany({
      where: includeDraft ? {} : publishedFilter(),
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" }
    }),
    prisma.blogPost.findMany({
      where: includeDraft ? {} : publishedFilter(),
      select: { tags: true }
    })
  ]);

  const uniqueTags = Array.from(
    new Set(
      tags
        .flatMap((item) => item.tags)
        .map((t) => t.trim())
        .filter(Boolean)
    )
  ).sort();

  return {
    items,
    categories: categories.map((c) => c.category),
    tags: uniqueTags,
    pagination: getPagination(total, page, pageSize)
  };
}

export async function getBlogBySlug(slug: string, includeDraft = false) {
  return prisma.blogPost.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function listIdeas(args: ListArgs & {
  q?: string;
  tag?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, tag, includeDraft } = args;
  const conditions: Prisma.IdeaWhereInput[] = [];
  if (!includeDraft) {
    conditions.push(publishedFilter());
  }
  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } }
      ]
    });
  }
  if (tag) {
    conditions.push({ tags: { has: tag } });
  }

  const where: Prisma.IdeaWhereInput = conditions.length ? { AND: conditions } : {};

  const [total, items, tags] = await Promise.all([
    prisma.idea.count({ where }),
    prisma.idea.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.idea.findMany({
      where: includeDraft ? {} : publishedFilter(),
      select: { tags: true }
    })
  ]);

  const uniqueTags = Array.from(
    new Set(
      tags
        .flatMap((item) => item.tags)
        .map((t) => t.trim())
        .filter(Boolean)
    )
  ).sort();

  return {
    items,
    tags: uniqueTags,
    pagination: getPagination(total, page, pageSize)
  };
}

export async function getIdeaBySlug(slug: string, includeDraft = false) {
  return prisma.idea.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function listMedia(args: { includeDraft?: boolean }) {
  const where = args.includeDraft ? {} : publishedFilter();
  const [photos, videos, documents] = await Promise.all([
    prisma.mediaPhoto.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }]
    }),
    prisma.mediaVideo.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }]
    }),
    prisma.document.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }]
    })
  ]);

  return { photos, videos, documents };
}

export async function getPhotoBySlug(slug: string, includeDraft = false) {
  return prisma.mediaPhoto.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function getVideoBySlug(slug: string, includeDraft = false) {
  return prisma.mediaVideo.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function getDocumentBySlug(slug: string, includeDraft = false) {
  return prisma.document.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}
