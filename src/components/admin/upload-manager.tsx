"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { getCsrfToken } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function UploadManager() {
  const [type, setType] = useState<"image" | "pdf" | "video">("image");
  const [folder, setFolder] = useState("general");
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    if (!file) {
      toast.error("Select a file first");
      return;
    }

    setUploading(true);
    try {
      const csrfToken = await getCsrfToken();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("folder", folder || "general");

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken
        },
        body: formData,
        credentials: "include"
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Upload failed");
      setResultUrl(json.data.url);
      toast.success("Uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Upload Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onChange={(event) => setType(event.target.value as "image" | "pdf" | "video")}
              options={[
                { label: "Image", value: "image" },
                { label: "PDF", value: "pdf" },
                { label: "Video", value: "video" }
              ]}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Folder</Label>
            <Input value={folder} onChange={(event) => setFolder(event.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>File</Label>
          <Input
            type="file"
            accept={type === "image" ? ".jpg,.jpeg,.png,.webp" : type === "pdf" ? ".pdf" : ".mp4,.webm,.mov"}
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </div>
        <Button onClick={upload} disabled={uploading}>
          <Upload className="mr-2 size-4" />
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
        {resultUrl ? (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
            <p className="font-medium">Uploaded URL</p>
            <p className="break-all text-muted-foreground">{resultUrl}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
