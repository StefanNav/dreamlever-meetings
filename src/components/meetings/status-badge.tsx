"use client";

import { Repeat } from "lucide-react";
import { MeetingStatus } from "@/types/meetings";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const liveBadgeStyles =
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-live-bg text-live border-live";

interface StatusBadgeProps {
  status: MeetingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === "live") {
    return (
      <span className={cn(liveBadgeStyles, className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
        Live
      </span>
    );
  }

  if (status === "recurring") {
    return (
      <Tooltip content="Recurring meeting" position="top" className={className}>
        <span className="inline-flex text-muted-foreground/60">
          <Repeat className="w-3.5 h-3.5" />
        </span>
      </Tooltip>
    );
  }

  return null;
}
