"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { MeetingCategory } from "@/types/meetings";
import { cn } from "@/lib/utils";

const categoryBadgeVariants = cva(
  "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
  {
    variants: {
      category: {
        operations: "bg-operations-bg text-operations border-operations",
        design: "bg-design-bg text-design border-design",
        engineering: "bg-engineering-bg text-engineering border-engineering",
        marketing: "bg-marketing-bg text-marketing border-marketing",
        sales: "bg-sales-bg text-sales border-sales",
      },
    },
    defaultVariants: {
      category: "operations",
    },
  }
);

const categoryLabels: Record<MeetingCategory, string> = {
  operations: "Operations",
  design: "Design",
  engineering: "Engineering",
  marketing: "Marketing",
  sales: "Sales",
};

interface CategoryBadgeProps extends VariantProps<typeof categoryBadgeVariants> {
  category: MeetingCategory;
  className?: string;
}

export { categoryBadgeVariants };

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn(categoryBadgeVariants({ category }), className)}>
      {categoryLabels[category]}
    </span>
  );
}
