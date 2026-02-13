import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiOk } from "@/lib/http";
import { incrementViewCount } from "@/lib/views";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  entity: z.enum(["project", "blog", "idea", "photo", "video"]),
  slug: z.string().min(2)
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit({
      key: `view:${ip}`,
      limit: 500,
      windowMs: 60 * 1000
    });
    if (!rate.success) {
      return apiOk({ skipped: true });
    }

    const payload = schema.parse(await request.json());
    await incrementViewCount(payload.entity, payload.slug);
    return apiOk({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
