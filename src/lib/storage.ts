import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";
import { safeFileName } from "@/lib/utils";

const allowedMimeTypes = {
  image: ["image/jpeg", "image/png", "image/webp"],
  pdf: ["application/pdf"],
  video: ["video/mp4", "video/webm", "video/quicktime"]
};

function ensureCloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });
  return true;
}

async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" | "raw"
) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const publicId = safeFileName(file.name).replace(/\.[^/.]+$/, "");

  const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        public_id: publicId,
        resource_type: resourceType
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve({ secure_url: result.secure_url });
      }
    );
    stream.end(fileBuffer);
  });

  return uploaded.secure_url;
}

async function uploadToLocal(file: File, folder: string) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileName = safeFileName(file.name);
  const uploadPath = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadPath, { recursive: true });
  await writeFile(path.join(uploadPath, fileName), fileBuffer);
  return `/uploads/${folder}/${fileName}`;
}

export function validateUpload(
  file: File,
  type: "image" | "pdf" | "video"
): { ok: true } | { ok: false; error: string } {
  if (!allowedMimeTypes[type].includes(file.type)) {
    return { ok: false, error: `Invalid ${type} file type.` };
  }

  const maxMb =
    type === "image" ? env.MAX_IMAGE_MB : type === "pdf" ? env.MAX_PDF_MB : env.MAX_VIDEO_MB;

  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return { ok: false, error: `File exceeds ${maxMb}MB limit.` };
  }

  return { ok: true };
}

export async function uploadFile(params: {
  file: File;
  folder: string;
  type: "image" | "pdf" | "video";
}) {
  const isCloudinary = ensureCloudinaryConfig();
  if (isCloudinary) {
    const resourceType = params.type === "pdf" ? "raw" : params.type;
    const url = await uploadToCloudinary(params.file, params.folder, resourceType);
    return { url, provider: "cloudinary" as const };
  }

  const url = await uploadToLocal(params.file, params.folder);
  return { url, provider: "local" as const };
}
