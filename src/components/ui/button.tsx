import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border text-xs font-extrabold uppercase tracking-[0.075em] whitespace-nowrap transition-[color,background-color,transform,box-shadow] focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground shadow-[0.18rem_0.18rem_0_var(--foreground)] hover:-translate-y-0.5 hover:border-foreground hover:bg-foreground",
        destructive:
          "border-destructive bg-destructive text-white hover:bg-destructive/88 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-foreground/45 bg-background hover:border-foreground hover:bg-foreground hover:text-background dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "border-secondary bg-secondary text-secondary-foreground hover:border-accent hover:bg-accent",
        ghost: "border-transparent hover:border-foreground/20 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2 has-[>svg]:px-3.5",
        sm: "h-10 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 px-6 has-[>svg]:px-5",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
