"use client";

import { useEffect } from "react";

type ViewEntity = "project" | "blog" | "idea" | "photo" | "video";

export function ViewTracker({ entity, slug }: { entity: ViewEntity; slug: string }) {
  useEffect(() => {
    void fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, slug })
    });
  }, [entity, slug]);

  return null;
}
