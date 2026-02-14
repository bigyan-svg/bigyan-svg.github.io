import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

export async function requireAdmin(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return { session: null, unauthorized: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  return { session, unauthorized: null as NextResponse | null };
}
