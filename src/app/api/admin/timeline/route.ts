import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { timelineInputSchema } from "@/lib/validators";

function parseDateOrFallback(value: string, fallback: Date) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed;
}

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const items = await prisma.timelineItem.findMany({ orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ message: "Unable to load timeline items." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const json = await request.json();
    const parsed = timelineInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid timeline payload." }, { status: 400 });
    }

    const startDate = parseDateOrFallback(parsed.data.startDate, new Date());
    const endDate = parsed.data.endDate ? parseDateOrFallback(parsed.data.endDate, startDate) : null;

    const item = await prisma.timelineItem.create({
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

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Unable to create timeline item." }, { status: 500 });
  }
}
