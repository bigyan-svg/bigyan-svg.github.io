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
