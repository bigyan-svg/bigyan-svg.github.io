import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/publish";
import { getPagination } from "@/lib/utils";

type ListArgs = {
  page: number;
  pageSize: number;
};

const fallbackResume = {
  id: "fallback-resume",
  fullName: "Bigyan Sanjyal",
  headline: "BE Computer Engineering Student | Full-Stack Developer",
  summary:
    "I build practical full-stack applications with clean architecture, strong UX, and maintainable code.",
  email: "bigyan@example.com",
  phone: "+977-9800000000",
  location: "Kathmandu, Nepal",
  website: "https://bigyan-svg-github-io.vercel.app",
  github: "https://github.com/bigyan-svg",
  linkedin: "https://linkedin.com/in/bigyan-svg",
  resumePdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  skills: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "TailwindCSS", "Node.js"],
  createdAt: new Date(),
  updatedAt: new Date()
};

const fallbackSkills = [
  { id: "s1", name: "Next.js", category: "Frontend", level: 90, icon: null, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: "s2", name: "TypeScript", category: "Frontend", level: 88, icon: null, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: "s3", name: "Node.js", category: "Backend", level: 86, icon: null, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: "s4", name: "PostgreSQL", category: "Database", level: 82, icon: null, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() }
];

const fallbackTimeline = [
  {
    id: "t1",
    type: "EDUCATION",
    title: "BE Computer Engineering",
    organization: "Tribhuvan University",
    location: "Kathmandu",
    startDate: new Date("2022-01-01"),
    endDate: null,
    isCurrent: true,
    description: "Focused on software systems, algorithms, and applied engineering.",
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "t2",
    type: "EXPERIENCE",
    title: "Full-Stack Developer Intern",
    organization: "Tech Studio Nepal",
    location: "Remote",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-12-31"),
    isCurrent: false,
    description: "Built dashboard features and improved app performance.",
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackProjects = [
  {
    id: "p1",
    title: "Portfolio CMS Platform",
    slug: "portfolio-cms-platform",
    summary: "Custom portfolio + CMS with admin workflows and media management.",
    content: "<p>Production-ready full-stack portfolio CMS built with Next.js and Prisma.</p>",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    repoUrl: "https://github.com/bigyan-svg/bigyan-svg.github.io",
    liveUrl: "https://bigyan-svg-github-io.vercel.app",
    projectType: "Web App",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    featured: true,
    views: 120,
    status: "PUBLISHED",
    publishAt: new Date("2025-01-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "p2",
    title: "Realtime Task Tracker",
    slug: "realtime-task-tracker",
    summary: "Team task board with real-time updates and role-based access.",
    content: "<p>Realtime collaboration app with clean component architecture.</p>",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    repoUrl: "https://github.com/bigyan-svg",
    liveUrl: null,
    projectType: "Productivity",
    techStack: ["Next.js", "Socket.io", "Redis"],
    featured: true,
    views: 80,
    status: "PUBLISHED",
    publishAt: new Date("2025-02-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackBlogPosts = [
  {
    id: "b1",
    title: "Building Scalable Next.js Apps",
    slug: "building-scalable-nextjs-apps",
    excerpt: "Patterns and architecture practices for long-term maintainability.",
    content:
      "<h2>Architecture first</h2><p>Design your modules and boundaries before adding features.</p><pre><code class=\"language-ts\">export const health = () => 'ok';</code></pre>",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    category: "Engineering",
    tags: ["nextjs", "architecture", "typescript"],
    views: 60,
    status: "PUBLISHED",
    publishAt: new Date("2025-02-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackIdeas = [
  {
    id: "i1",
    title: "Tiny Habits for Dev Productivity",
    slug: "tiny-habits-for-dev-productivity",
    content: "<p>Capture one technical decision daily to build long-term engineering clarity.</p>",
    tags: ["productivity", "engineering"],
    views: 45,
    status: "PUBLISHED",
    publishAt: new Date("2025-03-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackPhotos = [
  {
    id: "ph1",
    title: "Hackathon Demo Day",
    slug: "hackathon-demo-day",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    caption: "Presenting project architecture at demo day.",
    tags: ["hackathon", "presentation"],
    views: 25,
    status: "PUBLISHED",
    publishAt: new Date("2025-02-10"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackVideos = [
  {
    id: "v1",
    title: "Portfolio Walkthrough",
    slug: "portfolio-walkthrough",
    source: "YOUTUBE",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    caption: "Short walkthrough of the portfolio project.",
    tags: ["demo", "portfolio"],
    views: 33,
    status: "PUBLISHED",
    publishAt: new Date("2025-02-12"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackDocuments = [
  {
    id: "d1",
    title: "Resume - Bigyan Sanjyal",
    slug: "resume-bigyan-sanjyal",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    docType: "RESUME",
    description: "Latest resume for internships and full-time roles.",
    status: "PUBLISHED",
    publishAt: new Date("2025-02-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function includesCi(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

function paginateArray<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return {
    items: paged,
    pagination: getPagination(items.length, page, pageSize)
  };
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export async function getSiteResume() {
  try {
    return await prisma.resume.findFirst({
      orderBy: { updatedAt: "desc" }
    });
  } catch {
    return fallbackResume as any;
  }
}

export async function getSkills() {
  try {
    return await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }]
    });
  } catch {
    return fallbackSkills as any;
  }
}

export async function getTimeline() {
  try {
    return await prisma.timelineItem.findMany({
      orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }]
    });
  } catch {
    return fallbackTimeline as any;
  }
}

export async function getFeaturedProjects(limit = 3) {
  try {
    return await prisma.project.findMany({
      where: {
        ...publishedFilter(),
        featured: true
      },
      orderBy: { publishAt: "desc" },
      take: limit
    });
  } catch {
    return fallbackProjects.slice(0, limit) as any;
  }
}

export async function getProjectFilterOptions() {
  try {
    const [types, stacks] = await Promise.all([
      prisma.project.findMany({
        where: publishedFilter(),
        distinct: ["projectType"],
        select: { projectType: true },
        orderBy: { projectType: "asc" }
      }),
      prisma.project.findMany({
        where: publishedFilter(),
        select: { techStack: true }
      })
    ]);

    return {
      types: types.map((item) => item.projectType),
      tech: unique(stacks.flatMap((item) => item.techStack).filter(Boolean)).sort((a, b) =>
        a.localeCompare(b)
      )
    };
  } catch {
    return {
      types: unique(fallbackProjects.map((item) => item.projectType)),
      tech: unique(fallbackProjects.flatMap((item) => item.techStack)).sort((a, b) =>
        a.localeCompare(b)
      )
    };
  }
}

export async function listProjects(args: ListArgs & {
  q?: string;
  tech?: string;
  type?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, tech, type, includeDraft } = args;

  try {
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
  } catch {
    let items = [...fallbackProjects];
    if (q) items = items.filter((item) => includesCi(item.title, q) || includesCi(item.summary, q));
    if (type) items = items.filter((item) => item.projectType.toLowerCase() === type.toLowerCase());
    if (tech) items = items.filter((item) => item.techStack.some((t) => t.toLowerCase() === tech.toLowerCase()));
    return paginateArray(items as any[], page, pageSize);
  }
}

export async function getProjectBySlug(slug: string, includeDraft = false) {
  try {
    return await prisma.project.findFirst({
      where: includeDraft ? { slug } : { slug, ...publishedFilter() }
    });
  } catch {
    return (fallbackProjects.find((item) => item.slug === slug) || null) as any;
  }
}

export async function listBlogPosts(args: ListArgs & {
  q?: string;
  category?: string;
  tag?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, category, tag, includeDraft } = args;
  try {
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
  } catch {
    let items = [...fallbackBlogPosts];
    if (q) items = items.filter((item) => includesCi(item.title, q) || includesCi(item.excerpt, q));
    if (category) items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    if (tag) items = items.filter((item) => item.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));

    return {
      ...paginateArray(items as any[], page, pageSize),
      categories: unique(fallbackBlogPosts.map((item) => item.category)),
      tags: unique(fallbackBlogPosts.flatMap((item) => item.tags))
    };
  }
}

export async function getBlogBySlug(slug: string, includeDraft = false) {
  try {
    return await prisma.blogPost.findFirst({
      where: includeDraft ? { slug } : { slug, ...publishedFilter() }
    });
  } catch {
    return (fallbackBlogPosts.find((item) => item.slug === slug) || null) as any;
  }
}

export async function listIdeas(args: ListArgs & {
  q?: string;
  tag?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, tag, includeDraft } = args;
  try {
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
  } catch {
    let items = [...fallbackIdeas];
    if (q) items = items.filter((item) => includesCi(item.title, q) || includesCi(item.content, q));
    if (tag) items = items.filter((item) => item.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));

    return {
      ...paginateArray(items as any[], page, pageSize),
      tags: unique(fallbackIdeas.flatMap((item) => item.tags))
    };
  }
}

export async function getIdeaBySlug(slug: string, includeDraft = false) {
  try {
    return await prisma.idea.findFirst({
      where: includeDraft ? { slug } : { slug, ...publishedFilter() }
    });
  } catch {
    return (fallbackIdeas.find((item) => item.slug === slug) || null) as any;
  }
}

export async function listMedia(args: { includeDraft?: boolean }) {
  try {
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
  } catch {
    return {
      photos: fallbackPhotos as any[],
      videos: fallbackVideos as any[],
      documents: fallbackDocuments as any[]
    };
  }
}

export async function getPhotoBySlug(slug: string, includeDraft = false) {
  try {
    return await prisma.mediaPhoto.findFirst({
      where: includeDraft ? { slug } : { slug, ...publishedFilter() }
    });
  } catch {
    return (fallbackPhotos.find((item) => item.slug === slug) || null) as any;
  }
}

export async function getVideoBySlug(slug: string, includeDraft = false) {
  try {
    return await prisma.mediaVideo.findFirst({
      where: includeDraft ? { slug } : { slug, ...publishedFilter() }
    });
  } catch {
    return (fallbackVideos.find((item) => item.slug === slug) || null) as any;
  }
}

export async function getDocumentBySlug(slug: string, includeDraft = false) {
  try {
    return await prisma.document.findFirst({
      where: includeDraft ? { slug } : { slug, ...publishedFilter() }
    });
  } catch {
    return (fallbackDocuments.find((item) => item.slug === slug) || null) as any;
  }
}
