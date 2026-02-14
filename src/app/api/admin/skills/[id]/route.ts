import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { skillInputSchema } from "@/lib/validators";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const json = await request.json();
    const parsed = skillInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid skill payload." }, { status: 400 });
    }

    const item = await prisma.skill.update({
      where: { id },
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        level: parsed.data.level,
        icon: parsed.data.icon,
        sortOrder: parsed.data.sortOrder
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Skill not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Unable to update skill." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Skill not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Unable to delete skill." }, { status: 500 });
  }
}
