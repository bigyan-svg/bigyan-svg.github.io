import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import "@/app/globals.css";
import { profile } from "@/lib/data";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"]
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bigyan-svggithubio.vercel.app";
const normalizedSiteUrl = (rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`).replace(/\/$/, "");
const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION || "3LG2Vgavi6ESfvRFI89FGokQRQh0nY0R_6w7QADI3XE";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: normalizedSiteUrl,
  image: `${normalizedSiteUrl}/images/bigyan.jpeg`,
  jobTitle: profile.role,
  email: profile.email,
  sameAs: [profile.github, profile.linkedin]
};

export const metadata: Metadata = {
  metadataBase: new URL(normalizedSiteUrl),
  title: {
    default: "Bigyan Sanjyal | Full-Stack Portfolio",
    template: "%s | Bigyan Sanjyal"
  },
  description:
    "Bigyan Sanjyal official portfolio website. BE Computer Engineering student building full-stack products with premium UI and strong engineering.",
  keywords: [
    "Bigyan Sanjyal",
    "bigyan-svg",
    "Full-stack developer portfolio",
    "Computer engineering student",
    "Next.js portfolio"
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: normalizedSiteUrl,
    title: "Bigyan Sanjyal | Full-Stack Portfolio",
    description:
      "Official portfolio of Bigyan Sanjyal featuring projects, blogs, media, and admin-managed content.",
    siteName: "Bigyan Sanjyal Portfolio",
    images: [
      {
        url: `${normalizedSiteUrl}/images/bigyan.jpeg`,
        width: 800,
        height: 800,
        alt: "Bigyan Sanjyal"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bigyan Sanjyal | Full-Stack Portfolio",
    description: "Official portfolio of Bigyan Sanjyal.",
    images: [`${normalizedSiteUrl}/images/bigyan.jpeg`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  },
  verification: {
    google: googleVerification
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${spaceMono.variable}`}>
      <body className="font-[var(--font-sora)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
