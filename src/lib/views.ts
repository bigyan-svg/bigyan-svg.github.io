import { prisma } from "@/lib/prisma";

type ViewEntity = "project" | "blog" | "idea" | "photo" | "video";

export async function incrementViewCount(entity: ViewEntity, slug: string) {
  switch (entity) {
    case "project":
      await prisma.project.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "blog":
      await prisma.blogPost.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "idea":
      await prisma.idea.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "photo":
      await prisma.mediaPhoto.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "video":
      await prisma.mediaVideo.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    default:
      break;
  }
}
