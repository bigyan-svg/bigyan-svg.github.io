import crypto from "crypto";
import { cookies } from "next/headers";
import { CSRF_COOKIE_NAME } from "@/lib/auth";
import { env } from "@/lib/env";

function signToken(rawToken: string) {
  const signature = crypto
    .createHmac("sha256", env.CSRF_SECRET)
    .update(rawToken)
    .digest("hex");
  return `${rawToken}.${signature}`;
}

function verifyToken(signedToken: string) {
  const [token, signature] = signedToken.split(".");
  if (!token || !signature) return false;
  const expected = crypto
    .createHmac("sha256", env.CSRF_SECRET)
    .update(token)
    .digest("hex");
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function issueCsrfToken() {
  const token = crypto.randomBytes(24).toString("hex");
  const signed = signToken(token);
  const cookieStore = await cookies();
  cookieStore.set({
    name: CSRF_COOKIE_NAME,
    value: signed,
    httpOnly: false,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return token;
}

export async function verifyCsrfRequest(headerToken?: string | null) {
  if (!headerToken) return false;
  const cookieStore = await cookies();
  const signedCookie = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  if (!signedCookie || !verifyToken(signedCookie)) {
    return false;
  }
  const [cookieToken] = signedCookie.split(".");
  if (!cookieToken) return false;
  if (cookieToken.length !== headerToken.length) return false;
  return crypto.timingSafeEqual(Buffer.from(headerToken), Buffer.from(cookieToken));
}
