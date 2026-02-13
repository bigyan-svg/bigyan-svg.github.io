import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const [
    projectCount,
    blogCount,
    ideaCount,
    messageCount,
    unreadCount,
    views
  ] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.idea.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    Promise.all([
      prisma.project.aggregate({ _sum: { views: true } }),
      prisma.blogPost.aggregate({ _sum: { views: true } }),
      prisma.idea.aggregate({ _sum: { views: true } })
    ])
  ]);

  const totalViews =
    (views[0]._sum.views ?? 0) + (views[1]._sum.views ?? 0) + (views[2]._sum.views ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Content snapshot and quick actions for the portfolio CMS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{projectCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{blogCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ideas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{ideaCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Views</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{totalViews}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Total: {messageCount}</p>
            <p>Unread: {unreadCount}</p>
            <Link href="/admin/messages" className="text-primary hover:underline">
              Open inbox
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Use `status` and `publishAt` in each editor to control Draft / Published / Scheduled state.</p>
            <p>For preview mode, use `/api/preview?secret=PREVIEW_SECRET&slug=/target-path`.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
