import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiError, apiOk } from "@/lib/http";
import { REFRESH_COOKIE_NAME, setAuthCookies, rotateRefreshToken } from "@/lib/auth";
import { verifyCsrfRequest } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit({
      key: `auth-refresh:${ip}`,
      limit: 30,
      windowMs: 15 * 60 * 1000
    });
    if (!rate.success) {
      return apiError(new Error("Too many requests."), "", 429);
    }

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token."), "", 403);
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    if (!refreshToken) {
      return apiError(new Error("Missing refresh token."), "", 401);
    }

    const nextTokens = await rotateRefreshToken(refreshToken);
    await setAuthCookies({
      accessToken: nextTokens.accessToken,
      refreshToken: nextTokens.refreshToken
    });

    return apiOk({
      user: {
        id: nextTokens.user.id,
        name: nextTokens.user.name,
        email: nextTokens.user.email,
        role: nextTokens.user.role
      }
    });
  } catch (error) {
    return apiError(error, "", 401);
  }
}
