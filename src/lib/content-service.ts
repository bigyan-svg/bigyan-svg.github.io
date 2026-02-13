import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContentEntity, contentSchemas } from "@/lib/validators/content";
import { getPagination } from "@/lib/utils";
import { sanitizeRichHtml } from "@/lib/sanitize";

function parseEntityData(entity: ContentEntity, input: unknown) {
  const schema = contentSchemas[entity];
  const parsed = schema.parse(input);

  if (entity === "projects" || entity === "blog-posts" || entity === "ideas") {
    return {
      ...parsed,
      content: sanitizeRichHtml((parsed as { content: string }).content)
    };
  }

  return parsed;
}

export async function listContentEntity(args: {
  entity: ContentEntity;
  page: number;
  pageSize: number;
  query?: string;
}) {
  const { entity, page, pageSize, query } = args;
  const offset = (page - 1) * pageSize;

  switch (entity) {
    case "projects": {
      const where: Prisma.ProjectWhereInput = query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { summary: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.project.count({ where }),
        prisma.project.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "blog-posts": {
      const where: Prisma.BlogPostWhereInput = query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "ideas": {
      const where: Prisma.IdeaWhereInput = query
        ? { OR: [{ title: { contains: query, mode: "insensitive" } }] }
        : {};
      const [total, items] = await Promise.all([
        prisma.idea.count({ where }),
        prisma.idea.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "photos": {
      const where: Prisma.MediaPhotoWhereInput = query
        ? { title: { contains: query, mode: "insensitive" } }
        : {};
      const [total, items] = await Promise.all([
        prisma.mediaPhoto.count({ where }),
        prisma.mediaPhoto.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "videos": {
      const where: Prisma.MediaVideoWhereInput = query
        ? { title: { contains: query, mode: "insensitive" } }
        : {};
      const [total, items] = await Promise.all([
        prisma.mediaVideo.count({ where }),
        prisma.mediaVideo.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "documents": {
      const where: Prisma.DocumentWhereInput = query
        ? { title: { contains: query, mode: "insensitive" } }
        : {};
      const [total, items] = await Promise.all([
        prisma.document.count({ where }),
        prisma.document.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "skills": {
      const where: Prisma.SkillWhereInput = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.skill.count({ where }),
        prisma.skill.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "timeline": {
      const where: Prisma.TimelineItemWhereInput = query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { organization: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.timelineItem.count({ where }),
        prisma.timelineItem.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "resume": {
      const item = await prisma.resume.findFirst();
      return {
        items: item ? [item] : [],
        pagination: getPagination(item ? 1 : 0, 1, 1)
      };
    }
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function createContentEntity(entity: ContentEntity, payload: unknown) {
  const data = parseEntityData(entity, payload) as any;

  switch (entity) {
    case "projects":
      return prisma.project.create({ data });
    case "blog-posts":
      return prisma.blogPost.create({ data });
    case "ideas":
      return prisma.idea.create({ data });
    case "photos":
      return prisma.mediaPhoto.create({ data });
    case "videos":
      return prisma.mediaVideo.create({ data });
    case "documents":
      return prisma.document.create({ data });
    case "skills":
      return prisma.skill.create({ data });
    case "timeline":
      return prisma.timelineItem.create({ data });
    case "resume": {
      const existing = await prisma.resume.findFirst();
      if (existing) {
        return prisma.resume.update({ where: { id: existing.id }, data });
      }
      return prisma.resume.create({ data });
    }
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function getContentEntityById(entity: ContentEntity, id: string) {
  switch (entity) {
    case "projects":
      return prisma.project.findUnique({ where: { id } });
    case "blog-posts":
      return prisma.blogPost.findUnique({ where: { id } });
    case "ideas":
      return prisma.idea.findUnique({ where: { id } });
    case "photos":
      return prisma.mediaPhoto.findUnique({ where: { id } });
    case "videos":
      return prisma.mediaVideo.findUnique({ where: { id } });
    case "documents":
      return prisma.document.findUnique({ where: { id } });
    case "skills":
      return prisma.skill.findUnique({ where: { id } });
    case "timeline":
      return prisma.timelineItem.findUnique({ where: { id } });
    case "resume":
      return prisma.resume.findUnique({ where: { id } });
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function updateContentEntity(
  entity: ContentEntity,
  id: string,
  payload: unknown
) {
  const data = parseEntityData(entity, payload) as any;

  switch (entity) {
    case "projects":
      return prisma.project.update({ where: { id }, data });
    case "blog-posts":
      return prisma.blogPost.update({ where: { id }, data });
    case "ideas":
      return prisma.idea.update({ where: { id }, data });
    case "photos":
      return prisma.mediaPhoto.update({ where: { id }, data });
    case "videos":
      return prisma.mediaVideo.update({ where: { id }, data });
    case "documents":
      return prisma.document.update({ where: { id }, data });
    case "skills":
      return prisma.skill.update({ where: { id }, data });
    case "timeline":
      return prisma.timelineItem.update({ where: { id }, data });
    case "resume":
      return prisma.resume.update({ where: { id }, data });
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function deleteContentEntity(entity: ContentEntity, id: string) {
  switch (entity) {
    case "projects":
      return prisma.project.delete({ where: { id } });
    case "blog-posts":
      return prisma.blogPost.delete({ where: { id } });
    case "ideas":
      return prisma.idea.delete({ where: { id } });
    case "photos":
      return prisma.mediaPhoto.delete({ where: { id } });
    case "videos":
      return prisma.mediaVideo.delete({ where: { id } });
    case "documents":
      return prisma.document.delete({ where: { id } });
    case "skills":
      return prisma.skill.delete({ where: { id } });
    case "timeline":
      return prisma.timelineItem.delete({ where: { id } });
    case "resume":
      return prisma.resume.delete({ where: { id } });
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export function isSupportedEntity(value: string): value is ContentEntity {
  return Object.keys(contentSchemas).includes(value);
}
