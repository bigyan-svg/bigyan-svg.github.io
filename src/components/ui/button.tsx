import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary/25 bg-primary text-primary-foreground shadow-[0_16px_30px_-18px_hsl(var(--primary)/0.95)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_20px_34px_-18px_hsl(var(--primary)/1)]",
        secondary:
          "border-secondary/40 bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/75",
        outline:
          "border-input bg-white/70 text-foreground backdrop-blur-sm hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/90",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:-translate-y-0.5 hover:bg-white/70 hover:text-foreground",
        destructive:
          "border-destructive/25 bg-destructive text-destructive-foreground shadow-[0_16px_30px_-20px_hsl(var(--destructive)/0.95)] hover:-translate-y-0.5 hover:bg-destructive/90"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10 rounded-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
