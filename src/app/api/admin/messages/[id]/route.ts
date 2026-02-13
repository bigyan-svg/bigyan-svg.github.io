import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/http";
import { verifyCsrfRequest } from "@/lib/csrf";
import { z } from "zod";

const updateSchema = z.object({
  isRead: z.boolean().optional(),
  replied: z.boolean().optional()
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { id } = await params;
    const body = await request.json();
    const payload = updateSchema.parse(body);

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: payload
    });

    return apiOk(updated);
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

    const { id } = await params;
    const deleted = await prisma.contactMessage.delete({ where: { id } });
    return apiOk(deleted);
  } catch (error) {
    return apiError(error);
  }
}
