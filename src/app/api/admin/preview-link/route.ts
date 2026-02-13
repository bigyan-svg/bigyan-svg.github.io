import { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { requireAdminApi } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    if (!slug || !slug.startsWith("/")) {
      return apiError(new Error("Invalid slug"), "", 400);
    }

    const previewUrl = `/api/preview?secret=${encodeURIComponent(env.PREVIEW_SECRET)}&slug=${encodeURIComponent(slug)}`;
    return apiOk({ previewUrl });
  } catch (error) {
    return apiError(error);
  }
}
