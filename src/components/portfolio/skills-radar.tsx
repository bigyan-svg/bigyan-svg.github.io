"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import type { Skill } from "@/lib/types";

export function SkillsRadar({ items }: { items: Skill[] }) {
  const [mounted, setMounted] = useState(false);

  const data = useMemo(
    () =>
      items.slice(0, 8).map((item) => ({
        skill: item.name,
        level: item.level
      })),
    [items]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[320px] w-full rounded-xl bg-muted/60" />;
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="rgba(148, 163, 184, 0.3)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <Radar
            name="Skill"
            dataKey="level"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(9,12,26,0.92)",
              color: "white"
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}