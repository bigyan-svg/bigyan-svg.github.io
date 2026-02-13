import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiError, apiOk } from "@/lib/http";
import {
  clearAuthCookies,
  REFRESH_COOKIE_NAME,
  revokeRefreshToken
} from "@/lib/auth";
import { verifyCsrfRequest } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token."), "", 403);
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    await clearAuthCookies();

    return apiOk({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
