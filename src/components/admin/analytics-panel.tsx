"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchWithAuthRetry } from "@/lib/client-api";

type AnalyticsData = {
  totals: {
    projects: number;
    blogs: number;
    ideas: number;
    photos: number;
    videos: number;
    documents: number;
    messages: number;
    unreadMessages: number;
  };
  views: {
    projects: number;
    blogs: number;
    ideas: number;
    total: number;
  };
};

export function AnalyticsPanel() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchWithAuthRetry("/api/admin/analytics");
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Failed to load analytics");
        setData(json.data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading analytics...</p>;
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">No analytics available.</p>;
  }

  const stats = [
    { label: "Projects", value: data.totals.projects },
    { label: "Blog Posts", value: data.totals.blogs },
    { label: "Ideas", value: data.totals.ideas },
    { label: "Photos", value: data.totals.photos },
    { label: "Videos", value: data.totals.videos },
    { label: "Documents", value: data.totals.documents },
    { label: "Messages", value: data.totals.messages },
    { label: "Unread Messages", value: data.totals.unreadMessages },
    { label: "Project Views", value: data.views.projects },
    { label: "Blog Views", value: data.views.blogs },
    { label: "Idea Views", value: data.views.ideas },
    { label: "Total Views", value: data.views.total }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stat.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
