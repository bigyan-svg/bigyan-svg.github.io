import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { parseDateString, projectInputSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const items = await prisma.project.findMany({ orderBy: [{ updatedAt: "desc" }] });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ message: "Unable to load projects." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const json = await request.json();
    const parsed = projectInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid project payload." }, { status: 400 });
    }

    const item = await prisma.project.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        summary: parsed.data.summary,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        repoUrl: parsed.data.repoUrl,
        liveUrl: parsed.data.liveUrl,
        projectType: parsed.data.projectType,
        techStack: parsed.data.techStack,
        featured: parsed.data.featured,
        status: parsed.data.status,
        publishAt: parseDateString(parsed.data.publishAt)
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Unable to create project." }, { status: 500 });
  }
}
