import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import "@/app/globals.css";
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

export const metadata: Metadata = {
  title: "Bigyan Sanjyal | Futuristic Portfolio",
  description:
    "Premium cinematic portfolio UI for Bigyan Sanjyal, BE Computer Engineering student and full-stack engineer.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${spaceMono.variable}`}>
      <body className="font-[var(--font-sora)]">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
