import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { timelineInputSchema } from "@/lib/validators";

function parseDateOrFallback(value: string, fallback: Date) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed;
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const json = await request.json();
    const parsed = timelineInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid timeline payload." }, { status: 400 });
    }

    const startDate = parseDateOrFallback(parsed.data.startDate, new Date());
    const endDate = parsed.data.endDate ? parseDateOrFallback(parsed.data.endDate, startDate) : null;

    const item = await prisma.timelineItem.update({
      where: { id },
      data: {
        type: parsed.data.type,
        title: parsed.data.title,
        organization: parsed.data.organization,
        location: parsed.data.location,
        startDate,
        endDate,
        isCurrent: parsed.data.isCurrent,
        description: parsed.data.description,
        sortOrder: parsed.data.sortOrder
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Timeline item not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Unable to update timeline item." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    await prisma.timelineItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Timeline item not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Unable to delete timeline item." }, { status: 500 });
  }
}
