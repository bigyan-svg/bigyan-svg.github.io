import * as React from "react";
import { cn } from "@/lib/utils";

interface SimpleSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export function Select({ options, className, ...props }: SimpleSelectProps) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-input bg-white/78 px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-sm transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 focus-visible:bg-white",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
