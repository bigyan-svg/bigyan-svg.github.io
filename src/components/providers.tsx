"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ContentProvider } from "@/components/content/content-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ContentProvider>{children}</ContentProvider>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
