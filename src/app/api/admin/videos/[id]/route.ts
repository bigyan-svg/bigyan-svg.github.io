import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { mediaVideoInputSchema, parseDateString } from "@/lib/validators";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const json = await request.json();
    const parsed = mediaVideoInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid video payload." }, { status: 400 });
    }

    const item = await prisma.mediaVideo.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        source: parsed.data.source,
        videoUrl: parsed.data.videoUrl ?? "",
        thumbnailUrl: parsed.data.thumbnailUrl,
        caption: parsed.data.caption,
        tags: parsed.data.tags,
        status: parsed.data.status,
        publishAt: parseDateString(parsed.data.publishAt)
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Video not found." }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Unable to update video." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    await prisma.mediaVideo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Video not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Unable to delete video." }, { status: 500 });
  }
}
