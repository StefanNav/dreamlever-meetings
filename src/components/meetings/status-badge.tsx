"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { MeetingStatus } from "@/types/meetings";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
  {
    variants: {
      status: {
        live: "bg-live-bg text-live border-live",
        recurring: "bg-recurring-bg text-recurring border-recurring",
      },
    },
    defaultVariants: {
      status: "recurring",
    },
  }
);

interface StatusBadgeProps {
  status: MeetingStatus;
  className?: string;
}

export { statusBadgeVariants };

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === "upcoming" || status === "past") {
    return null;
  }

  const isLive = status === "live";
  const badgeStatus = isLive ? "live" : "recurring";

  return (
    <span className={cn(statusBadgeVariants({ status: badgeStatus }), className)}>
      {isLive && (
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
      )}
      {isLive ? "Live" : "Recurring"}
    </span>
  );
}
