import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";

export const runtime = "nodejs";

type UploadKind = "image" | "video" | "pdf";

const allowedKinds = new Set<UploadKind>(["image", "video", "pdf"]);
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedVideoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const allowedPdfTypes = new Set(["application/pdf"]);

function parseMaxMb(name: string, fallback: number) {
  const raw = Number(process.env[name] || fallback);
  if (!Number.isFinite(raw) || raw <= 0) return fallback;
  return raw;
}

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function extFromType(mime: string, fallback: string) {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "video/mp4") return ".mp4";
  if (mime === "video/webm") return ".webm";
  if (mime === "video/quicktime") return ".mov";
  if (mime === "application/pdf") return ".pdf";
  return fallback;
}

function validateMime(kind: UploadKind, mime: string) {
  if (kind === "image") return allowedImageTypes.has(mime);
  if (kind === "video") return allowedVideoTypes.has(mime);
  return allowedPdfTypes.has(mime);
}

function maxBytes(kind: UploadKind) {
  if (kind === "image") return parseMaxMb("MAX_IMAGE_MB", 5) * 1024 * 1024;
  if (kind === "video") return parseMaxMb("MAX_VIDEO_MB", 50) * 1024 * 1024;
  return parseMaxMb("MAX_PDF_MB", 10) * 1024 * 1024;
}

function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

async function uploadToCloudinary(buffer: Buffer, kind: UploadKind, fileName: string) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `bigyan-portfolio/${kind}`,
        public_id: `${Date.now()}-${fileName}-${randomUUID().slice(0, 8)}`,
        resource_type: kind === "video" ? "video" : kind === "pdf" ? "raw" : "image",
        overwrite: false
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Upload failed."));
          return;
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

async function uploadToLocal(buffer: Buffer, kind: UploadKind, fileName: string, extension: string) {
  const finalName = `${Date.now()}-${fileName}-${randomUUID().slice(0, 8)}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", kind);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, finalName), buffer);
  return `/uploads/${kind}/${finalName}`;
}

export async function POST(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kindRaw = String(formData.get("kind") || "image").toLowerCase();
    const kind = allowedKinds.has(kindRaw as UploadKind) ? (kindRaw as UploadKind) : null;

    if (!(file instanceof File) || !kind) {
      return NextResponse.json({ message: "Invalid upload payload." }, { status: 400 });
    }

    if (!validateMime(kind, file.type)) {
      return NextResponse.json({ message: `File type not allowed for ${kind} upload.` }, { status: 400 });
    }

    const sizeLimit = maxBytes(kind);
    if (file.size > sizeLimit) {
      return NextResponse.json({ message: `File exceeds size limit for ${kind}.` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const baseName = sanitizeBaseName(file.name || kind) || kind;
    const extension = extFromType(file.type, path.extname(file.name || "") || "");

    const url = hasCloudinaryConfig()
      ? await uploadToCloudinary(buffer, kind, baseName)
      : process.env.NODE_ENV === "production"
        ? null
        : await uploadToLocal(buffer, kind, baseName, extension || "");

    if (!url) {
      return NextResponse.json(
        { message: "Cloudinary is not configured. Set CLOUDINARY_* env vars for production uploads." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ message: "Unable to upload file." }, { status: 500 });
  }
}
