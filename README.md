# Bigyan Portfolio CMS

Production-ready full-stack personal portfolio + CMS for **Bigyan Sanjyal** (`bigyan-svg`).

## Stack
- Next.js App Router + TypeScript
- TailwindCSS + reusable shadcn-style UI
- Prisma ORM + PostgreSQL
- JWT access token + refresh token rotation
- TipTap rich text editor
- Cloudinary (prod) + local uploads (dev fallback)
- SMTP notifications for contact form

## Architecture Decision
- Backend is implemented with **Next.js Route Handlers** (`src/app/api/**`) instead of a separate Express server.
- Reason: single deployment target, shared types/utilities, and simpler operations on Vercel.

## Features
- Public site: Home, About, Skills, Projects, Experience/Education, Contact
- Blog: categories, tags, search, pagination, code highlighting
- Ideas/Notes: mini-posts with tags, search, pagination
- Media: photo lightbox, video embeds/uploads, PDF resources
- Resume page: DB-driven profile + downloadable resume PDF
- Admin CMS: secure login + CRUD for all portfolio content types
- Draft / Published / Scheduled publishing workflow
- Upload manager: images, PDFs, videos
- Analytics: total items, views, messages
- Contact inbox with reply-by-email action
- SEO: metadata, `sitemap.xml`, `robots.txt`

## Security
- Admin route/API protection via middleware and server-side auth checks
- CSRF protection on auth and mutating endpoints
- Rate limiting on auth/contact/view endpoints
- Zod validation on API inputs
- Rich HTML sanitization for TipTap content
- File upload type/size validation

## Project Structure
```text
.
|-- .env.example
|-- .github/workflows
|   |-- ci.yml
|   `-- vercel-deploy.yml
|-- middleware.ts
|-- package.json
|-- prisma
|   |-- migrations
|   |-- schema.prisma
|   `-- seed.ts
`-- src
    |-- app
    |-- components
    `-- lib
```

## Setup (Windows PowerShell)
1. Copy env file:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Generate Prisma client:
   ```powershell
   npm run prisma:generate
   ```
4. Run migration:
   ```powershell
   npm run prisma:migrate
   ```
5. Seed data:
   ```powershell
   npm run db:seed
   ```
6. Start dev:
   ```powershell
   npm run dev
   ```

## Setup (Ubuntu)
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install and run:
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed
   npm run dev
   ```

## Commands
```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run db:seed
```

## Environment Variables
See `.env.example` for all values.

Core variables:
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CSRF_SECRET`
- `PREVIEW_SECRET`
- `SMTP_*`
- `CLOUDINARY_*`

## Deployment

### Important hosting note
This project is **full-stack** (uses API routes + PostgreSQL), so it should be deployed on **Vercel** (or another serverless/container platform), not GitHub Pages static hosting.

### Vercel deployment
1. Import this repo in Vercel.
2. Add env variables from `.env.example`.
3. Set production `NEXT_PUBLIC_APP_URL`.
4. Run migrations:
   ```bash
   npm run prisma:deploy
   ```
5. Seed once:
   ```bash
   npm run db:seed
   ```

### GitHub Actions workflows
This repo now includes:
- `CI` workflow: lint + typecheck on push/PR.
- `Deploy to Vercel` workflow: preview deploy for PR and production deploy for `main`.

Required GitHub secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Add them in:
`GitHub Repo -> Settings -> Secrets and variables -> Actions`.

## Customization Checklist
- [ ] Set your real app domain in `.env` and Vercel
- [ ] Update metadata base URL in `src/app/layout.tsx`
- [ ] Update admin seed password (`SEED_ADMIN_PASSWORD`)
- [ ] Add your real name, bio, social links in `/admin/resume`
- [ ] Add projects/blog/ideas/media from admin dashboard
- [ ] Configure SMTP for contact email notifications
- [ ] Configure Cloudinary for production media uploads
- [ ] Verify `/sitemap.xml` and `/robots.txt` after deploy
