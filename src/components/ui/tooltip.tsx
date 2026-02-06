"use client";

import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tooltipVariants = cva(
  "pointer-events-none absolute px-2.5 py-1.5 text-xs font-medium text-white bg-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50",
  {
    variants: {
      position: {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
      },
    },
    defaultVariants: {
      position: "top",
    },
  }
);

const tooltipArrowVariants = cva("absolute border-4", {
  variants: {
    position: {
      top: "top-full left-1/2 -translate-x-1/2 border-t-foreground border-l-transparent border-r-transparent border-b-transparent",
      bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-foreground border-l-transparent border-r-transparent border-t-transparent",
      left: "left-full top-1/2 -translate-y-1/2 border-l-foreground border-t-transparent border-b-transparent border-r-transparent",
      right: "right-full top-1/2 -translate-y-1/2 border-r-foreground border-t-transparent border-b-transparent border-l-transparent",
    },
  },
  defaultVariants: {
    position: "top",
  },
});

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  children: ReactNode;
  content: string;
  className?: string;
  position?: TooltipPosition;
}

export { tooltipVariants, tooltipArrowVariants };

export function Tooltip({ children, content, className, position = "top" }: TooltipProps) {
  return (
    <div className={cn("group relative inline-flex", className)}>
      {children}
      <div className={tooltipVariants({ position })}>
        {content}
        <div className={tooltipArrowVariants({ position })} />
      </div>
    </div>
  );
}
