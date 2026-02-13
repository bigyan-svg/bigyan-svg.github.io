import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_MINUTES: z.coerce.number().int().positive().default(15),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),
  CSRF_SECRET: z.string().min(16),
  PREVIEW_SECRET: z.string().min(16),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  MAX_IMAGE_MB: z.coerce.number().positive().default(5),
  MAX_PDF_MB: z.coerce.number().positive().default(10),
  MAX_VIDEO_MB: z.coerce.number().positive().default(50)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errorMessage = parsed.error.errors
    .map((error) => `${error.path.join(".")}: ${error.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${errorMessage}`);
}

export const env = parsed.data;
