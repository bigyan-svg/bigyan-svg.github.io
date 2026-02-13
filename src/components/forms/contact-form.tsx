"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function randomNum() {
  return Math.floor(Math.random() * 10) + 1;
}

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const captcha = useMemo(() => ({ a: randomNum(), b: randomNum() }), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    try {
      const payload = {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        subject: String(formData.get("subject") || ""),
        message: String(formData.get("message") || ""),
        honeypot: String(formData.get("honeypot") || ""),
        captchaA: captcha.a,
        captchaB: captcha.b,
        captchaAnswer: Number(formData.get("captchaAnswer") || 0)
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully.");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can I help?" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write your message..."
          className="min-h-44"
          required
        />
      </div>
      <div className="hidden">
        <Label htmlFor="honeypot">Company</Label>
        <Input id="honeypot" name="honeypot" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="captchaAnswer">
          CAPTCHA: {captcha.a} + {captcha.b} = ?
        </Label>
        <Input id="captchaAnswer" name="captchaAnswer" type="number" required />
      </div>
      <Button disabled={loading} type="submit">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
