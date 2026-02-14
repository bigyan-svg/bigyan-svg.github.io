"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { SkillsRadar } from "@/components/portfolio/skills-radar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { skills } from "@/lib/data";
import type { SkillCategory } from "@/lib/types";

const categories: Array<SkillCategory | "All"> = ["All", "Frontend", "Backend", "Cloud", "Data", "Tooling"];

export default function SkillsPage() {
  const [active, setActive] = useState<SkillCategory | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? skills : skills.filter((skill) => skill.category === active)),
    [active]
  );

  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Skills"
        title="Filterable skill spectrum"
        description="Explore skills by category and inspect capability depth via animated chart and progress indicators."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            type="button"
            size="sm"
            variant={active === category ? "default" : "outline"}
            onClick={() => setActive(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Radar Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillsRadar items={filtered} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Chips + Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {filtered.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.map((skill) => (
                <div key={`${skill.id}-bar`} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary transition-all duration-700" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}