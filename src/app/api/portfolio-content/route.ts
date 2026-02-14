import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import { getPortfolioContent } from "@/lib/portfolio-content";

export async function GET(request: NextRequest) {
  try {
    const scope = request.nextUrl.searchParams.get("scope");
    const needsAdminScope = scope === "admin";

    if (needsAdminScope) {
      const session = await getAdminSessionFromRequest(request);
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    const content = await getPortfolioContent({ includeDrafts: needsAdminScope });
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ message: "Unable to load portfolio content." }, { status: 500 });
  }
}
