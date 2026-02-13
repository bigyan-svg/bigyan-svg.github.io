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

export const dynamic = "force-dynamic";

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
