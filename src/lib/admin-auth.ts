import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE = "admin_session";

type AdminTokenPayload = {
  sub: string;
  email: string;
  role: "admin";
};

function getSecret() {
  const raw = process.env.ADMIN_JWT_SECRET || process.env.JWT_ACCESS_SECRET || "dev-admin-secret-change-me";
  return encoder.encode(raw);
}

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_LOGIN_EMAIL || "bigyansanjyal56@gmail.com").trim().toLowerCase(),
    password: process.env.ADMIN_LOGIN_PASSWORD || "#Bigyan123"
  };
}

export async function createAdminSessionToken(email: string) {
  return new SignJWT({ email, role: "admin" } as Omit<AdminTokenPayload, "sub">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminSessionToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || payload.role !== "admin") {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: "admin"
    };
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}
