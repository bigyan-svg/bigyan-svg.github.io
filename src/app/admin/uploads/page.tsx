import { UploadManager } from "@/components/admin/upload-manager";

export default function AdminUploadPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Upload Manager</h1>
        <p className="text-sm text-muted-foreground">
          Upload images, PDFs, or videos and reuse the generated URL in any content form.
        </p>
      </div>
      <UploadManager />
    </div>
  );
}
