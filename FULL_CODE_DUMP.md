# Full Code Dump

Generated from repository files.

## `.env.example`

````
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Neon/Supabase/Postgres)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public

# Auth
JWT_ACCESS_SECRET=replace-with-very-long-random-string-at-least-32-chars
JWT_REFRESH_SECRET=replace-with-very-long-random-string-at-least-32-chars
ACCESS_TOKEN_EXPIRES_MINUTES=15
REFRESH_TOKEN_EXPIRES_DAYS=7

# CSRF + Preview
CSRF_SECRET=replace-with-random-16-plus-char-secret
PREVIEW_SECRET=replace-with-random-16-plus-char-secret

# SMTP (Gmail App Password or any SMTP provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="Bigyan Portfolio <your-email@gmail.com>"
CONTACT_TO_EMAIL=your-email@gmail.com

# Cloudinary (optional in dev, recommended in production)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Upload limits
MAX_IMAGE_MB=5
MAX_PDF_MB=10
MAX_VIDEO_MB=50

# Seed admin login
SEED_ADMIN_PASSWORD=ChangeMe123!
````

## `.gitignore`

````
# dependencies
/node_modules

# next.js
/.next
/out

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# prisma
/prisma/dev.db
/prisma/dev.db-journal

# local uploads
/public/uploads

# ide
.idea
.vscode
````

## `eslint.config.mjs`

````js
import nextVitals from "eslint-config-next/core-web-vitals";

const config = [...nextVitals];

export default config;
````

## `LICENSE`

````
MIT License

Copyright (c) 2026 Bigyan Sanjyal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## `middleware.ts`

````ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_COOKIE_NAME = "access_token";

async function verifyToken(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return null;
  try {
    const encoded = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encoded);
    return payload;
  } catch {
    return null;
  }
}

function isAdminRoute(pathname: string) {
  return pathname.startsWith("/admin");
}

function isProtectedApi(pathname: string) {
  return pathname.startsWith("/api/admin") || pathname.startsWith("/api/upload");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!isAdminRoute(pathname) && !isProtectedApi(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  if (!accessToken) {
    if (isProtectedApi(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(accessToken);
  if (!payload || payload.role !== "ADMIN") {
    if (isProtectedApi(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/upload/:path*"]
};
````

## `next.config.mjs`

````js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com"
      }
    ]
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
````

## `next-env.d.ts`

````ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
````

## `package.json`

````json
{
  "name": "bigyan-portfolio-cms",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@prisma/client": "^6.2.1",
    "@tiptap/extension-code-block-lowlight": "^2.10.4",
    "@tiptap/extension-image": "^2.10.4",
    "@tiptap/extension-link": "^2.10.4",
    "@tiptap/react": "^2.10.4",
    "@tiptap/starter-kit": "^2.10.4",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.1",
    "cloudinary": "^2.6.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "highlight.js": "^11.11.1",
    "jose": "^5.9.6",
    "lowlight": "^3.1.0",
    "lucide-react": "^0.474.0",
    "next": "^15.1.4",
    "nodemailer": "^6.10.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "sanitize-html": "^2.13.1",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.6.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.7",
    "@types/nodemailer": "^6.4.17",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.4",
    "postcss": "^8.4.49",
    "prisma": "^6.2.1",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}
````

## `postcss.config.mjs`

````js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
````

## `prisma/migrations/202602130001_init/migration.sql`

````sql
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "TimelineType" AS ENUM ('EXPERIENCE', 'EDUCATION');

-- CreateEnum
CREATE TYPE "VideoSource" AS ENUM ('YOUTUBE', 'VIMEO', 'UPLOADED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RESUME', 'CERTIFICATE', 'REPORT', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineItem" (
    "id" TEXT NOT NULL,
    "type" "TimelineType" NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TimelineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "repoUrl" TEXT,
    "liveUrl" TEXT,
    "projectType" TEXT NOT NULL,
    "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaPhoto" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MediaPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "source" "VideoSource" NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MediaVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "docType" "DocumentType" NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "resumePdfUrl" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "ipAddress" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Idea_slug_key" ON "Idea"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MediaPhoto_slug_key" ON "MediaPhoto"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MediaVideo_slug_key" ON "MediaVideo"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Document_slug_key" ON "Document"("slug");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
````

## `prisma/migrations/migration_lock.toml`

````toml
provider = "postgresql"
````

## `prisma/schema.prisma`

````prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  EDITOR
}

enum PublishStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
}

enum TimelineType {
  EXPERIENCE
  EDUCATION
}

enum VideoSource {
  YOUTUBE
  VIMEO
  UPLOADED
}

enum DocumentType {
  RESUME
  CERTIFICATE
  REPORT
  OTHER
}

model User {
  id           String         @id @default(cuid())
  name         String
  email        String         @unique
  passwordHash String
  role         Role           @default(ADMIN)
  refreshTokens RefreshToken[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime @default(now())
}

model Skill {
  id        String   @id @default(cuid())
  name      String
  category  String
  level     Int
  icon      String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TimelineItem {
  id          String       @id @default(cuid())
  type        TimelineType
  title       String
  organization String
  location    String?
  startDate   DateTime
  endDate     DateTime?
  isCurrent   Boolean      @default(false)
  description String
  sortOrder   Int          @default(0)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Project {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique
  summary     String
  content     String
  coverImage  String?
  repoUrl     String?
  liveUrl     String?
  projectType String
  techStack   String[]      @default([])
  featured    Boolean       @default(false)
  views       Int           @default(0)
  status      PublishStatus @default(DRAFT)
  publishAt   DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model BlogPost {
  id         String        @id @default(cuid())
  title      String
  slug       String        @unique
  excerpt    String
  content    String
  coverImage String?
  category   String
  tags       String[]      @default([])
  views      Int           @default(0)
  status     PublishStatus @default(DRAFT)
  publishAt  DateTime?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
}

model Idea {
  id        String        @id @default(cuid())
  title     String
  slug      String        @unique
  content   String
  tags      String[]      @default([])
  views     Int           @default(0)
  status    PublishStatus @default(DRAFT)
  publishAt DateTime?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model MediaPhoto {
  id        String        @id @default(cuid())
  title     String
  slug      String        @unique
  imageUrl  String
  caption   String?
  tags      String[]      @default([])
  views     Int           @default(0)
  status    PublishStatus @default(DRAFT)
  publishAt DateTime?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model MediaVideo {
  id           String        @id @default(cuid())
  title        String
  slug         String        @unique
  source       VideoSource
  videoUrl     String
  thumbnailUrl String?
  caption      String?
  tags         String[]      @default([])
  views        Int           @default(0)
  status       PublishStatus @default(DRAFT)
  publishAt    DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Document {
  id        String        @id @default(cuid())
  title     String
  slug      String        @unique
  fileUrl   String
  docType   DocumentType
  description String?
  status    PublishStatus @default(DRAFT)
  publishAt DateTime?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model Resume {
  id           String   @id @default(cuid())
  fullName     String
  headline     String
  summary      String
  email        String
  phone        String?
  location     String?
  website      String?
  github       String?
  linkedin     String?
  resumePdfUrl String?
  skills       String[] @default([])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String
  ipAddress String?
  isRead    Boolean  @default(false)
  replied   Boolean  @default(false)
  createdAt DateTime @default(now())
}
````

## `prisma/seed.ts`

````ts
import bcrypt from "bcryptjs";
import { PrismaClient, PublishStatus, TimelineType, VideoSource, DocumentType } from "@prisma/client";

const prisma = new PrismaClient();
const SAMPLE_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: "admin@bigyan.dev" },
    update: {
      passwordHash
    },
    create: {
      name: "Bigyan Sanjyal",
      email: "admin@bigyan.dev",
      passwordHash,
      role: "ADMIN"
    }
  });

  const resume = await prisma.resume.findFirst();
  if (!resume) {
    await prisma.resume.create({
      data: {
        fullName: "Bigyan Sanjyal",
        headline: "BE Computer Engineering Student | Full-Stack Developer",
        summary:
          "I build performant, maintainable web applications with a focus on clean architecture, practical UX, and measurable impact.",
        email: "bigyan@example.com",
        phone: "+977-9800000000",
        location: "Kathmandu, Nepal",
        website: "https://your-domain.com",
        github: "https://github.com/bigyan-svg",
        linkedin: "https://linkedin.com/in/bigyan-svg",
        resumePdfUrl: SAMPLE_PDF_URL,
        skills: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "TailwindCSS", "Node.js"]
      }
    });
  }

  await prisma.skill.createMany({
    data: [
      { name: "Next.js", category: "Frontend", level: 90, sortOrder: 1 },
      { name: "TypeScript", category: "Frontend", level: 88, sortOrder: 2 },
      { name: "Node.js", category: "Backend", level: 86, sortOrder: 3 },
      { name: "PostgreSQL", category: "Database", level: 82, sortOrder: 4 },
      { name: "Prisma", category: "ORM", level: 84, sortOrder: 5 },
      { name: "Docker", category: "DevOps", level: 72, sortOrder: 6 }
    ],
    skipDuplicates: true
  });

  await prisma.timelineItem.createMany({
    data: [
      {
        type: TimelineType.EDUCATION,
        title: "BE Computer Engineering",
        organization: "Tribhuvan University",
        location: "Kathmandu",
        startDate: new Date("2022-01-01"),
        isCurrent: true,
        description: "Focused on software systems, algorithms, and applied machine learning.",
        sortOrder: 1
      },
      {
        type: TimelineType.EXPERIENCE,
        title: "Full-Stack Developer Intern",
        organization: "Tech Studio Nepal",
        location: "Remote",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-12-31"),
        isCurrent: false,
        description: "Built internal tools with Next.js and improved dashboard performance by 35%.",
        sortOrder: 2
      }
    ],
    skipDuplicates: true
  });

  await prisma.project.upsert({
    where: { slug: "portfolio-cms-platform" },
    update: {},
    create: {
      title: "Portfolio CMS Platform",
      slug: "portfolio-cms-platform",
      summary: "A custom portfolio and CMS built with Next.js, Prisma, and PostgreSQL.",
      content:
        "<p>Production-ready full-stack platform featuring content workflows, media management, and admin analytics.</p>",
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      repoUrl: "https://github.com/bigyan-svg/portfolio-cms",
      liveUrl: "https://your-domain.com",
      projectType: "Web App",
      techStack: ["Next.js", "Prisma", "PostgreSQL", "TailwindCSS"],
      featured: true,
      status: PublishStatus.PUBLISHED,
      publishAt: new Date("2025-01-01")
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: "building-scalable-nextjs-apps" },
    update: {},
    create: {
      title: "Building Scalable Next.js Apps",
      slug: "building-scalable-nextjs-apps",
      excerpt: "Patterns and guardrails for shipping scalable full-stack Next.js projects.",
      content:
        "<h2>Why structure matters</h2><p>A good architecture minimizes decision fatigue and keeps teams fast.</p><pre><code class=\"language-ts\">export const health = () => 'ok';</code></pre>",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      category: "Engineering",
      tags: ["nextjs", "architecture", "typescript"],
      status: PublishStatus.PUBLISHED,
      publishAt: new Date("2025-02-15")
    }
  });

  await prisma.idea.upsert({
    where: { slug: "tiny-habits-for-dev-productivity" },
    update: {},
    create: {
      title: "Tiny Habits for Dev Productivity",
      slug: "tiny-habits-for-dev-productivity",
      content:
        "<p>Document one decision every day. Small notes compound into better engineering judgment.</p>",
      tags: ["productivity", "engineering"],
      status: PublishStatus.PUBLISHED,
      publishAt: new Date("2025-03-01")
    }
  });

  await prisma.mediaPhoto.upsert({
    where: { slug: "hackathon-demo-day" },
    update: {},
    create: {
      title: "Hackathon Demo Day",
      slug: "hackathon-demo-day",
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      caption: "Presenting a real-time analytics dashboard.",
      tags: ["hackathon", "presentation"],
      status: PublishStatus.PUBLISHED,
      publishAt: new Date("2025-02-10")
    }
  });

  await prisma.mediaVideo.upsert({
    where: { slug: "portfolio-walkthrough" },
    update: {},
    create: {
      title: "Portfolio Walkthrough",
      slug: "portfolio-walkthrough",
      source: VideoSource.YOUTUBE,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      caption: "Short walkthrough of the project architecture.",
      tags: ["demo", "portfolio"],
      status: PublishStatus.PUBLISHED,
      publishAt: new Date("2025-02-12")
    }
  });

  await prisma.document.upsert({
    where: { slug: "resume-bigyan-sanjyal" },
    update: {},
    create: {
      title: "Resume - Bigyan Sanjyal",
      slug: "resume-bigyan-sanjyal",
      fileUrl: SAMPLE_PDF_URL,
      docType: DocumentType.RESUME,
      description: "Updated resume for internships and full-time roles.",
      status: PublishStatus.PUBLISHED,
      publishAt: new Date("2025-02-01")
    }
  });

  console.log("Seed completed.");
  console.log("Admin login: admin@bigyan.dev /", adminPassword);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
````

## `README.md`

````md
# Bigyan Portfolio CMS (Next.js + Prisma + PostgreSQL)

Production-ready full-stack personal portfolio + CMS for **Bigyan Sanjyal** (`bigyan-svg`), built with:

- Next.js App Router + TypeScript
- TailwindCSS + reusable shadcn-style UI components
- Prisma ORM + PostgreSQL
- JWT access token + rotating refresh tokens
- Admin-only CMS dashboard
- Cloudinary/local media uploads
- SMTP contact notifications

## Architecture Decisions

- **Backend choice:** Next.js Route Handlers (`src/app/api/**`) instead of separate Express service.
  - Why: one deploy target (Vercel), less operational overhead, shared types/utilities.
- **Rich text:** TipTap editor with HTML storage.
  - Why: good editing UX, code block support, image embedding, easy sanitize/render pipeline.
- **Storage:** Cloudinary in production, local `/public/uploads` fallback in development.
  - Why: easy setup with strong CDN behavior while preserving local-dev ergonomics.

## Features

### Public Website
- Home, About, Skills, Projects, Experience, Contact
- Blog with category/tag/search/pagination
- Ideas/Notes with tags/search/pagination
- Media page:
  - Photo grid + lightbox
  - Video embeds (YouTube/Vimeo) + uploaded video support
  - PDF/resources list + detail preview
- Resume page (DB-driven + PDF download)
- SEO: metadata, `sitemap.xml`, `robots.txt`
- Responsive, mobile-first UI

### Admin Dashboard (CMS)
- Secure admin login (JWT + refresh token rotation)
- CRUD for:
  - Projects
  - Blog Posts
  - Ideas
  - Photos
  - Videos
  - Documents
  - Skills
  - Timeline
  - Resume
- Draft / Published / Scheduled status
- Slug generator
- Preview mode endpoint
- Upload Manager (image/pdf/video)
- Analytics page
- Contact message inbox with mailto reply actions

### Security
- Admin route/API protection via middleware + server checks
- CSRF protection for mutating/auth endpoints
- Zod validation on API input
- HTML sanitization for rich content
- Auth + contact + view endpoint rate limiting
- File type/size validation for uploads

## Project Structure

```text
.
â”œâ”€â”€ .env.example
â”œâ”€â”€ middleware.ts
â”œâ”€â”€ package.json
â”œâ”€â”€ prisma
â”‚   â”œâ”€â”€ migrations
â”‚   â”‚   â””â”€â”€ 202602130001_init
â”‚   â”‚       â””â”€â”€ migration.sql
â”‚   â”œâ”€â”€ schema.prisma
â”‚   â””â”€â”€ seed.ts
â””â”€â”€ src
    â”œâ”€â”€ app
    â”‚   â”œâ”€â”€ admin
    â”‚   â”œâ”€â”€ api
    â”‚   â”œâ”€â”€ about
    â”‚   â”œâ”€â”€ blog
    â”‚   â”œâ”€â”€ contact
    â”‚   â”œâ”€â”€ experience
    â”‚   â”œâ”€â”€ ideas
    â”‚   â”œâ”€â”€ media
    â”‚   â”œâ”€â”€ projects
    â”‚   â”œâ”€â”€ resume
    â”‚   â”œâ”€â”€ skills
    â”‚   â”œâ”€â”€ globals.css
    â”‚   â”œâ”€â”€ layout.tsx
    â”‚   â”œâ”€â”€ loading.tsx
    â”‚   â”œâ”€â”€ not-found.tsx
    â”‚   â”œâ”€â”€ page.tsx
    â”‚   â”œâ”€â”€ robots.ts
    â”‚   â””â”€â”€ sitemap.ts
    â”œâ”€â”€ components
    â”‚   â”œâ”€â”€ admin
    â”‚   â”œâ”€â”€ cards
    â”‚   â”œâ”€â”€ common
    â”‚   â”œâ”€â”€ content
    â”‚   â”œâ”€â”€ forms
    â”‚   â”œâ”€â”€ layout
    â”‚   â”œâ”€â”€ media
    â”‚   â””â”€â”€ ui
    â””â”€â”€ lib
        â”œâ”€â”€ validators
        â””â”€â”€ *.ts
```

## Setup (Windows PowerShell)

1. Install Node.js 20+ and PostgreSQL (or Neon/Supabase DB URL).
2. Copy env file:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Generate Prisma client:
   ```powershell
   npm run prisma:generate
   ```
5. Run migration:
   ```powershell
   npm run prisma:migrate
   ```
6. Seed sample data:
   ```powershell
   npm run db:seed
   ```
7. Start dev server:
   ```powershell
   npm run dev
   ```

## Setup (Ubuntu)

1. Install Node.js 20+ and PostgreSQL client tools.
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Prisma setup:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Useful Commands

```bash
# Install deps
npm install

# Dev
npm run dev

# Build + start
npm run build
npm run start

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run db:seed
```

## Environment Variables Explained

- `DATABASE_URL`: PostgreSQL connection string for Prisma.
- `JWT_ACCESS_SECRET`: secret for short-lived access JWT.
- `JWT_REFRESH_SECRET`: reserved for refresh-token strategy configuration.
- `ACCESS_TOKEN_EXPIRES_MINUTES`: access-token TTL.
- `REFRESH_TOKEN_EXPIRES_DAYS`: refresh-token TTL.
- `CSRF_SECRET`: HMAC signing secret for CSRF cookie token.
- `PREVIEW_SECRET`: preview-mode access secret.
- `SMTP_*`: SMTP config for contact notifications.
- `CONTACT_TO_EMAIL`: inbox target for contact email notifications.
- `CLOUDINARY_*`: cloud media storage credentials.
- `MAX_IMAGE_MB`/`MAX_PDF_MB`/`MAX_VIDEO_MB`: upload limits.
- `SEED_ADMIN_PASSWORD`: password for seeded admin user.

## Deployment Guide

### 1) Database (Neon or Supabase)
- Create PostgreSQL project.
- Copy DB URL into `DATABASE_URL`.
- Run `npm run prisma:deploy`.

### 2) Deploy to Vercel
- Push repo to GitHub.
- Import repo in Vercel.
- Add all environment variables from `.env.example`.
- Set `NEXT_PUBLIC_APP_URL` to production domain.
- Deploy.

### 3) Post-Deploy
- Run seed once against production DB:
  - locally with prod `DATABASE_URL`, run `npm run db:seed`
  - or run as one-time CI task.
- Test:
  - `/admin/login`
  - upload manager
  - contact form email notification
  - sitemap/robots endpoints

### 4) File Storage
- **Recommended prod:** Cloudinary (set `CLOUDINARY_*`).
- **Dev fallback:** local files saved under `public/uploads`.

## Customization Checklist

- [ ] Update your domain in `NEXT_PUBLIC_APP_URL`
- [ ] Update metadata base URL in `src/app/layout.tsx`
- [ ] Replace admin seed email/password
- [ ] Update resume content in `/admin/resume`
- [ ] Update About section copy
- [ ] Add your real GitHub/LinkedIn/email links
- [ ] Add project case studies in `/admin/projects`
- [ ] Add blog categories/tags and posts in `/admin/blog-posts`
- [ ] Add ideas in `/admin/ideas`
- [ ] Upload media and documents from `/admin/uploads`
- [ ] Configure SMTP for contact notifications
- [ ] Configure Cloudinary for production uploads
- [ ] Validate `sitemap.xml` and `robots.txt` in production
My personal portfolio website showcasing projects, skills, and achievements.
````

## `src/app/about/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteResume } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "About"
};

export default async function AboutPage() {
  const resume = await getSiteResume();

  return (
    <>
      <PageHeader
        title="About Me"
        description="A practical engineer who values clarity, maintainability, and user-centered outcomes."
      />
      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardContent className="space-y-4 p-6">
              <p>{resume?.summary}</p>
              <p className="text-muted-foreground">
                I focus on turning complex requirements into reliable software with clean architecture and measurable performance.
              </p>
              <p className="text-muted-foreground">
                I enjoy backend architecture, UX-driven frontend implementation, and iterative product improvement from data and feedback.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6 text-sm">
              <p>
                <strong>Name:</strong> {resume?.fullName || "Bigyan Sanjyal"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <Link href={`mailto:${resume?.email || "bigyan@example.com"}`}>
                  {resume?.email || "bigyan@example.com"}
                </Link>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <Link href={resume?.github || "https://github.com/bigyan-svg"} target="_blank">
                  bigyan-svg
                </Link>
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <Link
                  href={resume?.linkedin || "https://linkedin.com/in/bigyan-svg"}
                  target="_blank"
                >
                  /in/bigyan-svg
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
````

## `src/app/admin/analytics/page.tsx`

````tsx
import { AnalyticsPanel } from "@/components/admin/analytics-panel";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Basic content and engagement metrics from the CMS database.
        </p>
      </div>
      <AnalyticsPanel />
    </div>
  );
}
````

## `src/app/admin/blog-posts/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminBlogPostsPage() {
  return (
    <EntityManager
      entity="blog-posts"
      title="Blog Posts"
      description="Manage long-form blog content with categories, tags, and publishing."
      previewPath={(item) => `/blog/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
        { name: "content", label: "Content", type: "richtext", required: true },
        { name: "coverImage", label: "Cover Image URL", type: "url", uploadType: "image" },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/admin/documents/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

const typeOptions = [
  { label: "Resume", value: "RESUME" },
  { label: "Certificate", value: "CERTIFICATE" },
  { label: "Report", value: "REPORT" },
  { label: "Other", value: "OTHER" }
];

export default function AdminDocumentsPage() {
  return (
    <EntityManager
      entity="documents"
      title="Documents"
      description="Upload and organize PDFs such as resume, certificates, and reports."
      previewPath={(item) => `/media/documents/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "fileUrl", label: "File URL", type: "url", required: true, uploadType: "pdf" },
        { name: "docType", label: "Document Type", type: "select", options: typeOptions },
        { name: "description", label: "Description", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT",
        docType: "OTHER"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "docType", label: "Type" },
        { key: "status", label: "Status" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/admin/ideas/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminIdeasPage() {
  return (
    <EntityManager
      entity="ideas"
      title="Ideas"
      description="Manage short-form ideas, notes, and thought snippets."
      previewPath={(item) => `/ideas/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "content", label: "Content", type: "richtext", required: true },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "tags", label: "Tags" },
        { key: "status", label: "Status" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/admin/layout.tsx`

````tsx
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <AdminSidebar />
      <div className="flex-1">
        <div className="border-b border-border bg-background px-6 py-4">
          <p className="text-sm text-muted-foreground">Portfolio CMS Dashboard</p>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
````

## `src/app/admin/loading.tsx`

````tsx
export default function AdminLoading() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-28 w-full animate-pulse rounded bg-muted" />
      <div className="h-56 w-full animate-pulse rounded bg-muted" />
    </div>
  );
}
````

## `src/app/admin/login/page.tsx`

````tsx
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminLoginPage() {
  const user = await requireAdminUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in with your admin credentials to manage content.
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
````

## `src/app/admin/messages/page.tsx`

````tsx
import { MessagesInbox } from "@/components/admin/messages-inbox";

export default function AdminMessagesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Contact form submissions saved in the database.
        </p>
      </div>
      <MessagesInbox />
    </div>
  );
}
````

## `src/app/admin/page.tsx`

````tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const [
    projectCount,
    blogCount,
    ideaCount,
    messageCount,
    unreadCount,
    views
  ] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.idea.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    Promise.all([
      prisma.project.aggregate({ _sum: { views: true } }),
      prisma.blogPost.aggregate({ _sum: { views: true } }),
      prisma.idea.aggregate({ _sum: { views: true } })
    ])
  ]);

  const totalViews =
    (views[0]._sum.views ?? 0) + (views[1]._sum.views ?? 0) + (views[2]._sum.views ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Content snapshot and quick actions for the portfolio CMS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{projectCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{blogCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ideas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{ideaCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Views</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{totalViews}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Total: {messageCount}</p>
            <p>Unread: {unreadCount}</p>
            <Link href="/admin/messages" className="text-primary hover:underline">
              Open inbox
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Use `status` and `publishAt` in each editor to control Draft / Published / Scheduled state.</p>
            <p>For preview mode, use `/api/preview?secret=PREVIEW_SECRET&slug=/target-path`.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
````

## `src/app/admin/photos/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminPhotosPage() {
  return (
    <EntityManager
      entity="photos"
      title="Photos"
      description="Manage gallery photo uploads and metadata."
      previewPath={(item) => `/media/photos/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "imageUrl", label: "Image URL", type: "url", required: true, uploadType: "image" },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "status", label: "Status" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/admin/projects/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminProjectsPage() {
  return (
    <EntityManager
      entity="projects"
      title="Projects"
      description="Manage portfolio projects with publish workflow, tags, and rich details."
      previewPath={(item) => `/projects/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "content", label: "Content", type: "richtext", required: true },
        { name: "coverImage", label: "Cover Image URL", type: "url", uploadType: "image" },
        { name: "repoUrl", label: "Repo URL", type: "url" },
        { name: "liveUrl", label: "Live URL", type: "url" },
        { name: "projectType", label: "Project Type", type: "text", required: true },
        { name: "techStack", label: "Tech Stack", type: "tags", helpText: "Comma separated" },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT",
        featured: false
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "projectType", label: "Type" },
        { key: "status", label: "Status" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/admin/resume/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

export default function AdminResumePage() {
  return (
    <EntityManager
      entity="resume"
      title="Resume"
      description="Manage profile details and resume PDF shown on public pages."
      fields={[
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "headline", label: "Headline", type: "text", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "email", label: "Email", type: "text", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "website", label: "Website", type: "url" },
        { name: "github", label: "GitHub URL", type: "url" },
        { name: "linkedin", label: "LinkedIn URL", type: "url" },
        { name: "resumePdfUrl", label: "Resume PDF URL", type: "url", uploadType: "pdf" },
        { name: "skills", label: "Skills", type: "tags" }
      ]}
      defaultValues={{
        fullName: "Bigyan Sanjyal",
        headline: "BE Computer Engineering Student | Full-Stack Developer",
        email: "bigyan@example.com"
      }}
      columns={[
        { key: "fullName", label: "Name" },
        { key: "headline", label: "Headline" },
        { key: "email", label: "Email" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/admin/skills/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

export default function AdminSkillsPage() {
  return (
    <EntityManager
      entity="skills"
      title="Skills"
      description="Manage technical skill list shown on the public site."
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "level", label: "Level (1-100)", type: "number", required: true },
        { name: "icon", label: "Icon Name", type: "text" },
        { name: "sortOrder", label: "Sort Order", type: "number" }
      ]}
      defaultValues={{
        level: 80,
        sortOrder: 0
      }}
      columns={[
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "level", label: "Level" },
        { key: "sortOrder", label: "Order" }
      ]}
    />
  );
}
````

## `src/app/admin/timeline/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

const typeOptions = [
  { label: "Experience", value: "EXPERIENCE" },
  { label: "Education", value: "EDUCATION" }
];

export default function AdminTimelinePage() {
  return (
    <EntityManager
      entity="timeline"
      title="Timeline"
      description="Manage experience and education timeline entries."
      fields={[
        { name: "type", label: "Type", type: "select", options: typeOptions },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "organization", label: "Organization", type: "text", required: true },
        { name: "location", label: "Location", type: "text" },
        { name: "startDate", label: "Start Date", type: "datetime", required: true },
        { name: "endDate", label: "End Date", type: "datetime" },
        { name: "isCurrent", label: "Current", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "sortOrder", label: "Sort Order", type: "number" }
      ]}
      defaultValues={{
        type: "EXPERIENCE",
        isCurrent: false,
        sortOrder: 0
      }}
      columns={[
        { key: "type", label: "Type" },
        { key: "title", label: "Title" },
        { key: "organization", label: "Organization" },
        {
          key: "startDate",
          label: "Start Date",
          render: (item) => new Date(String(item.startDate)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/admin/uploads/page.tsx`

````tsx
import { UploadManager } from "@/components/admin/upload-manager";

export default function AdminUploadPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Upload Manager</h1>
        <p className="text-sm text-muted-foreground">
          Upload images, PDFs, or videos and reuse the generated URL in any content form.
        </p>
      </div>
      <UploadManager />
    </div>
  );
}
````

## `src/app/admin/videos/page.tsx`

````tsx
import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

const sourceOptions = [
  { label: "YouTube", value: "YOUTUBE" },
  { label: "Vimeo", value: "VIMEO" },
  { label: "Uploaded", value: "UPLOADED" }
];

export default function AdminVideosPage() {
  return (
    <EntityManager
      entity="videos"
      title="Videos"
      description="Manage YouTube/Vimeo embeds or uploaded video entries."
      previewPath={(item) => `/media/videos/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "source", label: "Source", type: "select", options: sourceOptions },
        { name: "videoUrl", label: "Video URL", type: "url", required: true, uploadType: "video" },
        { name: "thumbnailUrl", label: "Thumbnail URL", type: "url", uploadType: "image" },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT",
        source: "YOUTUBE"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "source", label: "Source" },
        { key: "status", label: "Status" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
````

## `src/app/api/admin/[entity]/[id]/route.ts`

````ts
import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { requireAdminApi } from "@/lib/auth";
import {
  deleteContentEntity,
  getContentEntityById,
  isSupportedEntity,
  updateContentEntity
} from "@/lib/content-service";
import { verifyCsrfRequest } from "@/lib/csrf";

type Params = { params: Promise<{ entity: string; id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { entity, id } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const item = await getContentEntityById(entity, id);
    if (!item) {
      return apiError(new Error("Not found"), "", 404);
    }
    return apiOk(item);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { entity, id } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const payload = await request.json();
    const item = await updateContentEntity(entity, id, payload);
    return apiOk(item);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { entity, id } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const item = await deleteContentEntity(entity, id);
    return apiOk(item);
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/admin/[entity]/route.ts`

````ts
import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { requireAdminApi } from "@/lib/auth";
import {
  createContentEntity,
  isSupportedEntity,
  listContentEntity
} from "@/lib/content-service";
import { verifyCsrfRequest } from "@/lib/csrf";

type Params = { params: Promise<{ entity: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { entity } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Math.min(50, Number(url.searchParams.get("pageSize") || "10"));
    const q = url.searchParams.get("q") || undefined;

    const result = await listContentEntity({
      entity,
      page,
      pageSize,
      query: q
    });

    return apiOk(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { entity } = await params;
    if (!isSupportedEntity(entity)) {
      return apiError(new Error("Unsupported entity"), "", 404);
    }

    const payload = await request.json();
    const created = await createContentEntity(entity, payload);
    return apiOk(created, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/admin/analytics/route.ts`

````ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const [
      projectCount,
      blogCount,
      ideaCount,
      photoCount,
      videoCount,
      documentCount,
      messageCount,
      unreadMessageCount,
      projectViews,
      blogViews,
      ideaViews
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.idea.count(),
      prisma.mediaPhoto.count(),
      prisma.mediaVideo.count(),
      prisma.document.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.project.aggregate({ _sum: { views: true } }),
      prisma.blogPost.aggregate({ _sum: { views: true } }),
      prisma.idea.aggregate({ _sum: { views: true } })
    ]);

    return apiOk({
      totals: {
        projects: projectCount,
        blogs: blogCount,
        ideas: ideaCount,
        photos: photoCount,
        videos: videoCount,
        documents: documentCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount
      },
      views: {
        projects: projectViews._sum.views ?? 0,
        blogs: blogViews._sum.views ?? 0,
        ideas: ideaViews._sum.views ?? 0,
        total:
          (projectViews._sum.views ?? 0) + (blogViews._sum.views ?? 0) + (ideaViews._sum.views ?? 0)
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/admin/messages/[id]/route.ts`

````ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/http";
import { verifyCsrfRequest } from "@/lib/csrf";
import { z } from "zod";

const updateSchema = z.object({
  isRead: z.boolean().optional(),
  replied: z.boolean().optional()
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { id } = await params;
    const body = await request.json();
    const payload = updateSchema.parse(body);

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: payload
    });

    return apiOk(updated);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const { id } = await params;
    const deleted = await prisma.contactMessage.delete({ where: { id } });
    return apiOk(deleted);
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/admin/messages/route.ts`

````ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Math.min(50, Number(url.searchParams.get("pageSize") || "20"));
    const q = url.searchParams.get("q") || "";

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { subject: { contains: q, mode: "insensitive" as const } }
          ]
        }
      : {};

    const [total, items] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return apiOk({
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/admin/preview-link/route.ts`

````ts
import { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { requireAdminApi } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    if (!slug || !slug.startsWith("/")) {
      return apiError(new Error("Invalid slug"), "", 400);
    }

    const previewUrl = `/api/preview?secret=${encodeURIComponent(env.PREVIEW_SECRET)}&slug=${encodeURIComponent(slug)}`;
    return apiOk({ previewUrl });
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/auth/csrf/route.ts`

````ts
import { NextResponse } from "next/server";
import { issueCsrfToken } from "@/lib/csrf";

export async function GET() {
  const token = await issueCsrfToken();
  return NextResponse.json({ data: { csrfToken: token } });
}
````

## `src/app/api/auth/login/route.ts`

````ts
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/http";
import { loginSchema } from "@/lib/validators/auth";
import { createAccessToken, issueRefreshToken, setAuthCookies } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrfRequest } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit({
      key: `auth-login:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000
    });
    if (!rate.success) {
      return apiError(new Error("Too many login attempts, try again later."), "", 429);
    }

    const body = await request.json();
    const input = loginSchema.parse(body);

    const csrfValid = await verifyCsrfRequest(
      request.headers.get("x-csrf-token") || input.csrfToken
    );
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token."), "", 403);
    }

    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user) {
      return apiError(new Error("Invalid email or password."), "", 401);
    }

    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) {
      return apiError(new Error("Invalid email or password."), "", 401);
    }

    const accessToken = await createAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });
    const refreshToken = await issueRefreshToken(user.id);

    await setAuthCookies({
      accessToken,
      refreshToken
    });

    return apiOk({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/auth/logout/route.ts`

````ts
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiError, apiOk } from "@/lib/http";
import {
  clearAuthCookies,
  REFRESH_COOKIE_NAME,
  revokeRefreshToken
} from "@/lib/auth";
import { verifyCsrfRequest } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token."), "", 403);
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    await clearAuthCookies();

    return apiOk({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/auth/me/route.ts`

````ts
import { apiOk } from "@/lib/http";
import { getCurrentUserFromCookies } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserFromCookies();
  return apiOk({ user });
}
````

## `src/app/api/auth/refresh/route.ts`

````ts
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiError, apiOk } from "@/lib/http";
import { REFRESH_COOKIE_NAME, setAuthCookies, rotateRefreshToken } from "@/lib/auth";
import { verifyCsrfRequest } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit({
      key: `auth-refresh:${ip}`,
      limit: 30,
      windowMs: 15 * 60 * 1000
    });
    if (!rate.success) {
      return apiError(new Error("Too many requests."), "", 429);
    }

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token."), "", 403);
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    if (!refreshToken) {
      return apiError(new Error("Missing refresh token."), "", 401);
    }

    const nextTokens = await rotateRefreshToken(refreshToken);
    await setAuthCookies({
      accessToken: nextTokens.accessToken,
      refreshToken: nextTokens.refreshToken
    });

    return apiOk({
      user: {
        id: nextTokens.user.id,
        name: nextTokens.user.name,
        email: nextTokens.user.email,
        role: nextTokens.user.role
      }
    });
  } catch (error) {
    return apiError(error, "", 401);
  }
}
````

## `src/app/api/contact/route.ts`

````ts
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
````

## `src/app/api/preview/disable/route.ts`

````ts
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  return NextResponse.redirect(new URL("/", request.url));
}
````

## `src/app/api/preview/route.ts`

````ts
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug") || "/";

  if (secret !== env.PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid preview secret" }, { status: 401 });
  }

  if (!slug.startsWith("/")) {
    return NextResponse.json({ error: "Invalid preview target" }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(slug, request.url));
}
````

## `src/app/api/upload/route.ts`

````ts
import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { requireAdminApi } from "@/lib/auth";
import { verifyCsrfRequest } from "@/lib/csrf";
import { uploadFile, validateUpload } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const csrfValid = await verifyCsrfRequest(request.headers.get("x-csrf-token"));
    if (!csrfValid) {
      return apiError(new Error("Invalid CSRF token"), "", 403);
    }

    const formData = await request.formData();
    const rawFile = formData.get("file");
    const rawType = formData.get("type");
    const folder = String(formData.get("folder") || "general");

    if (!(rawFile instanceof File)) {
      return apiError(new Error("No file uploaded"), "", 400);
    }

    if (rawType !== "image" && rawType !== "pdf" && rawType !== "video") {
      return apiError(new Error("Invalid upload type"), "", 400);
    }

    const validation = validateUpload(rawFile, rawType);
    if (!validation.ok) {
      return apiError(new Error(validation.error), "", 400);
    }

    const result = await uploadFile({
      file: rawFile,
      folder,
      type: rawType
    });

    return apiOk(result);
  } catch (error) {
    return apiError(error);
  }
}
````

## `src/app/api/view/route.ts`

````ts
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
````

## `src/app/blog/[slug]/page.tsx`

````tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { TagList } from "@/components/content/tag-list";
import { RenderHtml } from "@/components/content/render-html";
import { ViewTracker } from "@/components/content/view-tracker";
import { CodeHighlight } from "@/components/content/code-highlight";
import { getBlogBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug, true);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : []
    }
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const post = await getBlogBySlug(slug, draft.isEnabled);
  if (!post) {
    notFound();
  }

  return (
    <section className="container py-12">
      <ViewTracker entity="blog" slug={post.slug} />
      <CodeHighlight />
      <article className="mx-auto max-w-4xl space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {post.publishAt ? new Date(post.publishAt).toLocaleDateString() : "Draft"}
            </span>
            <span className="text-xs text-muted-foreground">{post.views} views</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{post.title}</h1>
          <p className="text-muted-foreground">{post.excerpt}</p>
          <TagList tags={post.tags} />
        </div>
        <RenderHtml html={post.content} />
      </article>
    </section>
  );
}
````

## `src/app/blog/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPosts } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { BlogCard } from "@/components/cards/blog-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PaginationLinks } from "@/components/common/pagination-links";

export const metadata: Metadata = {
  title: "Blog"
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const rawCategory = typeof params.category === "string" ? params.category : "";
  const rawTag = typeof params.tag === "string" ? params.tag : "";
  const category = rawCategory === "all" ? "" : rawCategory;
  const tag = rawTag === "all" ? "" : rawTag;
  const page = Number(typeof params.page === "string" ? params.page : "1");

  const result = await listBlogPosts({
    page,
    pageSize: 9,
    q: q || undefined,
    category: category || undefined,
    tag: tag || undefined
  });

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (category) query.set("category", category);
    if (tag) query.set("tag", tag);
    query.set("page", String(targetPage));
    return `/blog?${query.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Blog"
        description="Engineering notes, architecture writeups, and full-stack implementation stories."
      />
      <section className="container pb-16">
        <form className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4">
          <Input defaultValue={q} name="q" placeholder="Search posts..." />
          <Select
            name="category"
            defaultValue={category || "all"}
            options={[
              { label: "All Categories", value: "all" },
              ...result.categories.map((item) => ({ label: item, value: item }))
            ]}
          />
          <Select
            name="tag"
            defaultValue={tag || "all"}
            options={[
              { label: "All Tags", value: "all" },
              ...result.tags.map((item) => ({ label: `#${item}`, value: item }))
            ]}
          />
          <div className="flex gap-2">
            <Button type="submit" className="w-full">
              Apply
            </Button>
            <Link href="/blog" className="inline-flex h-10 items-center rounded-md border border-input px-4 text-sm">
              Reset
            </Link>
          </div>
        </form>

        <div className="grid gap-6 lg:grid-cols-3">
          {result.items.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <PaginationLinks pagination={result.pagination} buildHref={buildHref} />
      </section>
    </>
  );
}
````

## `src/app/contact/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        description="Have a project, internship, or collaboration in mind? Send me a message."
      />
      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardContent className="p-6">
              <ContactForm />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6 text-sm">
              <p className="text-muted-foreground">
                Messages are saved in the CMS inbox. Email notifications are sent via SMTP when configured.
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <Link href="mailto:bigyan@example.com" className="text-primary hover:underline">
                  bigyan@example.com
                </Link>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <Link href="https://github.com/bigyan-svg" target="_blank" className="text-primary hover:underline">
                  github.com/bigyan-svg
                </Link>
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <Link
                  href="https://linkedin.com/in/bigyan-svg"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  linkedin.com/in/bigyan-svg
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
````

## `src/app/experience/page.tsx`

````tsx
import type { Metadata } from "next";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeline } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Experience & Education"
};

export default async function ExperiencePage() {
  const timeline = await getTimeline();

  return (
    <>
      <PageHeader
        title="Experience & Education"
        description="A timeline of my academic and professional journey."
      />
      <section className="container pb-16">
        <div className="space-y-4">
          {timeline.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-3 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.organization}
                      {item.location ? ` â€¢ ${item.location}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(item.startDate, "MMM yyyy")} -{" "}
                      {item.isCurrent ? "Present" : item.endDate ? format(item.endDate, "MMM yyyy") : "N/A"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
````

## `src/app/globals.css`

````css
@import "highlight.js/styles/github-dark.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 35 20% 97%;
  --foreground: 220 26% 16%;
  --muted: 35 30% 92%;
  --muted-foreground: 220 10% 40%;
  --border: 26 28% 85%;
  --input: 26 28% 85%;
  --card: 0 0% 100%;
  --card-foreground: 220 26% 16%;
  --primary: 214 88% 39%;
  --primary-foreground: 0 0% 100%;
  --secondary: 24 59% 95%;
  --secondary-foreground: 220 26% 16%;
  --accent: 199 74% 90%;
  --accent-foreground: 220 26% 16%;
  --ring: 214 88% 39%;
  --destructive: 0 78% 45%;
  --destructive-foreground: 0 0% 98%;
  --radius: 0.65rem;
}

* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground antialiased;
  background-image:
    radial-gradient(circle at 10% -10%, rgba(53, 136, 230, 0.16), transparent 46%),
    radial-gradient(circle at 90% 0%, rgba(82, 196, 223, 0.18), transparent 40%);
}

.prose-content h1,
.prose-content h2,
.prose-content h3 {
  @apply mt-8 font-semibold tracking-tight;
}

.prose-content p {
  @apply mt-4 leading-7 text-foreground/90;
}

.prose-content ul {
  @apply mt-4 list-disc pl-5;
}

.prose-content pre {
  @apply mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-zinc-100;
}

.prose-content code {
  @apply rounded bg-muted px-1 py-0.5 text-sm;
}

.prose-content pre code {
  @apply bg-transparent p-0 text-zinc-100;
}
````

## `src/app/ideas/[slug]/page.tsx`

````tsx
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { TagList } from "@/components/content/tag-list";
import { RenderHtml } from "@/components/content/render-html";
import { ViewTracker } from "@/components/content/view-tracker";
import { getIdeaBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug, true);
  if (!idea) return {};
  return {
    title: idea.title,
    description: idea.content.replace(/<[^>]+>/g, "").slice(0, 140)
  };
}

export default async function IdeaDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const idea = await getIdeaBySlug(slug, draft.isEnabled);

  if (!idea) {
    notFound();
  }

  return (
    <section className="container py-12">
      <ViewTracker entity="idea" slug={idea.slug} />
      <article className="mx-auto max-w-3xl space-y-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{idea.title}</h1>
          <p className="text-sm text-muted-foreground">
            {idea.publishAt ? new Date(idea.publishAt).toLocaleDateString() : "Draft"} â€¢ {idea.views} views
          </p>
          <TagList tags={idea.tags} />
        </div>
        <RenderHtml html={idea.content} />
      </article>
    </section>
  );
}
````

## `src/app/ideas/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { listIdeas } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { IdeaCard } from "@/components/cards/idea-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PaginationLinks } from "@/components/common/pagination-links";

export const metadata: Metadata = {
  title: "Ideas"
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function IdeasPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const rawTag = typeof params.tag === "string" ? params.tag : "";
  const tag = rawTag === "all" ? "" : rawTag;
  const page = Number(typeof params.page === "string" ? params.page : "1");

  const result = await listIdeas({
    page,
    pageSize: 12,
    q: q || undefined,
    tag: tag || undefined
  });

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (tag) query.set("tag", tag);
    query.set("page", String(targetPage));
    return `/ideas?${query.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Ideas & Notes"
        description="Short thoughts, experiments, and practical observations from day-to-day development."
      />
      <section className="container pb-16">
        <form className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-3">
          <Input defaultValue={q} name="q" placeholder="Search ideas..." />
          <Select
            name="tag"
            defaultValue={tag || "all"}
            options={[
              { label: "All Tags", value: "all" },
              ...result.tags.map((item) => ({ label: `#${item}`, value: item }))
            ]}
          />
          <div className="flex gap-2">
            <Button type="submit" className="w-full">
              Apply
            </Button>
            <Link href="/ideas" className="inline-flex h-10 items-center rounded-md border border-input px-4 text-sm">
              Reset
            </Link>
          </div>
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.items.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        <PaginationLinks pagination={result.pagination} buildHref={buildHref} />
      </section>
    </>
  );
}
````

## `src/app/layout.tsx`

````tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Fira_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"]
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: "Bigyan Sanjyal | Full-Stack Portfolio",
    template: "%s | Bigyan Sanjyal"
  },
  description:
    "Personal portfolio and CMS of Bigyan Sanjyal, BE Computer Engineering student and full-stack developer.",
  keywords: [
    "Bigyan Sanjyal",
    "bigyan-svg",
    "portfolio",
    "computer engineering",
    "full-stack developer"
  ],
  openGraph: {
    title: "Bigyan Sanjyal | Full-Stack Portfolio",
    description:
      "Projects, blogs, ideas, media, and resources managed via a custom CMS dashboard.",
    url: "https://your-domain.com",
    siteName: "Bigyan Portfolio",
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${firaCode.variable}`}>
      <body className="min-h-screen font-[var(--font-space-grotesk)]">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
````

## `src/app/loading.tsx`

````tsx
export default function GlobalLoading() {
  return (
    <section className="container py-16">
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </section>
  );
}
````

## `src/app/media/documents/[slug]/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDocumentBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const document = await getDocumentBySlug(slug, true);
  if (!document) return {};
  return {
    title: document.title,
    description: document.description || document.title
  };
}

export default async function DocumentDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const document = await getDocumentBySlug(slug, draft.isEnabled);
  if (!document) notFound();

  return (
    <section className="container py-12">
      <div className="mx-auto max-w-3xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">{document.title}</h1>
        <Badge variant="secondary">{document.docType}</Badge>
        <p className="text-muted-foreground">{document.description}</p>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Link href={document.fileUrl} target="_blank" className="text-primary hover:underline">
              Open document preview
            </Link>
            <iframe
              src={document.fileUrl}
              className="h-[70vh] w-full rounded-lg border border-border"
              title={document.title}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
````

## `src/app/media/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhotoLightbox } from "@/components/media/photo-lightbox";
import { listMedia } from "@/lib/public-data";
import { vimeoEmbedUrl, youtubeEmbedUrl } from "@/lib/video";

export const metadata: Metadata = {
  title: "Media"
};

export default async function MediaPage() {
  const { photos, videos, documents } = await listMedia({});

  return (
    <>
      <PageHeader
        title="Media Gallery"
        description="Photos, videos, and downloadable resources from projects, events, and learning journeys."
      />
      <section className="container space-y-12 pb-16">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Photos</h2>
            <span className="text-sm text-muted-foreground">{photos.length} items</span>
          </div>
          <PhotoLightbox photos={photos.map((p) => ({ id: p.id, title: p.title, imageUrl: p.imageUrl }))} />
          <div className="flex flex-wrap gap-2">
            {photos.slice(0, 8).map((photo) => (
              <Link
                key={photo.id}
                href={`/media/photos/${photo.slug}`}
                className="text-xs text-primary hover:underline"
              >
                {photo.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Videos</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {videos.map((video) => {
              const embedUrl =
                video.source === "YOUTUBE"
                  ? youtubeEmbedUrl(video.videoUrl)
                  : video.source === "VIMEO"
                    ? vimeoEmbedUrl(video.videoUrl)
                    : video.videoUrl;

              return (
                <Card key={video.id}>
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{video.source}</Badge>
                      {video.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {video.source === "UPLOADED" ? (
                      <video controls className="aspect-video w-full rounded-lg border border-border">
                        <source src={video.videoUrl} />
                      </video>
                    ) : (
                      <iframe
                        title={video.title}
                        src={embedUrl}
                        className="aspect-video w-full rounded-lg border border-border"
                        allowFullScreen
                      />
                    )}
                    <p className="text-sm text-muted-foreground">{video.caption}</p>
                    <Link href={`/media/videos/${video.slug}`} className="text-sm text-primary hover:underline">
                      Open detail
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Documents & Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((document) => (
              <Card key={document.id}>
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-medium">{document.title}</p>
                    <p className="text-sm text-muted-foreground">{document.docType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={document.fileUrl}
                      target="_blank"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <FileText className="mr-1 size-4" />
                      Preview
                    </Link>
                    <Link
                      href={`/media/documents/${document.slug}`}
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="mr-1 size-4" />
                      Detail
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
````

## `src/app/media/photos/[slug]/page.tsx`

````tsx
import type { Metadata } from "next";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ViewTracker } from "@/components/content/view-tracker";
import { getPhotoBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug, true);
  if (!photo) return {};
  return {
    title: photo.title,
    description: photo.caption || photo.title
  };
}

export default async function PhotoDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const photo = await getPhotoBySlug(slug, draft.isEnabled);

  if (!photo) notFound();

  return (
    <section className="container py-12">
      <ViewTracker entity="photo" slug={photo.slug} />
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{photo.title}</h1>
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          width={1200}
          height={900}
          className="w-full rounded-lg border border-border object-cover"
        />
        {photo.caption ? <p className="text-muted-foreground">{photo.caption}</p> : null}
        <div className="flex flex-wrap gap-2">
          {photo.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
````

## `src/app/media/videos/[slug]/page.tsx`

````tsx
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ViewTracker } from "@/components/content/view-tracker";
import { getVideoBySlug } from "@/lib/public-data";
import { vimeoEmbedUrl, youtubeEmbedUrl } from "@/lib/video";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug, true);
  if (!video) return {};
  return {
    title: video.title,
    description: video.caption || video.title
  };
}

export default async function VideoDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const video = await getVideoBySlug(slug, draft.isEnabled);
  if (!video) notFound();

  const embedUrl =
    video.source === "YOUTUBE"
      ? youtubeEmbedUrl(video.videoUrl)
      : video.source === "VIMEO"
        ? vimeoEmbedUrl(video.videoUrl)
        : video.videoUrl;

  return (
    <section className="container py-12">
      <ViewTracker entity="video" slug={video.slug} />
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{video.title}</h1>
        {video.source === "UPLOADED" ? (
          <video controls className="aspect-video w-full rounded-lg border border-border">
            <source src={video.videoUrl} />
          </video>
        ) : (
          <iframe
            title={video.title}
            src={embedUrl}
            className="aspect-video w-full rounded-lg border border-border"
            allowFullScreen
          />
        )}
        {video.caption ? <p className="text-muted-foreground">{video.caption}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{video.source}</Badge>
          {video.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
````

## `src/app/not-found.tsx`

````tsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="container py-20 text-center">
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 inline-block text-primary hover:underline">
        Go back home
      </Link>
    </section>
  );
}
````

## `src/app/page.tsx`

````tsx
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCard } from "@/components/cards/project-card";
import { BlogCard } from "@/components/cards/blog-card";
import { IdeaCard } from "@/components/cards/idea-card";
import {
  getFeaturedProjects,
  getSiteResume,
  listBlogPosts,
  listIdeas
} from "@/lib/public-data";

export default async function HomePage() {
  const [resume, projects, blog, ideas] = await Promise.all([
    getSiteResume(),
    getFeaturedProjects(3),
    listBlogPosts({ page: 1, pageSize: 3 }),
    listIdeas({ page: 1, pageSize: 3 })
  ]);

  return (
    <>
      <section className="container py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-border bg-white/60 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
              BE Computer Engineering Student
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                {resume?.fullName || "Bigyan Sanjyal"}
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                {resume?.headline ||
                  "I design and build full-stack products that are fast, useful, and easy to maintain."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="https://github.com/bigyan-svg" target="_blank" className={buttonVariants({ variant: "outline" })}>
                <Github className="mr-2 size-4" />
                GitHub
              </Link>
              <Link href="https://linkedin.com/in/bigyan-svg" target="_blank" className={buttonVariants({ variant: "outline" })}>
                <Linkedin className="mr-2 size-4" />
                LinkedIn
              </Link>
              <Link href="mailto:bigyan@example.com" className={buttonVariants({ variant: "outline" })}>
                <Mail className="mr-2 size-4" />
                Email
              </Link>
              <Link href={resume?.resumePdfUrl || "/resume"} className={buttonVariants({ variant: "default" })}>
                <Download className="mr-2 size-4" />
                Download Resume
              </Link>
            </div>
          </div>
          <Card className="border-primary/20 bg-gradient-to-br from-white via-white to-accent/40">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Quick Snapshot</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold">{projects.length}</p>
                  <p className="text-xs text-muted-foreground">Featured Projects</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{blog.items.length}</p>
                  <p className="text-xs text-muted-foreground">Recent Blog Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{resume?.skills.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Core Skills</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{ideas.items.length}</p>
                  <p className="text-xs text-muted-foreground">Latest Ideas</p>
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center text-sm font-medium text-primary">
                Learn more about me <ArrowRight className="ml-1 size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured Projects</h2>
          <Link href="/projects" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Latest Blog Posts</h2>
          <Link href="/blog" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {blog.items.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Ideas & Notes</h2>
          <Link href="/ideas" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {ideas.items.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>
    </>
  );
}
````

## `src/app/projects/[slug]/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { RenderHtml } from "@/components/content/render-html";
import { ViewTracker } from "@/components/content/view-tracker";
import { getProjectBySlug } from "@/lib/public-data";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, true);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : []
    }
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const draft = await draftMode();
  const project = await getProjectBySlug(slug, draft.isEnabled);

  if (!project) {
    notFound();
  }

  return (
    <section className="container py-12">
      <ViewTracker entity="project" slug={project.slug} />
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{project.projectType}</Badge>
            <span className="text-xs text-muted-foreground">{project.views} views</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{project.title}</h1>
          <p className="text-muted-foreground">{project.summary}</p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {project.liveUrl ? (
              <Link href={project.liveUrl} target="_blank" className="text-primary hover:underline">
                Live Demo
              </Link>
            ) : null}
            {project.repoUrl ? (
              <Link href={project.repoUrl} target="_blank" className="text-primary hover:underline">
                Repository
              </Link>
            ) : null}
          </div>
        </div>

        <RenderHtml html={project.content} />
      </div>
    </section>
  );
}
````

## `src/app/projects/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/publish";
import { listProjects } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { PaginationLinks } from "@/components/common/pagination-links";
import { ProjectCard } from "@/components/cards/project-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Projects"
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const rawTech = typeof params.tech === "string" ? params.tech : "";
  const rawType = typeof params.type === "string" ? params.type : "";
  const tech = rawTech === "all" ? "" : rawTech;
  const type = rawType === "all" ? "" : rawType;
  const page = Number(typeof params.page === "string" ? params.page : "1");

  const [result, types, stacks] = await Promise.all([
    listProjects({ page, pageSize: 9, q: q || undefined, tech: tech || undefined, type: type || undefined }),
    prisma.project.findMany({
      where: publishedFilter(),
      distinct: ["projectType"],
      select: { projectType: true },
      orderBy: { projectType: "asc" }
    }),
    prisma.project.findMany({
      where: publishedFilter(),
      select: { techStack: true }
    })
  ]);

  const techOptions = Array.from(
    new Set(stacks.flatMap((item) => item.techStack).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (tech) query.set("tech", tech);
    if (type) query.set("type", type);
    query.set("page", String(targetPage));
    return `/projects?${query.toString()}`;
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Selected engineering projects with architecture notes and implementation details."
      />
      <section className="container pb-16">
        <form className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4">
          <Input defaultValue={q} name="q" placeholder="Search projects..." />
          <Select
            name="type"
            defaultValue={type || "all"}
            options={[
              { label: "All Types", value: "all" },
              ...types.map((item) => ({
                label: item.projectType,
                value: item.projectType
              }))
            ]}
          />
          <Select
            name="tech"
            defaultValue={tech || "all"}
            options={[
              { label: "All Tech", value: "all" },
              ...techOptions.map((item) => ({
                label: item,
                value: item
              }))
            ]}
          />
          <div className="flex gap-2">
            <Button type="submit" className="w-full">
              Apply
            </Button>
            <Link href="/projects" className="inline-flex h-10 items-center rounded-md border border-input px-4 text-sm">
              Reset
            </Link>
          </div>
        </form>

        <div className="grid gap-6 lg:grid-cols-3">
          {result.items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <PaginationLinks pagination={result.pagination} buildHref={buildHref} />
      </section>
    </>
  );
}
````

## `src/app/resources/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { listMedia } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Resources"
};

export default async function ResourcesPage() {
  const { documents } = await listMedia({});

  return (
    <>
      <PageHeader
        title="Resources"
        description="Download resume, certificates, reports, and reference documents."
      />
      <section className="container pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{document.title}</p>
                  <p className="text-sm text-muted-foreground">{document.docType}</p>
                </div>
                <Link
                  href={document.fileUrl}
                  target="_blank"
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <FileText className="mr-1 size-4" />
                  Open
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
````

## `src/app/resume/page.tsx`

````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { getSiteResume, getTimeline } from "@/lib/public-data";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Resume"
};

export default async function ResumePage() {
  const [resume, timeline] = await Promise.all([getSiteResume(), getTimeline()]);

  return (
    <>
      <PageHeader
        title="Resume"
        description="Structured resume data fetched from the database, plus downloadable PDF."
      />
      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>{resume?.fullName || "Bigyan Sanjyal"}</CardTitle>
              <p className="text-sm text-muted-foreground">{resume?.headline}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-7 text-muted-foreground">{resume?.summary}</p>

              <div className="space-y-3">
                <h3 className="font-medium">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(resume?.skills || []).map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Timeline</h3>
                <div className="space-y-3">
                  {timeline.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{item.title}</p>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6 text-sm">
              <p>
                <strong>Email:</strong> {resume?.email}
              </p>
              <p>
                <strong>Phone:</strong> {resume?.phone}
              </p>
              <p>
                <strong>Location:</strong> {resume?.location}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                {resume?.website ? (
                  <Link href={resume.website} target="_blank" className="text-primary hover:underline">
                    {resume.website}
                  </Link>
                ) : (
                  "-"
                )}
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                {resume?.github ? (
                  <Link href={resume.github} target="_blank" className="text-primary hover:underline">
                    Profile
                  </Link>
                ) : (
                  "-"
                )}
              </p>
              {resume?.resumePdfUrl ? (
                <Link href={resume.resumePdfUrl} className={buttonVariants({ variant: "default" })} target="_blank">
                  <Download className="mr-2 size-4" />
                  Download PDF
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
````

## `src/app/robots.ts`

````ts
import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin"]
      }
    ],
    sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`
  };
}
````

## `src/app/sitemap.ts`

````ts
import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/publish";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const [projects, posts, ideas, photos, videos, docs] = await Promise.all([
    prisma.project.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.idea.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.mediaPhoto.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.mediaVideo.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } }),
    prisma.document.findMany({ where: publishedFilter(), select: { slug: true, updatedAt: true } })
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/skills",
    "/projects",
    "/experience",
    "/blog",
    "/ideas",
    "/media",
    "/resources",
    "/resume",
    "/contact"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));

  const dynamicPages: MetadataRoute.Sitemap = [
    ...projects.map((item) => ({
      url: `${baseUrl}/projects/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...posts.map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...ideas.map((item) => ({
      url: `${baseUrl}/ideas/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...photos.map((item) => ({
      url: `${baseUrl}/media/photos/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...videos.map((item) => ({
      url: `${baseUrl}/media/videos/${item.slug}`,
      lastModified: item.updatedAt
    })),
    ...docs.map((item) => ({
      url: `${baseUrl}/media/documents/${item.slug}`,
      lastModified: item.updatedAt
    }))
  ];

  return [...staticPages, ...dynamicPages];
}
````

## `src/app/skills/page.tsx`

````tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSkills } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Skills"
};

export default async function SkillsPage() {
  const skills = await getSkills();
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Skills"
        description="Core tools and technologies I use to build full-stack products."
      />
      <section className="container pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
````

## `src/components/admin/admin-sidebar.tsx`

````tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  FileText,
  FolderOpen,
  GalleryVerticalEnd,
  Lightbulb,
  LogOut,
  MessageSquare,
  Newspaper,
  Sparkles,
  Upload,
  UserRound
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCsrfToken } from "@/lib/client-api";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/blog-posts", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/admin/photos", label: "Photos", icon: GalleryVerticalEnd },
  { href: "/admin/videos", label: "Videos", icon: FolderOpen },
  { href: "/admin/uploads", label: "Upload Manager", icon: Upload },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/timeline", label: "Timeline", icon: UserRound },
  { href: "/admin/resume", label: "Resume", icon: UserRound },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
        credentials: "include"
      });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    }
  };

  return (
    <aside className="w-full border-r border-border bg-card lg:w-64">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-border px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">CMS</p>
          <h2 className="text-lg font-semibold">bigyan-svg admin</h2>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
````

## `src/components/admin/analytics-panel.tsx`

````tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalyticsData = {
  totals: {
    projects: number;
    blogs: number;
    ideas: number;
    photos: number;
    videos: number;
    documents: number;
    messages: number;
    unreadMessages: number;
  };
  views: {
    projects: number;
    blogs: number;
    ideas: number;
    total: number;
  };
};

export function AnalyticsPanel() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin/analytics", {
          credentials: "include"
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Failed to load analytics");
        setData(json.data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading analytics...</p>;
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">No analytics available.</p>;
  }

  const stats = [
    { label: "Projects", value: data.totals.projects },
    { label: "Blog Posts", value: data.totals.blogs },
    { label: "Ideas", value: data.totals.ideas },
    { label: "Photos", value: data.totals.photos },
    { label: "Videos", value: data.totals.videos },
    { label: "Documents", value: data.totals.documents },
    { label: "Messages", value: data.totals.messages },
    { label: "Unread Messages", value: data.totals.unreadMessages },
    { label: "Project Views", value: data.views.projects },
    { label: "Blog Views", value: data.views.blogs },
    { label: "Idea Views", value: data.views.ideas },
    { label: "Total Views", value: data.views.total }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stat.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
````

## `src/components/admin/entity-manager.tsx`

````tsx
"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import { toSlug } from "@/lib/utils";
import { getCsrfToken } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/forms/rich-text-editor";

type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "url"
  | "number"
  | "checkbox"
  | "select"
  | "datetime"
  | "tags";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  uploadType?: "image" | "pdf" | "video";
  helpText?: string;
};

type ColumnConfig = {
  key: string;
  label: string;
  render?: (item: Record<string, unknown>) => ReactNode;
};

type Pagination = {
  page: number;
  totalPages: number;
};

type ManagerProps = {
  entity: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  defaultValues?: Record<string, unknown>;
  previewPath?: (item: Record<string, unknown>) => string;
};

function normalizeForField(field: FieldConfig, value: unknown) {
  if (value === null || value === undefined) return field.type === "checkbox" ? false : "";
  if (field.type === "tags" && Array.isArray(value)) return value.join(", ");
  if (field.type === "datetime" && typeof value === "string") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  }
  return value;
}

function defaultValueForField(field: FieldConfig) {
  if (field.type === "checkbox") return false;
  if (field.type === "select") return field.options?.[0]?.value || "";
  return "";
}

export function EntityManager({
  entity,
  title,
  description,
  fields,
  columns,
  defaultValues,
  previewPath
}: ManagerProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, totalPages: 1 });
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const baseDefaults = useMemo(() => {
    const fieldDefaults = fields.reduce<Record<string, unknown>>((acc, field) => {
      acc[field.name] = defaultValueForField(field);
      return acc;
    }, {});
    return {
      ...fieldDefaults,
      ...(defaultValues || {})
    };
  }, [defaultValues, fields]);

  useEffect(() => {
    setFormData(baseDefaults);
  }, [baseDefaults]);

  const load = async () => {
    setLoading(true);
    try {
      const search = new URLSearchParams({
        page: String(page),
        pageSize: "20",
        ...(query ? { q: query } : {})
      });
      const response = await fetch(`/api/admin/${entity}?${search.toString()}`, {
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to fetch");

      setItems(json.data.items);
      setPagination({
        page: json.data.pagination.page,
        totalPages: json.data.pagination.totalPages
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, page, query]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(baseDefaults);
  };

  const handleAutoSlug = () => {
    const titleValue = String(formData.title || "").trim();
    if (!titleValue) return;
    setFormData((prev) => ({
      ...prev,
      slug: toSlug(titleValue)
    }));
  };

  const onEdit = (item: Record<string, unknown>) => {
    const next: Record<string, unknown> = {};
    fields.forEach((field) => {
      next[field.name] = normalizeForField(field, item[field.name]);
    });
    setEditingId(String(item.id));
    setFormData(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/admin/${entity}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "x-csrf-token": csrfToken
        }
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Delete failed");
      toast.success("Deleted successfully");
      await load();
      if (editingId === id) resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const csrfToken = await getCsrfToken();
      const endpoint = editingId ? `/api/admin/${entity}/${editingId}` : `/api/admin/${entity}`;
      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Save failed");
      toast.success(editingId ? "Updated successfully" : "Created successfully");
      resetForm();
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadForField = async (field: FieldConfig, file?: File | null) => {
    if (!file || !field.uploadType) return;
    try {
      const csrfToken = await getCsrfToken();
      const payload = new FormData();
      payload.append("file", file);
      payload.append("type", field.uploadType);
      payload.append("folder", entity);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
        body: payload,
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        [field.name]: json.data.url
      }));
      toast.success("Upload successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const openPreview = async () => {
    if (!previewPath) return;
    try {
      const path = previewPath(formData);
      if (!path) return;
      const response = await fetch(`/api/admin/preview-link?slug=${encodeURIComponent(path)}`, {
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to generate preview");
      window.open(json.data.previewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Preview failed");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? `Edit ${title}` : `Create ${title}`}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.type === "richtext" || field.type === "textarea" ? "md:col-span-2 space-y-2" : "space-y-2"}>
                  <Label htmlFor={field.name}>
                    {field.label} {field.required ? "*" : ""}
                  </Label>

                  {field.type === "text" || field.type === "url" || field.type === "number" ? (
                    <Input
                      id={field.name}
                      type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                      value={String(formData[field.name] ?? "")}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "datetime" ? (
                    <Input
                      id={field.name}
                      type="datetime-local"
                      value={String(formData[field.name] ?? "")}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      value={String(formData[field.name] ?? "")}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "richtext" ? (
                    <RichTextEditor
                      value={String(formData[field.name] ?? "")}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "select" ? (
                    <Select
                      id={field.name}
                      value={String(formData[field.name] ?? "")}
                      options={field.options || []}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "checkbox" ? (
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(formData[field.name])}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: event.target.checked
                          }))
                        }
                      />
                      Enabled
                    </label>
                  ) : null}

                  {field.type === "tags" ? (
                    <Input
                      id={field.name}
                      value={String(formData[field.name] ?? "")}
                      placeholder={field.placeholder || "comma, separated, tags"}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.uploadType ? (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept={
                          field.uploadType === "image"
                            ? ".jpg,.jpeg,.png,.webp"
                            : field.uploadType === "pdf"
                              ? ".pdf"
                              : ".mp4,.webm,.mov"
                        }
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          void uploadForField(field, file);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload and auto-fill this URL field.
                      </p>
                    </div>
                  ) : null}

                  {field.helpText ? <p className="text-xs text-muted-foreground">{field.helpText}</p> : null}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <RefreshCw className="mr-2 size-4" />
                Reset
              </Button>
              {"title" in formData && "slug" in formData ? (
                <Button type="button" variant="outline" onClick={handleAutoSlug}>
                  Generate Slug
                </Button>
              ) : null}
              {previewPath && formData.slug ? (
                <Button type="button" variant="outline" onClick={openPreview}>
                  Preview Draft
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title} Table</span>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search..."
                value={inputQuery}
                onChange={(event) => setInputQuery(event.target.value)}
                className="w-56"
              />
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => {
                  setPage(1);
                  setQuery(inputQuery.trim());
                }}
              >
                Search
              </Button>
              <Button size="sm" type="button" variant="outline" onClick={resetForm}>
                <PlusCircle className="mr-1 size-4" />
                New
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={String(item.id)}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render
                            ? column.render(item)
                            : Array.isArray(item[column.key])
                              ? (item[column.key] as unknown[]).join(", ")
                              : typeof item[column.key] === "boolean"
                                ? item[column.key]
                                  ? "Yes"
                                  : "No"
                                : typeof item[column.key] === "string" && column.key === "status"
                                  ? (
                                    <Badge
                                      variant={
                                        item[column.key] === "PUBLISHED"
                                          ? "default"
                                          : item[column.key] === "SCHEDULED"
                                            ? "secondary"
                                            : "outline"
                                      }
                                    >
                                      {String(item[column.key])}
                                    </Badge>
                                  )
                                  : String(item[column.key] ?? "-")}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                            <Pencil className="mr-1 size-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === item.id}
                            onClick={() => onDelete(String(item.id))}
                          >
                            <Trash2 className="mr-1 size-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} / {pagination.totalPages}
                </p>
                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export type { FieldConfig, ColumnConfig };
````

## `src/components/admin/login-form.tsx`

````tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCsrfToken } from "@/lib/client-api";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/admin";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        credentials: "include",
        body: JSON.stringify({
          email: String(formData.get("email") || ""),
          password: String(formData.get("password") || ""),
          csrfToken
        })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Invalid credentials");

      toast.success("Signed in");
      router.replace(next);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
````

## `src/components/admin/messages-inbox.tsx`

````tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Mail, Trash2 } from "lucide-react";
import { getCsrfToken } from "@/lib/client-api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  replied: boolean;
  createdAt: string;
};

export function MessagesInbox() {
  const [items, setItems] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(query ? { q: query } : {});
      const response = await fetch(`/api/admin/messages?${params.toString()}`, {
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to load messages");
      setItems(json.data.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const updateMessage = async (id: string, payload: Partial<Message>) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Update failed");
      toast.success("Message updated");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken
        },
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Delete failed");
      toast.success("Message deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contact Inbox</span>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search messages..."
              className="w-64"
              value={inputQuery}
              onChange={(event) => setInputQuery(event.target.value)}
            />
            <Button size="sm" variant="outline" onClick={() => setQuery(inputQuery.trim())}>
              Search
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-xs text-muted-foreground">{message.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{message.subject}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{message.message}</p>
                  </TableCell>
                  <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={message.isRead ? "secondary" : "outline"}>
                        {message.isRead ? "Read" : "Unread"}
                      </Badge>
                      <Badge variant={message.replied ? "default" : "outline"}>
                        {message.replied ? "Replied" : "Not Replied"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateMessage(message.id, {
                            isRead: !message.isRead
                          })
                        }
                      >
                        <Check className="mr-1 size-4" />
                        Mark {message.isRead ? "Unread" : "Read"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMessage(message.id, { replied: !message.replied })}
                      >
                        <Mail className="mr-1 size-4" />
                        Toggle Replied
                      </Button>
                      <Link
                        href={`mailto:${message.email}?subject=Re:${encodeURIComponent(message.subject)}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Reply Email
                      </Link>
                      <Button size="sm" variant="destructive" onClick={() => deleteMessage(message.id)}>
                        <Trash2 className="mr-1 size-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
````

## `src/components/admin/upload-manager.tsx`

````tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { getCsrfToken } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function UploadManager() {
  const [type, setType] = useState<"image" | "pdf" | "video">("image");
  const [folder, setFolder] = useState("general");
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    if (!file) {
      toast.error("Select a file first");
      return;
    }

    setUploading(true);
    try {
      const csrfToken = await getCsrfToken();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("folder", folder || "general");

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken
        },
        body: formData,
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Upload failed");
      setResultUrl(json.data.url);
      toast.success("Uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Upload Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onChange={(event) => setType(event.target.value as "image" | "pdf" | "video")}
              options={[
                { label: "Image", value: "image" },
                { label: "PDF", value: "pdf" },
                { label: "Video", value: "video" }
              ]}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Folder</Label>
            <Input value={folder} onChange={(event) => setFolder(event.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>File</Label>
          <Input
            type="file"
            accept={type === "image" ? ".jpg,.jpeg,.png,.webp" : type === "pdf" ? ".pdf" : ".mp4,.webm,.mov"}
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </div>
        <Button onClick={upload} disabled={uploading}>
          <Upload className="mr-2 size-4" />
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
        {resultUrl ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
            <p className="font-medium">Uploaded URL</p>
            <p className="break-all text-muted-foreground">{resultUrl}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
````

## `src/components/cards/blog-card.tsx`

````tsx
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BlogCardProps = {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    category: string;
    tags: string[];
    publishAt: Date | null;
  };
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden">
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={900}
          height={520}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          {post.publishAt ? (
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishAt).toLocaleDateString()}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
        <Link className="text-sm font-medium text-primary hover:underline" href={`/blog/${post.slug}`}>
          Read post â†’
        </Link>
      </CardContent>
    </Card>
  );
}
````

## `src/components/cards/idea-card.tsx`

````tsx
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type IdeaCardProps = {
  idea: {
    title: string;
    slug: string;
    content: string;
    tags: string[];
    publishAt: Date | null;
  };
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const textContent = idea.content.replace(/<[^>]+>/g, "").slice(0, 160);
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{idea.title}</CardTitle>
        {idea.publishAt ? (
          <span className="text-xs text-muted-foreground">
            {new Date(idea.publishAt).toLocaleDateString()}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{textContent}...</p>
        <div className="flex flex-wrap gap-2">
          {idea.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
        <Link className="text-sm font-medium text-primary hover:underline" href={`/ideas/${idea.slug}`}>
          Read idea â†’
        </Link>
      </CardContent>
    </Card>
  );
}
````

## `src/components/cards/project-card.tsx`

````tsx
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectCardProps = {
  project: {
    title: string;
    slug: string;
    summary: string;
    coverImage: string | null;
    techStack: string[];
    projectType: string;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt={project.title}
          width={900}
          height={520}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge variant="secondary">{project.projectType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{project.summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
        <Link className="text-sm font-medium text-primary hover:underline" href={`/projects/${project.slug}`}>
          Read project â†’
        </Link>
      </CardContent>
    </Card>
  );
}
````

## `src/components/common/page-header.tsx`

````tsx
import { cn } from "@/lib/utils";

export function PageHeader(props: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={cn("container py-12 md:py-16", props.className)}>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{props.title}</h1>
      {props.description ? (
        <p className="mt-3 max-w-3xl text-muted-foreground">{props.description}</p>
      ) : null}
    </section>
  );
}
````

## `src/components/common/pagination-links.tsx`

````tsx
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

type Pagination = {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export function PaginationLinks(props: {
  pagination: Pagination;
  buildHref: (page: number) => string;
}) {
  const { pagination, buildHref } = props;
  return (
    <div className="mt-10 flex items-center justify-between">
      {pagination.hasPrev ? (
        <Link className={buttonVariants({ variant: "outline" })} href={buildHref(pagination.page - 1)}>
          Previous
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Previous
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </p>
      {pagination.hasNext ? (
        <Link className={buttonVariants({ variant: "outline" })} href={buildHref(pagination.page + 1)}>
          Next
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Next
        </Button>
      )}
    </div>
  );
}
````

## `src/components/content/code-highlight.tsx`

````tsx
"use client";

import { useEffect } from "react";
import hljs from "highlight.js";

export function CodeHighlight() {
  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, []);

  return null;
}
````

## `src/components/content/render-html.tsx`

````tsx
import { cn } from "@/lib/utils";

export function RenderHtml({ html, className }: { html: string; className?: string }) {
  return (
    <article
      className={cn("prose-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
````

## `src/components/content/tag-list.tsx`

````tsx
import { Badge } from "@/components/ui/badge";

export function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
````

## `src/components/content/view-tracker.tsx`

````tsx
"use client";

import { useEffect } from "react";

type ViewEntity = "project" | "blog" | "idea" | "photo" | "video";

export function ViewTracker({ entity, slug }: { entity: ViewEntity; slug: string }) {
  useEffect(() => {
    void fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, slug })
    });
  }, [entity, slug]);

  return null;
}
````

## `src/components/forms/contact-form.tsx`

````tsx
"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function randomNum() {
  return Math.floor(Math.random() * 10) + 1;
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const captcha = useMemo(() => ({ a: randomNum(), b: randomNum() }), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    try {
      const payload = {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        subject: String(formData.get("subject") || ""),
        message: String(formData.get("message") || ""),
        honeypot: String(formData.get("honeypot") || ""),
        captchaA: captcha.a,
        captchaB: captcha.b,
        captchaAnswer: Number(formData.get("captchaAnswer") || 0)
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully.");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can I help?" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write your message..."
          className="min-h-44"
          required
        />
      </div>
      <div className="hidden">
        <Label htmlFor="honeypot">Company</Label>
        <Input id="honeypot" name="honeypot" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="captchaAnswer">
          CAPTCHA: {captcha.a} + {captcha.b} = ?
        </Label>
        <Input id="captchaAnswer" name="captchaAnswer" type="number" required />
      </div>
      <Button disabled={loading} type="submit">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
````

## `src/components/forms/rich-text-editor.tsx`

````tsx
"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";

const lowlight = createLowlight();

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true
      }),
      Image,
      CodeBlockLowlight.configure({
        lowlight
      })
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-56 rounded-b-md border border-border border-t-0 bg-background px-3 py-3 text-sm focus:outline-none"
      }
    }
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const addLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", prev || "https://");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-t-md border border-border bg-muted/40 p-2">
        <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code Block
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={addLink}>
          Link
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={addImage}>
          Image
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
````

## `src/components/layout/app-shell.tsx`

````tsx
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main>{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
````

## `src/components/layout/site-footer.tsx`

````tsx
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Â© {new Date().getFullYear()} Bigyan Sanjyal. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="https://github.com/bigyan-svg" target="_blank">
            GitHub
          </Link>
          <Link href="https://linkedin.com/in/bigyan-svg" target="_blank">
            LinkedIn
          </Link>
          <Link href="mailto:bigyan@example.com">Email</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/resources">Resources</Link>
        </div>
      </div>
    </footer>
  );
}
````

## `src/components/layout/site-header.tsx`

````tsx
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/ideas", label: "Ideas" },
  { href: "/media", label: "Media" },
  { href: "/resources", label: "Resources" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          bigyan-svg
        </Link>
        <nav className="hidden gap-5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>
      <div
        className={cn(
          "container overflow-hidden transition-all md:hidden",
          open ? "max-h-[420px] py-4" : "max-h-0"
        )}
      >
        <div className="grid gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
````

## `src/components/media/photo-lightbox.tsx`

````tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type PhotoItem = {
  id: string;
  title: string;
  imageUrl: string;
};

export function PhotoLightbox({ photos }: { photos: PhotoItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            className="group relative overflow-hidden rounded-lg border border-border"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={640}
              height={480}
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 text-left text-xs text-white">
              {photo.title}
            </span>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity",
          activeIndex === null ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        {activeIndex !== null ? (
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <button
              className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white"
              onClick={() => setActiveIndex(null)}
            >
              <X className="size-5" />
            </button>
            <Image
              src={photos[activeIndex].imageUrl}
              alt={photos[activeIndex].title}
              width={1400}
              height={1000}
              className="max-h-[90vh] w-full rounded-lg object-contain"
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
````

## `src/components/providers.tsx`

````tsx
"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
````

## `src/components/ui/badge.tsx`

````tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
````

## `src/components/ui/button.tsx`

````tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
````

## `src/components/ui/card.tsx`

````tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";
````

## `src/components/ui/input.tsx`

````tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
````

## `src/components/ui/label.tsx`

````tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
````

## `src/components/ui/select.tsx`

````tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface SimpleSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export function Select({ options, className, ...props }: SimpleSelectProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
````

## `src/components/ui/table.tsx`

````tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle", className)} {...props} />
));
TableCell.displayName = "TableCell";
````

## `src/components/ui/textarea.tsx`

````tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
````

## `src/lib/auth.ts`

````ts
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const ACCESS_COOKIE_NAME = "access_token";
export const REFRESH_COOKIE_NAME = "refresh_token";
export const CSRF_COOKIE_NAME = "csrf_token";

type AccessTokenPayload = JWTPayload & {
  role: "ADMIN" | "EDITOR";
  email: string;
};

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

export async function createAccessToken(payload: {
  userId: string;
  role: "ADMIN" | "EDITOR";
  email: string;
}) {
  return new SignJWT({ role: payload.role, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${env.ACCESS_TOKEN_EXPIRES_MINUTES}m`)
    .sign(accessSecret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessSecret);
  const parsedPayload = payload as AccessTokenPayload;
  if (!parsedPayload.sub || !parsedPayload.role || !parsedPayload.email) {
    throw new Error("Invalid token payload");
  }
  return {
    userId: parsedPayload.sub,
    role: parsedPayload.role,
    email: parsedPayload.email
  };
}

function buildRefreshTokenValue(tokenId: string, secret: string) {
  return `${tokenId}.${secret}`;
}

function parseRefreshTokenValue(raw: string) {
  const [id, secret] = raw.split(".");
  if (!id || !secret) {
    throw new Error("Invalid refresh token format");
  }
  return { id, secret };
}

export async function issueRefreshToken(userId: string) {
  const tokenId = crypto.randomUUID();
  const secret = crypto.randomBytes(48).toString("hex");
  const tokenHash = await bcrypt.hash(secret, 12);
  const expiresAt = new Date(
    Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      tokenHash,
      userId,
      expiresAt
    }
  });

  return {
    value: buildRefreshTokenValue(tokenId, secret),
    expiresAt
  };
}

export async function rotateRefreshToken(rawToken: string) {
  const { id, secret } = parseRefreshTokenValue(rawToken);
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { id },
    include: { user: true }
  });

  if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
    throw new Error("Refresh token is invalid or expired");
  }

  const isMatch = await bcrypt.compare(secret, tokenRecord.tokenHash);
  if (!isMatch) {
    throw new Error("Refresh token mismatch");
  }

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { revokedAt: new Date() }
  });

  const nextRefreshToken = await issueRefreshToken(tokenRecord.userId);

  const accessToken = await createAccessToken({
    userId: tokenRecord.user.id,
    role: tokenRecord.user.role,
    email: tokenRecord.user.email
  });

  return {
    user: tokenRecord.user,
    accessToken,
    refreshToken: nextRefreshToken
  };
}

export async function revokeRefreshToken(rawToken: string) {
  try {
    const { id } = parseRefreshTokenValue(rawToken);
    await prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() }
    });
  } catch {
    return;
  }
}

export async function getCurrentUserFromCookies() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  if (!accessToken) return null;

  try {
    const payload = await verifyAccessToken(accessToken);
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdminUser() {
  const user = await getCurrentUserFromCookies();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

export async function setAuthCookies(args: {
  accessToken: string;
  refreshToken: { value: string; expiresAt: Date };
}) {
  const cookieStore = await cookies();
  const isProd = env.NODE_ENV === "production";

  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: args.accessToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: env.ACCESS_TOKEN_EXPIRES_MINUTES * 60
  });

  cookieStore.set({
    name: REFRESH_COOKIE_NAME,
    value: args.refreshToken.value,
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/api/auth",
    expires: args.refreshToken.expiresAt
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0
  });
  cookieStore.set({
    name: REFRESH_COOKIE_NAME,
    value: "",
    path: "/api/auth",
    maxAge: 0
  });
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function requireAdminApi(_request: NextRequest) {
  const user = await requireAdminUser();
  if (!user) {
    return { ok: false as const, response: unauthorizedResponse() };
  }
  return { ok: true as const, user };
}
````

## `src/lib/client-api.ts`

````ts
"use client";

let cachedCsrfToken: string | null = null;

export async function getCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;
  const response = await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "include"
  });
  const json = await response.json();
  cachedCsrfToken = json.data?.csrfToken as string;
  return cachedCsrfToken || "";
}

export async function apiFetch<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    credentials: "include"
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }
  return result.data as T;
}
````

## `src/lib/content-service.ts`

````ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContentEntity, contentSchemas } from "@/lib/validators/content";
import { getPagination } from "@/lib/utils";
import { sanitizeRichHtml } from "@/lib/sanitize";

function parseEntityData(entity: ContentEntity, input: unknown) {
  const schema = contentSchemas[entity];
  const parsed = schema.parse(input);

  if (entity === "projects" || entity === "blog-posts" || entity === "ideas") {
    return {
      ...parsed,
      content: sanitizeRichHtml((parsed as { content: string }).content)
    };
  }

  return parsed;
}

export async function listContentEntity(args: {
  entity: ContentEntity;
  page: number;
  pageSize: number;
  query?: string;
}) {
  const { entity, page, pageSize, query } = args;
  const offset = (page - 1) * pageSize;

  switch (entity) {
    case "projects": {
      const where: Prisma.ProjectWhereInput = query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { summary: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.project.count({ where }),
        prisma.project.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "blog-posts": {
      const where: Prisma.BlogPostWhereInput = query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.blogPost.count({ where }),
        prisma.blogPost.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "ideas": {
      const where: Prisma.IdeaWhereInput = query
        ? { OR: [{ title: { contains: query, mode: "insensitive" } }] }
        : {};
      const [total, items] = await Promise.all([
        prisma.idea.count({ where }),
        prisma.idea.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "photos": {
      const where: Prisma.MediaPhotoWhereInput = query
        ? { title: { contains: query, mode: "insensitive" } }
        : {};
      const [total, items] = await Promise.all([
        prisma.mediaPhoto.count({ where }),
        prisma.mediaPhoto.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "videos": {
      const where: Prisma.MediaVideoWhereInput = query
        ? { title: { contains: query, mode: "insensitive" } }
        : {};
      const [total, items] = await Promise.all([
        prisma.mediaVideo.count({ where }),
        prisma.mediaVideo.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "documents": {
      const where: Prisma.DocumentWhereInput = query
        ? { title: { contains: query, mode: "insensitive" } }
        : {};
      const [total, items] = await Promise.all([
        prisma.document.count({ where }),
        prisma.document.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "skills": {
      const where: Prisma.SkillWhereInput = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.skill.count({ where }),
        prisma.skill.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "timeline": {
      const where: Prisma.TimelineItemWhereInput = query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { organization: { contains: query, mode: "insensitive" } }
            ]
          }
        : {};
      const [total, items] = await Promise.all([
        prisma.timelineItem.count({ where }),
        prisma.timelineItem.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
          skip: offset,
          take: pageSize
        })
      ]);
      return { items, pagination: getPagination(total, page, pageSize) };
    }
    case "resume": {
      const item = await prisma.resume.findFirst();
      return {
        items: item ? [item] : [],
        pagination: getPagination(item ? 1 : 0, 1, 1)
      };
    }
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function createContentEntity(entity: ContentEntity, payload: unknown) {
  const data = parseEntityData(entity, payload);

  switch (entity) {
    case "projects":
      return prisma.project.create({ data });
    case "blog-posts":
      return prisma.blogPost.create({ data });
    case "ideas":
      return prisma.idea.create({ data });
    case "photos":
      return prisma.mediaPhoto.create({ data });
    case "videos":
      return prisma.mediaVideo.create({ data });
    case "documents":
      return prisma.document.create({ data });
    case "skills":
      return prisma.skill.create({ data });
    case "timeline":
      return prisma.timelineItem.create({ data });
    case "resume": {
      const existing = await prisma.resume.findFirst();
      if (existing) {
        return prisma.resume.update({ where: { id: existing.id }, data });
      }
      return prisma.resume.create({ data });
    }
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function getContentEntityById(entity: ContentEntity, id: string) {
  switch (entity) {
    case "projects":
      return prisma.project.findUnique({ where: { id } });
    case "blog-posts":
      return prisma.blogPost.findUnique({ where: { id } });
    case "ideas":
      return prisma.idea.findUnique({ where: { id } });
    case "photos":
      return prisma.mediaPhoto.findUnique({ where: { id } });
    case "videos":
      return prisma.mediaVideo.findUnique({ where: { id } });
    case "documents":
      return prisma.document.findUnique({ where: { id } });
    case "skills":
      return prisma.skill.findUnique({ where: { id } });
    case "timeline":
      return prisma.timelineItem.findUnique({ where: { id } });
    case "resume":
      return prisma.resume.findUnique({ where: { id } });
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function updateContentEntity(
  entity: ContentEntity,
  id: string,
  payload: unknown
) {
  const data = parseEntityData(entity, payload);

  switch (entity) {
    case "projects":
      return prisma.project.update({ where: { id }, data });
    case "blog-posts":
      return prisma.blogPost.update({ where: { id }, data });
    case "ideas":
      return prisma.idea.update({ where: { id }, data });
    case "photos":
      return prisma.mediaPhoto.update({ where: { id }, data });
    case "videos":
      return prisma.mediaVideo.update({ where: { id }, data });
    case "documents":
      return prisma.document.update({ where: { id }, data });
    case "skills":
      return prisma.skill.update({ where: { id }, data });
    case "timeline":
      return prisma.timelineItem.update({ where: { id }, data });
    case "resume":
      return prisma.resume.update({ where: { id }, data });
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export async function deleteContentEntity(entity: ContentEntity, id: string) {
  switch (entity) {
    case "projects":
      return prisma.project.delete({ where: { id } });
    case "blog-posts":
      return prisma.blogPost.delete({ where: { id } });
    case "ideas":
      return prisma.idea.delete({ where: { id } });
    case "photos":
      return prisma.mediaPhoto.delete({ where: { id } });
    case "videos":
      return prisma.mediaVideo.delete({ where: { id } });
    case "documents":
      return prisma.document.delete({ where: { id } });
    case "skills":
      return prisma.skill.delete({ where: { id } });
    case "timeline":
      return prisma.timelineItem.delete({ where: { id } });
    case "resume":
      return prisma.resume.delete({ where: { id } });
    default: {
      const exhaustive: never = entity;
      throw new Error(`Unsupported entity: ${exhaustive}`);
    }
  }
}

export function isSupportedEntity(value: string): value is ContentEntity {
  return Object.keys(contentSchemas).includes(value);
}
````

## `src/lib/csrf.ts`

````ts
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
````

## `src/lib/env.ts`

````ts
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
````

## `src/lib/http.ts`

````ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function apiError(
  error: unknown,
  fallbackMessage = "Something went wrong",
  status = 500
) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.flatten()
      },
      { status: 422 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ error: fallbackMessage }, { status });
}
````

## `src/lib/mail.ts`

````ts
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
````

## `src/lib/prisma.ts`

````ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
````

## `src/lib/public-data.ts`

````ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { publishedFilter } from "@/lib/publish";
import { getPagination } from "@/lib/utils";

type ListArgs = {
  page: number;
  pageSize: number;
};

export async function getSiteResume() {
  return prisma.resume.findFirst({
    orderBy: { updatedAt: "desc" }
  });
}

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }]
  });
}

export async function getTimeline() {
  return prisma.timelineItem.findMany({
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }]
  });
}

export async function getFeaturedProjects(limit = 3) {
  return prisma.project.findMany({
    where: {
      ...publishedFilter(),
      featured: true
    },
    orderBy: { publishAt: "desc" },
    take: limit
  });
}

export async function listProjects(args: ListArgs & {
  q?: string;
  tech?: string;
  type?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, tech, type, includeDraft } = args;
  const conditions: Prisma.ProjectWhereInput[] = [];
  if (!includeDraft) {
    conditions.push(publishedFilter());
  }
  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } }
      ]
    });
  }
  if (type) {
    conditions.push({ projectType: { equals: type, mode: "insensitive" } });
  }
  if (tech) {
    conditions.push({ techStack: { has: tech } });
  }

  const where: Prisma.ProjectWhereInput = conditions.length ? { AND: conditions } : {};

  const [total, items] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  return {
    items,
    pagination: getPagination(total, page, pageSize)
  };
}

export async function getProjectBySlug(slug: string, includeDraft = false) {
  return prisma.project.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function listBlogPosts(args: ListArgs & {
  q?: string;
  category?: string;
  tag?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, category, tag, includeDraft } = args;
  const conditions: Prisma.BlogPostWhereInput[] = [];
  if (!includeDraft) {
    conditions.push(publishedFilter());
  }
  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } }
      ]
    });
  }
  if (category) {
    conditions.push({ category: { equals: category, mode: "insensitive" } });
  }
  if (tag) {
    conditions.push({ tags: { has: tag } });
  }

  const where: Prisma.BlogPostWhereInput = conditions.length ? { AND: conditions } : {};

  const [total, items] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  const [categories, tags] = await Promise.all([
    prisma.blogPost.findMany({
      where: includeDraft ? {} : publishedFilter(),
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" }
    }),
    prisma.blogPost.findMany({
      where: includeDraft ? {} : publishedFilter(),
      select: { tags: true }
    })
  ]);

  const uniqueTags = Array.from(
    new Set(
      tags
        .flatMap((item) => item.tags)
        .map((t) => t.trim())
        .filter(Boolean)
    )
  ).sort();

  return {
    items,
    categories: categories.map((c) => c.category),
    tags: uniqueTags,
    pagination: getPagination(total, page, pageSize)
  };
}

export async function getBlogBySlug(slug: string, includeDraft = false) {
  return prisma.blogPost.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function listIdeas(args: ListArgs & {
  q?: string;
  tag?: string;
  includeDraft?: boolean;
}) {
  const { page, pageSize, q, tag, includeDraft } = args;
  const conditions: Prisma.IdeaWhereInput[] = [];
  if (!includeDraft) {
    conditions.push(publishedFilter());
  }
  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } }
      ]
    });
  }
  if (tag) {
    conditions.push({ tags: { has: tag } });
  }

  const where: Prisma.IdeaWhereInput = conditions.length ? { AND: conditions } : {};

  const [total, items, tags] = await Promise.all([
    prisma.idea.count({ where }),
    prisma.idea.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.idea.findMany({
      where: includeDraft ? {} : publishedFilter(),
      select: { tags: true }
    })
  ]);

  const uniqueTags = Array.from(
    new Set(
      tags
        .flatMap((item) => item.tags)
        .map((t) => t.trim())
        .filter(Boolean)
    )
  ).sort();

  return {
    items,
    tags: uniqueTags,
    pagination: getPagination(total, page, pageSize)
  };
}

export async function getIdeaBySlug(slug: string, includeDraft = false) {
  return prisma.idea.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function listMedia(args: { includeDraft?: boolean }) {
  const where = args.includeDraft ? {} : publishedFilter();
  const [photos, videos, documents] = await Promise.all([
    prisma.mediaPhoto.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }]
    }),
    prisma.mediaVideo.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }]
    }),
    prisma.document.findMany({
      where,
      orderBy: [{ publishAt: "desc" }, { createdAt: "desc" }]
    })
  ]);

  return { photos, videos, documents };
}

export async function getPhotoBySlug(slug: string, includeDraft = false) {
  return prisma.mediaPhoto.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function getVideoBySlug(slug: string, includeDraft = false) {
  return prisma.mediaVideo.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}

export async function getDocumentBySlug(slug: string, includeDraft = false) {
  return prisma.document.findFirst({
    where: includeDraft ? { slug } : { slug, ...publishedFilter() }
  });
}
````

## `src/lib/publish.ts`

````ts
import { PublishStatus } from "@prisma/client";

export function publishedFilter() {
  const now = new Date();
  return {
    OR: [
      {
        status: PublishStatus.PUBLISHED,
        OR: [{ publishAt: null }, { publishAt: { lte: now } }]
      },
      {
        status: PublishStatus.SCHEDULED,
        publishAt: { lte: now }
      }
    ]
  };
}

export function parsePublishAt(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}
````

## `src/lib/rate-limit.ts`

````ts
type Bucket = {
  count: number;
  resetAt: number;
};

const bucketStore = new Map<string, Bucket>();

export function rateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const bucket = bucketStore.get(params.key);

  if (!bucket || now > bucket.resetAt) {
    bucketStore.set(params.key, {
      count: 1,
      resetAt: now + params.windowMs
    });
    return {
      success: true,
      remaining: params.limit - 1,
      resetAt: now + params.windowMs
    };
  }

  if (bucket.count >= params.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: bucket.resetAt
    };
  }

  bucket.count += 1;
  bucketStore.set(params.key, bucket);
  return {
    success: true,
    remaining: params.limit - bucket.count,
    resetAt: bucket.resetAt
  };
}
````

## `src/lib/sanitize.ts`

````ts
import sanitizeHtml from "sanitize-html";

export function sanitizeRichHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "p",
      "a",
      "ul",
      "ol",
      "nl",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "strike",
      "code",
      "hr",
      "br",
      "div",
      "table",
      "thead",
      "caption",
      "tbody",
      "tr",
      "th",
      "td",
      "pre",
      "img"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"],
      "*": ["class"]
    },
    allowedSchemes: ["http", "https", "mailto", "data"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer"
      })
    }
  });
}
````

## `src/lib/storage.ts`

````ts
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
````

## `src/lib/utils.ts`

````ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function safeFileName(fileName: string) {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
  const base = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "file"}-${Date.now()}${ext ? `.${ext}` : ""}`;
}

export function getPagination(total: number, page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

export function parseList(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
````

## `src/lib/validators/auth.ts`

````ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  csrfToken: z.string().min(16)
});
````

## `src/lib/validators/contact.ts`

````ts
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
````

## `src/lib/validators/content.ts`

````ts
import { DocumentType, PublishStatus, TimelineType, VideoSource } from "@prisma/client";
import { z } from "zod";

const csvArray = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}, z.array(z.string()));

const urlOrPath = z
  .string()
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Must be a valid URL or local path"
  });

const optionalUrlOrPath = z
  .union([urlOrPath, z.literal(""), z.undefined(), z.null()])
  .transform((value) => (value ? value : null));

const statusSchema = z.nativeEnum(PublishStatus).default(PublishStatus.DRAFT);

const optionalDate = z
  .union([z.string(), z.date(), z.null(), z.undefined()])
  .transform((value) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  });

export const projectSchema = z.object({
  title: z.string().min(3).max(140),
  slug: z.string().min(3).max(160),
  summary: z.string().min(10).max(300),
  content: z.string().min(10),
  coverImage: optionalUrlOrPath,
  repoUrl: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  liveUrl: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  projectType: z.string().min(2).max(60),
  techStack: csvArray,
  featured: z.coerce.boolean().default(false),
  status: statusSchema,
  publishAt: optionalDate
});

export const blogSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(180),
  excerpt: z.string().min(10).max(300),
  content: z.string().min(20),
  coverImage: optionalUrlOrPath,
  category: z.string().min(2).max(60),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const ideaSchema = z.object({
  title: z.string().min(3).max(140),
  slug: z.string().min(3).max(180),
  content: z.string().min(10),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const photoSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160),
  imageUrl: urlOrPath,
  caption: z.string().max(500).optional().or(z.literal("")).transform((v) => v || null),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const videoSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160),
  source: z.nativeEnum(VideoSource),
  videoUrl: urlOrPath,
  thumbnailUrl: optionalUrlOrPath,
  caption: z.string().max(500).optional().or(z.literal("")).transform((v) => v || null),
  tags: csvArray,
  status: statusSchema,
  publishAt: optionalDate
});

export const documentSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160),
  fileUrl: urlOrPath,
  docType: z.nativeEnum(DocumentType),
  description: z.string().max(500).optional().or(z.literal("")).transform((v) => v || null),
  status: statusSchema,
  publishAt: optionalDate
});

export const skillSchema = z.object({
  name: z.string().min(2).max(60),
  category: z.string().min(2).max(60),
  level: z.coerce.number().int().min(1).max(100),
  icon: z.string().max(80).optional().or(z.literal("")).transform((v) => v || null),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const timelineSchema = z.object({
  type: z.nativeEnum(TimelineType),
  title: z.string().min(2).max(120),
  organization: z.string().min(2).max(120),
  location: z.string().max(120).optional().or(z.literal("")).transform((v) => v || null),
  startDate: z.coerce.date(),
  endDate: optionalDate,
  isCurrent: z.coerce.boolean().default(false),
  description: z.string().min(10),
  sortOrder: z.coerce.number().int().min(0).default(0)
});

export const resumeSchema = z.object({
  fullName: z.string().min(2).max(100),
  headline: z.string().min(5).max(180),
  summary: z.string().min(20),
  email: z.string().email(),
  phone: z.string().max(50).optional().or(z.literal("")).transform((v) => v || null),
  location: z.string().max(120).optional().or(z.literal("")).transform((v) => v || null),
  website: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  github: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  linkedin: z.string().url().optional().or(z.literal("")).transform((v) => v || null),
  resumePdfUrl: optionalUrlOrPath,
  skills: csvArray
});

export const contentSchemas = {
  projects: projectSchema,
  "blog-posts": blogSchema,
  ideas: ideaSchema,
  photos: photoSchema,
  videos: videoSchema,
  documents: documentSchema,
  skills: skillSchema,
  timeline: timelineSchema,
  resume: resumeSchema
};

export type ContentEntity = keyof typeof contentSchemas;
````

## `src/lib/video.ts`

````ts
export function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

export function vimeoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const id = parsed.pathname.split("/").filter(Boolean).pop();
    if (!id) return url;
    return `https://player.vimeo.com/video/${id}`;
  } catch {
    return url;
  }
}
````

## `src/lib/views.ts`

````ts
import { prisma } from "@/lib/prisma";

type ViewEntity = "project" | "blog" | "idea" | "photo" | "video";

export async function incrementViewCount(entity: ViewEntity, slug: string) {
  switch (entity) {
    case "project":
      await prisma.project.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "blog":
      await prisma.blogPost.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "idea":
      await prisma.idea.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "photo":
      await prisma.mediaPhoto.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    case "video":
      await prisma.mediaVideo.updateMany({
        where: { slug },
        data: { views: { increment: 1 } }
      });
      break;
    default:
      break;
  }
}
````

## `tailwind.config.ts`

````ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1240px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  },
  plugins: []
};

export default config;
````

## `tsconfig.json`

````json
{
  "compilerOptions": {
    "target": "ES2018",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

