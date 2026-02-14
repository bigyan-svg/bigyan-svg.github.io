import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-input/70 bg-[linear-gradient(180deg,hsl(var(--background)/0.88),hsl(var(--background)/0.62))] px-3 py-2 text-sm text-foreground shadow-[0_1px_0_0_hsl(0_0%_100%/0.6)_inset] ring-offset-background transition-all placeholder:text-muted-foreground hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[var(--shadow-sm)]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
