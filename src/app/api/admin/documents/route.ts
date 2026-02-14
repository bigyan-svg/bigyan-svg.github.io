import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { documentInputSchema, parseDateString } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const items = await prisma.document.findMany({ orderBy: [{ updatedAt: "desc" }] });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ message: "Unable to load documents." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const json = await request.json();
    const parsed = documentInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid document payload." }, { status: 400 });
    }

    const item = await prisma.document.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        fileUrl: parsed.data.fileUrl ?? "",
        docType: parsed.data.docType,
        description: parsed.data.description,
        status: parsed.data.status,
        publishAt: parseDateString(parsed.data.publishAt)
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Unable to create document." }, { status: 500 });
  }
}
