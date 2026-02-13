import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(3).max(140),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0).optional().default(""),
  captchaA: z.coerce.number().int().min(1).max(20),
  captchaB: z.coerce.number().int().min(1).max(20),
  captchaAnswer: z.coerce.number().int().min(2).max(40)
});
