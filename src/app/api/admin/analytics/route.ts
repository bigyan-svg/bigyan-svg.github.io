import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const [
      projectCount,
      blogCount,
      ideaCount,
      photoCount,
      videoCount,
      documentCount,
      messageCount,
      unreadMessageCount,
      projectViews,
      blogViews,
      ideaViews
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.idea.count(),
      prisma.mediaPhoto.count(),
      prisma.mediaVideo.count(),
      prisma.document.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.project.aggregate({ _sum: { views: true } }),
      prisma.blogPost.aggregate({ _sum: { views: true } }),
      prisma.idea.aggregate({ _sum: { views: true } })
    ]);

    return apiOk({
      totals: {
        projects: projectCount,
        blogs: blogCount,
        ideas: ideaCount,
        photos: photoCount,
        videos: videoCount,
        documents: documentCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount
      },
      views: {
        projects: projectViews._sum.views ?? 0,
        blogs: blogViews._sum.views ?? 0,
        ideas: ideaViews._sum.views ?? 0,
        total:
          (projectViews._sum.views ?? 0) + (blogViews._sum.views ?? 0) + (ideaViews._sum.views ?? 0)
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
