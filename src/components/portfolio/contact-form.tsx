"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Fields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: Fields = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) next.email = "Valid email is required";
    if (!fields.subject.trim()) next.subject = "Subject is required";
    if (fields.message.trim().length < 20) next.message = "Message must be at least 20 characters";
    return next;
  }, [fields]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    toast.success("Message UI submitted (frontend demo).");
    setFields(initialState);
    setSubmitted(false);
  };

  const fieldClass = (name: keyof Fields) =>
    submitted && errors[name] ? "border-destructive/70 focus-visible:ring-destructive" : "";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={fields.name}
            onChange={(event) => setFields((prev) => ({ ...prev, name: event.target.value }))}
            aria-invalid={Boolean(submitted && errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass("name")}
            placeholder="Bigyan Sanjyal"
          />
          {submitted && errors.name ? (
            <p id="name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={fields.email}
            onChange={(event) => setFields((prev) => ({ ...prev, email: event.target.value }))}
            aria-invalid={Boolean(submitted && errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass("email")}
            placeholder="you@company.com"
          />
          {submitted && errors.email ? (
            <p id="email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={fields.subject}
          onChange={(event) => setFields((prev) => ({ ...prev, subject: event.target.value }))}
          aria-invalid={Boolean(submitted && errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={fieldClass("subject")}
          placeholder="Project collaboration"
        />
        {submitted && errors.subject ? (
          <p id="subject-error" className="text-xs text-destructive">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={fields.message}
          onChange={(event) => setFields((prev) => ({ ...prev, message: event.target.value }))}
          aria-invalid={Boolean(submitted && errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={fieldClass("message")}
          placeholder="Tell me what you are building and how I can help..."
        />
        {submitted && errors.message ? (
          <p id="message-error" className="text-xs text-destructive">
            {errors.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        <Send className="size-4" />
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}