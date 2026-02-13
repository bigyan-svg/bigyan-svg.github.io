import nodemailer from "nodemailer";
import { env } from "@/lib/env";

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

export async function sendContactNotification(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return { sent: false };

  const to = env.CONTACT_TO_EMAIL || env.SMTP_USER;
  if (!to) return { sent: false };

  await transporter.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    to,
    replyTo: payload.email,
    subject: `New Contact Message: ${payload.subject}`,
    text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`
  });

  return { sent: true };
}
