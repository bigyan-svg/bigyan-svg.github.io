"use client";

import type { ReactNode } from "react";
import { AnimatedBackground } from "@/components/effects/animated-background";
import { PageTransition } from "@/components/effects/page-transition";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { BackToTop } from "@/components/layout/back-to-top";
import { usePortfolioContent } from "@/components/content/content-provider";

export function AppShell({ children }: { children: ReactNode }) {
  const {
    content: { controls }
  } = usePortfolioContent();

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {controls.enableAnimatedBackground ? <AnimatedBackground /> : null}
      {controls.enableScrollProgress ? <ScrollProgress /> : null}
      <Navbar />
      <PageTransition enabled={controls.enablePageTransitions}>
        <main>{children}</main>
      </PageTransition>
      <Footer />
      {controls.enableBackToTop ? <BackToTop /> : null}
    </div>
  );
}
