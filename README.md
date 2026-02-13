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
├── .env.example
├── middleware.ts
├── package.json
├── prisma
│   ├── migrations
│   │   └── 202602130001_init
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.ts
└── src
    ├── app
    │   ├── admin
    │   ├── api
    │   ├── about
    │   ├── blog
    │   ├── contact
    │   ├── experience
    │   ├── ideas
    │   ├── media
    │   ├── projects
    │   ├── resume
    │   ├── skills
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── loading.tsx
    │   ├── not-found.tsx
    │   ├── page.tsx
    │   ├── robots.ts
    │   └── sitemap.ts
    ├── components
    │   ├── admin
    │   ├── cards
    │   ├── common
    │   ├── content
    │   ├── forms
    │   ├── layout
    │   ├── media
    │   └── ui
    └── lib
        ├── validators
        └── *.ts
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
