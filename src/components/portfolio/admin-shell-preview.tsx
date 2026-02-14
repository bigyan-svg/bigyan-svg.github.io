"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Download, RefreshCcw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { defaultPortfolioContent } from "@/lib/data";
import type { FrontendControls, Profile } from "@/lib/types";
import { usePortfolioContent } from "@/components/content/content-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const profileFields: Array<{ key: keyof Profile; label: string; placeholder: string }> = [
  { key: "name", label: "Name", placeholder: "Bigyan Sanjyal" },
  { key: "username", label: "Username", placeholder: "bigyan-svg" },
  { key: "role", label: "Role", placeholder: "BE Computer Engineering Student" },
  { key: "email", label: "Email", placeholder: "you@example.com" },
  { key: "location", label: "Location", placeholder: "Kathmandu, Nepal" },
  { key: "github", label: "GitHub URL", placeholder: "https://github.com/..." },
  { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
  { key: "resumeUrl", label: "Resume URL", placeholder: "https://..." },
  { key: "avatar", label: "Avatar Image", placeholder: "/images/bigyan.jpeg" },
  { key: "heroImage", label: "Hero Image", placeholder: "https://..." },
  { key: "aboutImage", label: "About Image", placeholder: "https://..." },
  { key: "contactImage", label: "Contact Image", placeholder: "https://..." }
];

const controlFields: Array<{ key: keyof FrontendControls; label: string; description: string }> = [
  { key: "showNavbarProfilePhoto", label: "Navbar Profile Photo", description: "Show avatar beside brand in navbar." },
  { key: "showHeroAvatarChip", label: "Hero Avatar Chip", description: "Show top-right avatar chip in hero card." },
  { key: "showHeroStats", label: "Hero Stats", description: "Show project/skills/blog counters." },
  { key: "showHomeAboutPreview", label: "Home About Section", description: "Toggle home about preview." },
  { key: "showHomeSkillsPreview", label: "Home Skills Section", description: "Toggle home skills preview." },
  { key: "showHomeProjectsPreview", label: "Home Projects Section", description: "Toggle home projects preview." },
  { key: "showHomeBlogPreview", label: "Home Blog Section", description: "Toggle home blog preview." },
  { key: "showHomeContactPreview", label: "Home Contact CTA", description: "Toggle home contact section." },
  { key: "enableAnimatedBackground", label: "Animated Background", description: "Enable dynamic aurora/particles." },
  { key: "enablePageTransitions", label: "Page Transitions", description: "Enable route transition animations." },
  { key: "enableRevealAnimations", label: "Reveal Animations", description: "Enable scroll reveal effects." },
  { key: "enableCardTilt", label: "Card Tilt Effects", description: "Enable project card 3D tilt." },
  { key: "enableScrollProgress", label: "Scroll Progress", description: "Show top progress bar." },
  { key: "enableBackToTop", label: "Back To Top", description: "Show floating back-to-top button." }
];

export function AdminShellPreview() {
  const { content, setContent, resetContent, applyJson, exportJson, siteStats, hydrated } = usePortfolioContent();
  const [jsonEditor, setJsonEditor] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (jsonEditor.trim().length === 0) {
      setJsonEditor(exportJson());
    }
  }, [hydrated, jsonEditor, exportJson]);

  const updateProfile = (key: keyof Profile, value: string) => {
    setContent((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value
      }
    }));
  };

  const updateControl = (key: keyof FrontendControls, value: boolean) => {
    setContent((prev) => ({
      ...prev,
      controls: {
        ...prev.controls,
        [key]: value
      }
    }));
  };

  const handleApplyJson = () => {
    const result = applyJson(jsonEditor);
    if (!result.ok) {
      toast.error(result.error || "Unable to apply JSON.");
      return;
    }
    toast.success("Frontend content updated.");
  };

  const handleLoadLive = () => {
    setJsonEditor(exportJson());
    toast.success("Loaded current live content into editor.");
  };

  const handleReset = () => {
    const confirmed = window.confirm("Reset all frontend content and controls to defaults?");
    if (!confirmed) return;
    resetContent();
    setJsonEditor(JSON.stringify(defaultPortfolioContent, null, 2));
    toast.success("Frontend content reset to defaults.");
  };

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setJsonEditor(text);
      const result = applyJson(text);
      if (!result.ok) {
        toast.error(result.error || "Imported file has invalid format.");
      } else {
        toast.success("Imported and applied content JSON.");
      }
    } finally {
      event.target.value = "";
    }
  };

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">Loading admin control center...</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Frontend Control Center</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Full admin control for portfolio frontend. Changes are saved in this browser instantly.
            </p>
          </div>
          <Badge variant="secondary">Live Control</Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-background/55 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Projects</p>
            <p className="mt-2 text-2xl font-semibold">{siteStats.projects}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/55 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Skills</p>
            <p className="mt-2 text-2xl font-semibold">{siteStats.skills}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/55 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Blog Posts</p>
            <p className="mt-2 text-2xl font-semibold">{siteStats.blogs}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile + Brand Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {profileFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`profile-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`profile-${field.key}`}
                    value={content.profile[field.key]}
                    onChange={(event) => updateProfile(field.key, event.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-headline">Headline</Label>
              <Textarea
                id="profile-headline"
                value={content.profile.headline}
                onChange={(event) => updateProfile("headline", event.target.value)}
                placeholder="Main hero headline..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-intro">Intro</Label>
              <Textarea
                id="profile-intro"
                value={content.profile.intro}
                onChange={(event) => updateProfile("intro", event.target.value)}
                placeholder="About preview intro..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frontend Feature Toggles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {controlFields.map((field) => (
              <label
                key={field.key}
                className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/55 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{field.label}</p>
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={content.controls[field.key]}
                  onChange={(event) => updateControl(field.key, event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border accent-primary"
                />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Full JSON Editor (All Frontend Data)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jsonEditor}
            onChange={(event) => setJsonEditor(event.target.value)}
            className="min-h-[420px] font-mono text-xs"
            aria-label="Frontend content JSON editor"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleApplyJson}>
              <Save className="size-4" /> Apply JSON
            </Button>
            <Button type="button" variant="outline" onClick={handleLoadLive}>
              <Sparkles className="size-4" /> Load Live JSON
            </Button>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Sparkles className="size-4" /> Import JSON
            </Button>
            <Button type="button" variant="outline" onClick={handleExport}>
              <Download className="size-4" /> Export JSON
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RefreshCcw className="size-4" /> Reset Defaults
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground">
            This admin control center is frontend-managed and stored in browser localStorage. For multi-device control,
            connect these actions to backend APIs and database persistence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
