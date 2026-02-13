import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { requireAdminApi } from "@/lib/auth";
import { verifyCsrfRequest } from "@/lib/csrf";
import { uploadFile, validateUpload } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const formData = await request.formData();
    const rawFile = formData.get("file");
    const rawType = formData.get("type");
    const folder = String(formData.get("folder") || "general");

    if (!(rawFile instanceof File)) {
      return apiError(new Error("No file uploaded"), "", 400);
    }

    if (rawType !== "image" && rawType !== "pdf" && rawType !== "video") {
      return apiError(new Error("Invalid upload type"), "", 400);
    }

    const validation = validateUpload(rawFile, rawType);
    if (!validation.ok) {
      return apiError(new Error(validation.error), "", 400);
    }

    const result = await uploadFile({
      file: rawFile,
      folder,
      type: rawType
    });

    return apiOk(result);
  } catch (error) {
    return apiError(error);
  }
}
