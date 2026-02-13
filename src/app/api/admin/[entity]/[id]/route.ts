import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { requireAdminApi } from "@/lib/auth";
import {
  deleteContentEntity,
  getContentEntityById,
  isSupportedEntity,
  updateContentEntity
} from "@/lib/content-service";
import { verifyCsrfRequest } from "@/lib/csrf";

type Params = { params: Promise<{ entity: string; id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { entity, id } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const item = await getContentEntityById(entity, id);
    if (!item) {
      return apiError(new Error("Not found"), "", 404);
    }
    return apiOk(item);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { entity, id } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const payload = await request.json();
    const item = await updateContentEntity(entity, id, payload);
    return apiOk(item);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { entity, id } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const item = await deleteContentEntity(entity, id);
    return apiOk(item);
  } catch (error) {
    return apiError(error);
  }
}
