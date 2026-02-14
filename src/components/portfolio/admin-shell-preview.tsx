"use client";

import { useState } from "react";
import { BarChart3, Briefcase, FileText, MessageSquare, Settings, Sparkles } from "lucide-react";
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
];

export function AdminShellPreview() {
  const [active, setActive] = useState("Projects");

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
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm",
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Content Table Template</CardTitle>
            <Badge variant="secondary">UI Only</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Author</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Outversal Portfolio CMS</TableCell>
                  <TableCell>
                    <Badge variant="success">Published</Badge>
                  </TableCell>
                  <TableCell>Feb 12, 2026</TableCell>
                  <TableCell>Bigyan</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SignalOps Monitor</TableCell>
                  <TableCell>
                    <Badge variant="outline">Draft</Badge>
                  </TableCell>
                  <TableCell>Feb 09, 2026</TableCell>
                  <TableCell>Bigyan</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-title">Project title</Label>
                <Input id="project-title" placeholder="Neural Resume Scorer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  id="project-status"
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" }
                  ]}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-summary">Summary</Label>
              <Textarea id="project-summary" placeholder="Write concise project summary..." />
            </div>
            <Button>
              <Sparkles className="size-4" /> Save Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}