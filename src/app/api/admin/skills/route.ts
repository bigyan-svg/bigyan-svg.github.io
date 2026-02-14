import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { skillInputSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const items = await prisma.skill.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ message: "Unable to load skills." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const json = await request.json();
    const parsed = skillInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid skill payload." }, { status: 400 });
    }

    const item = await prisma.skill.create({
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        level: parsed.data.level,
        icon: parsed.data.icon,
        sortOrder: parsed.data.sortOrder
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Unable to create skill." }, { status: 500 });
  }
}
