import { promises as fs } from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";

export const runtime = "nodejs";

type UploadKind = "image" | "video" | "pdf";

const allowedKinds = new Set<UploadKind>(["image", "video", "pdf"]);

function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

function normalizeSearch(input: string | null) {
  return (input || "").toLowerCase().trim();
}

function mapResourceType(kind: UploadKind) {
  if (kind === "video") return "video";
  if (kind === "pdf") return "raw";
  return "image";
}

async function listCloudinaryAssets(kind: UploadKind) {
  configureCloudinary();
  const resourceType = mapResourceType(kind) as "image" | "video" | "raw";
  const response = await cloudinary.api.resources({
    type: "upload",
    resource_type: resourceType,
    prefix: `bigyan-portfolio/${kind}/`,
    max_results: 200
  });

  const resources = Array.isArray((response as { resources?: unknown[] }).resources)
    ? ((response as { resources: Array<Record<string, unknown>> }).resources || [])
    : [];

  return resources.map((resource) => {
    const secureUrl = String(resource.secure_url || "");
    const publicId = String(resource.public_id || "");
    const createdAt = String(resource.created_at || new Date().toISOString());

    return {
      id: publicId || secureUrl,
      url: secureUrl,
      kind,
      name: publicId.split("/").pop() || publicId || secureUrl,
      createdAt
    };
  });
}

function extAllowed(kind: UploadKind, fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (kind === "image") return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
  if (kind === "video") return [".mp4", ".webm", ".mov"].includes(ext);
  return ext === ".pdf";
}

async function listLocalAssets(kind: UploadKind) {
  const baseDir = path.join(process.cwd(), "public", "uploads", kind);
  const entries = await fs.readdir(baseDir, { withFileTypes: true }).catch(() => []);

  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && extAllowed(kind, entry.name))
      .map(async (entry) => {
        const fullPath = path.join(baseDir, entry.name);
        const stat = await fs.stat(fullPath);
        return {
          id: `${kind}-${entry.name}`,
          url: `/uploads/${kind}/${entry.name}`,
          kind,
          name: entry.name,
          createdAt: stat.mtime.toISOString()
        };
      })
  );

  return files;
}

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const kindParam = String(request.nextUrl.searchParams.get("kind") || "image").toLowerCase();
    if (!allowedKinds.has(kindParam as UploadKind)) {
      return NextResponse.json({ message: "Invalid media kind." }, { status: 400 });
    }

    const kind = kindParam as UploadKind;
    const query = normalizeSearch(request.nextUrl.searchParams.get("q"));

    const items = hasCloudinaryConfig() ? await listCloudinaryAssets(kind) : await listLocalAssets(kind);

    const filtered = items
      .filter((item) => (query ? item.name.toLowerCase().includes(query) || item.url.toLowerCase().includes(query) : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ items: filtered });
  } catch {
    return NextResponse.json({ message: "Unable to list media files." }, { status: 500 });
  }
}
