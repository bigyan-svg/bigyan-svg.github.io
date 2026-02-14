"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BarChart3, Briefcase, FileText, MessageSquare, Settings, Sparkles } from "lucide-react";
import { imageBlurDataUrl } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Overview", icon: BarChart3 },
  { label: "Projects", icon: Briefcase },
  { label: "Blog", icon: FileText },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings }
] as const;

type AdminSection = (typeof sidebarLinks)[number]["label"];

type SectionConfig = {
  stats: Array<{ label: string; value: string }>;
  image: string;
  tableTitle: string;
  formTitle: string;
  titleLabel: string;
  titlePlaceholder: string;
  summaryLabel: string;
  summaryPlaceholder: string;
  statusLabel: string;
  statusOptions: Array<{ label: string; value: string }>;
  rows: Array<{ title: string; status: string; updated: string; owner: string }>;
};

const sectionConfigs: Record<AdminSection, SectionConfig> = {
  Overview: {
    stats: [
      { label: "Total Content", value: "214" },
      { label: "Active Drafts", value: "18" },
      { label: "Monthly Views", value: "12.4K" }
    ],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1500&q=80",
    tableTitle: "Recent Activity",
    formTitle: "Quick Publish Action",
    titleLabel: "Announcement title",
    titlePlaceholder: "Platform update - week 6",
    summaryLabel: "Announcement details",
    summaryPlaceholder: "Write a short dashboard announcement for the team.",
    statusLabel: "Visibility",
    statusOptions: [
      { label: "Private", value: "private" },
      { label: "Public", value: "public" }
    ],
    rows: [
      { title: "Portfolio Hero Update", status: "Published", updated: "Feb 14, 2026", owner: "Bigyan" },
      { title: "Media Library Cleanup", status: "Draft", updated: "Feb 13, 2026", owner: "Bigyan" }
    ]
  },
  Projects: {
    stats: [
      { label: "Total Projects", value: "12" },
      { label: "Featured", value: "5" },
      { label: "In Review", value: "3" }
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1500&q=80",
    tableTitle: "Project Entries",
    formTitle: "Create Project",
    titleLabel: "Project title",
    titlePlaceholder: "Neural Resume Scorer",
    summaryLabel: "Project summary",
    summaryPlaceholder: "Write concise project summary...",
    statusLabel: "Project status",
    statusOptions: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" }
    ],
    rows: [
      { title: "Outversal Portfolio CMS", status: "Published", updated: "Feb 12, 2026", owner: "Bigyan" },
      { title: "SignalOps Monitor", status: "Draft", updated: "Feb 09, 2026", owner: "Bigyan" }
    ]
  },
  Blog: {
    stats: [
      { label: "Blog Posts", value: "48" },
      { label: "Categories", value: "6" },
      { label: "Avg Read Time", value: "7m" }
    ],
    image: "https://images.unsplash.com/photo-1456324463128-7ff6903988d8?auto=format&fit=crop&w=1500&q=80",
    tableTitle: "Blog Posts",
    formTitle: "Write New Post",
    titleLabel: "Post title",
    titlePlaceholder: "Scaling Next.js UI systems",
    summaryLabel: "Excerpt",
    summaryPlaceholder: "Write a short excerpt for listing page...",
    statusLabel: "Post status",
    statusOptions: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" }
    ],
    rows: [
      { title: "Backend Thinking for Frontend Devs", status: "Published", updated: "Feb 11, 2026", owner: "Bigyan" },
      { title: "Motion Without Performance Debt", status: "Draft", updated: "Feb 10, 2026", owner: "Bigyan" }
    ]
  },
  Messages: {
    stats: [
      { label: "Unread", value: "4" },
      { label: "Replied", value: "28" },
      { label: "This Week", value: "11" }
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1500&q=80",
    tableTitle: "Inbox Messages",
    formTitle: "Reply Draft",
    titleLabel: "Reply subject",
    titlePlaceholder: "Re: Portfolio collaboration request",
    summaryLabel: "Reply body",
    summaryPlaceholder: "Draft your response here...",
    statusLabel: "Message status",
    statusOptions: [
      { label: "Unread", value: "unread" },
      { label: "Replied", value: "replied" }
    ],
    rows: [
      { title: "Internship opportunity inquiry", status: "Unread", updated: "Feb 14, 2026", owner: "Recruiter" },
      { title: "Project collaboration request", status: "Replied", updated: "Feb 12, 2026", owner: "Founder" }
    ]
  },
  Settings: {
    stats: [
      { label: "Profile Completion", value: "92%" },
      { label: "Connected Services", value: "4" },
      { label: "Security Alerts", value: "0" }
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=80",
    tableTitle: "System Settings",
    formTitle: "Configuration",
    titleLabel: "Setting key",
    titlePlaceholder: "portfolio.theme.default",
    summaryLabel: "Setting value",
    summaryPlaceholder: "Set configuration value...",
    statusLabel: "Environment",
    statusOptions: [
      { label: "Development", value: "development" },
      { label: "Production", value: "production" }
    ],
    rows: [
      { title: "Theme preference", status: "Active", updated: "Feb 14, 2026", owner: "System" },
      { title: "Email notifications", status: "Active", updated: "Feb 08, 2026", owner: "System" }
    ]
  }
};

export function AdminShellPreview() {
  const [active, setActive] = useState<AdminSection>("Projects");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("draft");

  const config = useMemo(() => sectionConfigs[active], [active]);

  const statusBadgeVariant = (value: string) => {
    if (["published", "replied", "active"].includes(value.toLowerCase())) return "success" as const;
    return "outline" as const;
  };

  const handleSave = () => {
    if (!title.trim() || !summary.trim()) {
      toast.error("Please fill in both fields before saving.");
      return;
    }

    toast.success(`${active} template saved (${status}).`);
    setTitle("");
    setSummary("");
  };

  return (
    <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/65 p-4 backdrop-blur-xl lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border border-border/60 bg-background/55 p-3">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Admin UI Template</p>
        <nav className="space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const selected = active === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActive(item.label)}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                  selected ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {config.stats.map((item) => (
            <motion.div whileHover={{ y: -3 }} key={item.label} className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="relative border-b border-border/60">
            <Image
              src={config.image}
              alt={`${active} dashboard preview`}
              width={1500}
              height={640}
              placeholder="blur"
              blurDataURL={imageBlurDataUrl}
              className="aspect-[16/5] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{config.tableTitle}</CardTitle>
            <Badge variant="secondary">Interactive Demo</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {config.rows.map((row) => (
                  <TableRow key={row.title}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                    </TableCell>
                    <TableCell>{row.updated}</TableCell>
                    <TableCell>{row.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{config.formTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-field-title">{config.titleLabel}</Label>
                <Input
                  id="admin-field-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={config.titlePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-field-status">{config.statusLabel}</Label>
                <Select
                  id="admin-field-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  options={config.statusOptions}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-field-summary">{config.summaryLabel}</Label>
              <Textarea
                id="admin-field-summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder={config.summaryPlaceholder}
              />
            </div>
            <Button type="button" onClick={handleSave}>
              <Sparkles className="size-4" /> Save Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
