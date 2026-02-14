"use client";

import type { ReactNode } from "react";
import { AnimatedBackground } from "@/components/effects/animated-background";
import { PageTransition } from "@/components/effects/page-transition";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { BackToTop } from "@/components/layout/back-to-top";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <AnimatedBackground />
      <ScrollProgress />
      <Navbar />
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      <Footer />
      <BackToTop />
    </div>
  );
}