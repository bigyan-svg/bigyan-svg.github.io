import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/http";
import { contactSchema } from "@/lib/validators/contact";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit({
      key: `contact:${ip}`,
      limit: 5,
      windowMs: 10 * 60 * 1000
    });
    if (!rate.success) {
      return apiError(new Error("Too many messages. Try again later."), "", 429);
    }

    const body = await request.json();
    const payload = contactSchema.parse(body);

    if (payload.honeypot) {
      return apiError(new Error("Spam detected."), "", 400);
    }

    if (payload.captchaA + payload.captchaB !== payload.captchaAnswer) {
      return apiError(new Error("Captcha answer is incorrect."), "", 400);
    }

    await prisma.contactMessage.create({
      data: {
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        ipAddress: ip
      }
    });

    let mailSent = false;
    try {
      const result = await sendContactNotification({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message
      });
      mailSent = result.sent;
    } catch {
      mailSent = false;
    }

    return apiOk({ success: true, mailSent });
  } catch (error) {
    return apiError(error);
  }
}
