import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        description="Have a project, internship, or collaboration in mind? Send me a message."
      />
      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardContent className="p-6">
              <ContactForm />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-6 text-sm">
              <p className="text-muted-foreground">
                Messages are saved in the CMS inbox. Email notifications are sent via SMTP when configured.
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <Link href="mailto:bigyan@example.com" className="text-primary hover:underline">
                  bigyan@example.com
                </Link>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <Link href="https://github.com/bigyan-svg" target="_blank" className="text-primary hover:underline">
                  github.com/bigyan-svg
                </Link>
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <Link
                  href="https://linkedin.com/in/bigyan-svg"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  linkedin.com/in/bigyan-svg
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
