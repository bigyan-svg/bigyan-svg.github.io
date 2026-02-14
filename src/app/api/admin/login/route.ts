import { z } from "zod";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getAdminCredentials } from "@/lib/admin-auth";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid login payload." }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const creds = getAdminCredentials();

    if (email.toLowerCase() !== creds.email || password !== creds.password) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = await createAdminSessionToken(creds.email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Unable to process login." }, { status: 500 });
  }
}
