import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/http";
import { loginSchema } from "@/lib/validators/auth";
import { createAccessToken, issueRefreshToken, setAuthCookies } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrfRequest } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit({
      key: `auth-login:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000
    });
    if (!rate.success) {
      return apiError(new Error("Too many login attempts, try again later."), "", 429);
    }

    const body = await request.json();
    const input = loginSchema.parse(body);

    const csrfValid = await verifyCsrfRequest(
      request.headers.get("x-csrf-token") || input.csrfToken
    );
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token."), "", 403);
    }

    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user) {
      return apiError(new Error("Invalid email or password."), "", 401);
    }

    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) {
      return apiError(new Error("Invalid email or password."), "", 401);
    }

    const accessToken = await createAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });
    const refreshToken = await issueRefreshToken(user.id);

    await setAuthCookies({
      accessToken,
      refreshToken
    });

    return apiOk({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
