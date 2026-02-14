import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { getDefaultSiteConfigPayload } from "@/lib/portfolio-content";
import { siteConfigUpdateSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const defaults = getDefaultSiteConfigPayload();
    const config = await prisma.siteConfig.upsert({
      where: { key: "default" },
      update: {},
      create: {
        key: "default",
        profile: defaults.profile,
        controls: defaults.controls,
        navItems: defaults.navItems,
        homeSectionItems: defaults.homeSectionItems
      }
    });

    return NextResponse.json({
      profile: config.profile,
      controls: config.controls,
      navItems: config.navItems,
      homeSectionItems: config.homeSectionItems
    });
  } catch {
    return NextResponse.json({ message: "Unable to load site config." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const json = await request.json();
    const parsed = siteConfigUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || "Invalid site config payload." }, { status: 400 });
    }

    const config = await prisma.siteConfig.upsert({
      where: { key: "default" },
      update: {
        profile: parsed.data.profile,
        controls: parsed.data.controls,
        navItems: parsed.data.navItems,
        homeSectionItems: parsed.data.homeSectionItems
      },
      create: {
        key: "default",
        profile: parsed.data.profile,
        controls: parsed.data.controls,
        navItems: parsed.data.navItems,
        homeSectionItems: parsed.data.homeSectionItems
      }
    });

    return NextResponse.json({ ok: true, updatedAt: config.updatedAt.toISOString() });
  } catch {
    return NextResponse.json({ message: "Unable to save site config." }, { status: 500 });
  }
}
