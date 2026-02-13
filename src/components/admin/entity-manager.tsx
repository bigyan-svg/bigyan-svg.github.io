"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import { toSlug } from "@/lib/utils";
import { fetchWithAuthRetry, getCsrfToken } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/forms/rich-text-editor";

type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "url"
  | "number"
  | "checkbox"
  | "select"
  | "datetime"
  | "tags";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  uploadType?: "image" | "pdf" | "video";
  helpText?: string;
};

type ColumnConfig = {
  key: string;
  label: string;
  render?: (item: Record<string, unknown>) => ReactNode;
};

type Pagination = {
  page: number;
  totalPages: number;
};

type ManagerProps = {
  entity: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  defaultValues?: Record<string, unknown>;
  previewPath?: (item: Record<string, unknown>) => string;
};

function normalizeForField(field: FieldConfig, value: unknown) {
  if (value === null || value === undefined) return field.type === "checkbox" ? false : "";
  if (field.type === "tags" && Array.isArray(value)) return value.join(", ");
  if (field.type === "datetime" && typeof value === "string") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  }
  return value;
}

function defaultValueForField(field: FieldConfig) {
  if (field.type === "checkbox") return false;
  if (field.type === "select") return field.options?.[0]?.value || "";
  return "";
}

export function EntityManager({
  entity,
  title,
  description,
  fields,
  columns,
  defaultValues,
  previewPath
}: ManagerProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, totalPages: 1 });
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const baseDefaults = useMemo(() => {
    const fieldDefaults = fields.reduce<Record<string, unknown>>((acc, field) => {
      acc[field.name] = defaultValueForField(field);
      return acc;
    }, {});
    return {
      ...fieldDefaults,
      ...(defaultValues || {})
    };
  }, [defaultValues, fields]);

  useEffect(() => {
    setFormData(baseDefaults);
  }, [baseDefaults]);

  const load = async () => {
    setLoading(true);
    try {
      const search = new URLSearchParams({
        page: String(page),
        pageSize: "20",
        ...(query ? { q: query } : {})
      });
      const response = await fetchWithAuthRetry(`/api/admin/${entity}?${search.toString()}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to fetch");

      setItems(json.data.items);
      setPagination({
        page: json.data.pagination.page,
        totalPages: json.data.pagination.totalPages
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, page, query]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(baseDefaults);
  };

  const handleAutoSlug = () => {
    const titleValue = String(formData.title || "").trim();
    if (!titleValue) return;
    setFormData((prev) => ({
      ...prev,
      slug: toSlug(titleValue)
    }));
  };

  const onEdit = (item: Record<string, unknown>) => {
    const next: Record<string, unknown> = {};
    fields.forEach((field) => {
      next[field.name] = normalizeForField(field, item[field.name]);
    });
    setEditingId(String(item.id));
    setFormData(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetchWithAuthRetry(`/api/admin/${entity}/${id}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken
        }
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Delete failed");
      toast.success("Deleted successfully");
      await load();
      if (editingId === id) resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const csrfToken = await getCsrfToken();
      const endpoint = editingId ? `/api/admin/${entity}/${editingId}` : `/api/admin/${entity}`;
      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...formData
      };

      const response = await fetchWithAuthRetry(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Save failed");
      toast.success(editingId ? "Updated successfully" : "Created successfully");
      resetForm();
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadForField = async (field: FieldConfig, file?: File | null) => {
    if (!file || !field.uploadType) return;
    try {
      const csrfToken = await getCsrfToken();
      const payload = new FormData();
      payload.append("file", file);
      payload.append("type", field.uploadType);
      payload.append("folder", entity);

      const response = await fetchWithAuthRetry("/api/upload", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken },
        body: payload
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        [field.name]: json.data.url
      }));
      toast.success("Upload successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const openPreview = async () => {
    if (!previewPath) return;
    try {
      const path = previewPath(formData);
      if (!path) return;
      const response = await fetchWithAuthRetry(`/api/admin/preview-link?slug=${encodeURIComponent(path)}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to generate preview");
      window.open(json.data.previewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Preview failed");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? `Edit ${title}` : `Create ${title}`}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.type === "richtext" || field.type === "textarea" ? "md:col-span-2 space-y-2" : "space-y-2"}>
                  <Label htmlFor={field.name}>
                    {field.label} {field.required ? "*" : ""}
                  </Label>

                  {field.type === "text" || field.type === "url" || field.type === "number" ? (
                    <Input
                      id={field.name}
                      type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                      value={String(formData[field.name] ?? "")}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "datetime" ? (
                    <Input
                      id={field.name}
                      type="datetime-local"
                      value={String(formData[field.name] ?? "")}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      value={String(formData[field.name] ?? "")}
                      placeholder={field.placeholder}
                      required={field.required}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "richtext" ? (
                    <RichTextEditor
                      value={String(formData[field.name] ?? "")}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "select" ? (
                    <Select
                      id={field.name}
                      value={String(formData[field.name] ?? "")}
                      options={field.options || []}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.type === "checkbox" ? (
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(formData[field.name])}
                        onChange={(event) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: event.target.checked
                          }))
                        }
                      />
                      Enabled
                    </label>
                  ) : null}

                  {field.type === "tags" ? (
                    <Input
                      id={field.name}
                      value={String(formData[field.name] ?? "")}
                      placeholder={field.placeholder || "comma, separated, tags"}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: event.target.value
                        }))
                      }
                    />
                  ) : null}

                  {field.uploadType ? (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept={
                          field.uploadType === "image"
                            ? ".jpg,.jpeg,.png,.webp"
                            : field.uploadType === "pdf"
                              ? ".pdf"
                              : ".mp4,.webm,.mov"
                        }
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          void uploadForField(field, file);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload and auto-fill this URL field.
                      </p>
                    </div>
                  ) : null}

                  {field.helpText ? <p className="text-xs text-muted-foreground">{field.helpText}</p> : null}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <RefreshCw className="mr-2 size-4" />
                Reset
              </Button>
              {"title" in formData && "slug" in formData ? (
                <Button type="button" variant="outline" onClick={handleAutoSlug}>
                  Generate Slug
                </Button>
              ) : null}
              {previewPath && formData.slug ? (
                <Button type="button" variant="outline" onClick={openPreview}>
                  Preview Draft
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title} Table</span>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search..."
                value={inputQuery}
                onChange={(event) => setInputQuery(event.target.value)}
                className="w-56"
              />
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => {
                  setPage(1);
                  setQuery(inputQuery.trim());
                }}
              >
                Search
              </Button>
              <Button size="sm" type="button" variant="outline" onClick={resetForm}>
                <PlusCircle className="mr-1 size-4" />
                New
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={String(item.id)}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render
                            ? column.render(item)
                            : Array.isArray(item[column.key])
                              ? (item[column.key] as unknown[]).join(", ")
                              : typeof item[column.key] === "boolean"
                                ? item[column.key]
                                  ? "Yes"
                                  : "No"
                                : typeof item[column.key] === "string" && column.key === "status"
                                  ? (
                                    <Badge
                                      variant={
                                        item[column.key] === "PUBLISHED"
                                          ? "default"
                                          : item[column.key] === "SCHEDULED"
                                            ? "secondary"
                                            : "outline"
                                      }
                                    >
                                      {String(item[column.key])}
                                    </Badge>
                                  )
                                  : String(item[column.key] ?? "-")}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                            <Pencil className="mr-1 size-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === item.id}
                            onClick={() => onDelete(String(item.id))}
                          >
                            <Trash2 className="mr-1 size-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} / {pagination.totalPages}
                </p>
                <Button
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export type { FieldConfig, ColumnConfig };
