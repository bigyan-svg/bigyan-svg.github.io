import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const ACCESS_COOKIE_NAME = "access_token";
export const REFRESH_COOKIE_NAME = "refresh_token";
export const CSRF_COOKIE_NAME = "csrf_token";

type AccessTokenPayload = JWTPayload & {
  role: "ADMIN" | "EDITOR";
  email: string;
};

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

export async function createAccessToken(payload: {
  userId: string;
  role: "ADMIN" | "EDITOR";
  email: string;
}) {
  return new SignJWT({ role: payload.role, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${env.ACCESS_TOKEN_EXPIRES_MINUTES}m`)
    .sign(accessSecret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessSecret);
  const parsedPayload = payload as AccessTokenPayload;
  if (!parsedPayload.sub || !parsedPayload.role || !parsedPayload.email) {
    throw new Error("Invalid token payload");
  }
  return {
    userId: parsedPayload.sub,
    role: parsedPayload.role,
    email: parsedPayload.email
  };
}

function buildRefreshTokenValue(tokenId: string, secret: string) {
  return `${tokenId}.${secret}`;
}

function parseRefreshTokenValue(raw: string) {
  const [id, secret] = raw.split(".");
  if (!id || !secret) {
    throw new Error("Invalid refresh token format");
  }
  return { id, secret };
}

export async function issueRefreshToken(userId: string) {
  const tokenId = crypto.randomUUID();
  const secret = crypto.randomBytes(48).toString("hex");
  const tokenHash = await bcrypt.hash(secret, 12);
  const expiresAt = new Date(
    Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      tokenHash,
      userId,
      expiresAt
    }
  });

  return {
    value: buildRefreshTokenValue(tokenId, secret),
    expiresAt
  };
}

export async function rotateRefreshToken(rawToken: string) {
  const { id, secret } = parseRefreshTokenValue(rawToken);
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
    throw new Error("Refresh token is invalid or expired");
  }

  const isMatch = await bcrypt.compare(secret, tokenRecord.tokenHash);
  if (!isMatch) {
    throw new Error("Refresh token mismatch");
  }

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { revokedAt: new Date() }
  });

  const nextRefreshToken = await issueRefreshToken(tokenRecord.userId);

  const accessToken = await createAccessToken({
    userId: tokenRecord.user.id,
    role: tokenRecord.user.role,
    email: tokenRecord.user.email
  });

  return {
    user: tokenRecord.user,
    accessToken,
    refreshToken: nextRefreshToken
  };
}

export async function revokeRefreshToken(rawToken: string) {
  try {
    const { id } = parseRefreshTokenValue(rawToken);
    await prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() }
    });
  } catch {
    return;
  }
}

export async function getCurrentUserFromCookies() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  if (!accessToken) return null;

  try {
    const payload = await verifyAccessToken(accessToken);
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdminUser() {
  const user = await getCurrentUserFromCookies();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

export async function setAuthCookies(args: {
  accessToken: string;
  refreshToken: { value: string; expiresAt: Date };
}) {
  const cookieStore = await cookies();
  const isProd = env.NODE_ENV === "production";

  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: args.accessToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: env.ACCESS_TOKEN_EXPIRES_MINUTES * 60
  });

  cookieStore.set({
    name: REFRESH_COOKIE_NAME,
    value: args.refreshToken.value,
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api/auth",
    expires: args.refreshToken.expiresAt
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0
  });
  cookieStore.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    path: "/api/auth",
    maxAge: 0
  });
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function requireAdminApi(_request: NextRequest) {
  const user = await requireAdminUser();
  if (!user) {
    return { ok: false as const, response: unauthorizedResponse() };
  }
  return { ok: true as const, user };
}
