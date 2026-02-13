"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Mail, Trash2 } from "lucide-react";
import { fetchWithAuthRetry, getCsrfToken } from "@/lib/client-api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  replied: boolean;
  createdAt: string;
};

export function MessagesInbox() {
  const [items, setItems] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(query ? { q: query } : {});
      const response = await fetchWithAuthRetry(`/api/admin/messages?${params.toString()}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to load messages");
      setItems(json.data.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const updateMessage = async (id: string, payload: Partial<Message>) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetchWithAuthRetry(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Update failed");
      toast.success("Message updated");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetchWithAuthRetry(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken
        }
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Delete failed");
      toast.success("Message deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contact Inbox</span>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search messages..."
              className="w-64"
              value={inputQuery}
              onChange={(event) => setInputQuery(event.target.value)}
            />
            <Button size="sm" variant="outline" onClick={() => setQuery(inputQuery.trim())}>
              Search
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-xs text-muted-foreground">{message.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{message.subject}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{message.message}</p>
                  </TableCell>
                  <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={message.isRead ? "secondary" : "outline"}>
                        {message.isRead ? "Read" : "Unread"}
                      </Badge>
                      <Badge variant={message.replied ? "default" : "outline"}>
                        {message.replied ? "Replied" : "Not Replied"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateMessage(message.id, {
                            isRead: !message.isRead
                          })
                        }
                      >
                        <Check className="mr-1 size-4" />
                        Mark {message.isRead ? "Unread" : "Read"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMessage(message.id, { replied: !message.replied })}
                      >
                        <Mail className="mr-1 size-4" />
                        Toggle Replied
                      </Button>
                      <Link
                        href={`mailto:${message.email}?subject=Re:${encodeURIComponent(message.subject)}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Reply Email
                      </Link>
                      <Button size="sm" variant="destructive" onClick={() => deleteMessage(message.id)}>
                        <Trash2 className="mr-1 size-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
