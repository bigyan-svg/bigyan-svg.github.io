import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug") || "/";

  if (secret !== env.PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid preview secret" }, { status: 401 });
  }

  if (!slug.startsWith("/")) {
    return NextResponse.json({ error: "Invalid preview target" }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(slug, request.url));
}
