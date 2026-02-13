import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { requireAdminApi } from "@/lib/auth";
import {
  createContentEntity,
  isSupportedEntity,
  listContentEntity
} from "@/lib/content-service";
import { verifyCsrfRequest } from "@/lib/csrf";

type Params = { params: Promise<{ entity: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { entity } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Math.min(50, Number(url.searchParams.get("pageSize") || "10"));
    const q = url.searchParams.get("q") || undefined;

    const result = await listContentEntity({
      entity,
      page,
      pageSize,
      query: q
    });

    return apiOk(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { entity } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const payload = await request.json();
    const created = await createContentEntity(entity, payload);
    return apiOk(created, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
