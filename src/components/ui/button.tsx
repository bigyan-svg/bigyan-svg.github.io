import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(180deg,hsl(var(--primary)),hsl(var(--primary)/0.86))] text-primary-foreground shadow-[0_14px_30px_-18px_hsl(var(--primary)/0.55)] hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-30px_hsl(var(--primary)/0.5)] active:translate-y-0",
        outline:
          "border border-border/70 bg-[linear-gradient(180deg,hsl(var(--background)/0.86),hsl(var(--background)/0.64))] backdrop-blur hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-sm)]",
        ghost: "hover:bg-muted/60 hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-10 w-10"
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
    return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
