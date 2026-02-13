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
