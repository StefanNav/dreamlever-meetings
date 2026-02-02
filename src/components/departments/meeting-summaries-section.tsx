"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface MeetingSummary {
  id: string;
  date: string;
  title: string;
}

interface MeetingSummariesSectionProps {
  summaries: MeetingSummary[];
  onSummaryClick?: (summaryId: string) => void;
}

export function MeetingSummariesSection({
  summaries,
  onSummaryClick,
}: MeetingSummariesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-cyan-light/30 border border-cyan/20 rounded-lg hover:bg-cyan-light/50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-cyan/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-cyan" />
            </div>
            <span className="text-sm font-medium text-cyan">
              Meeting Summaries
            </span>
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-cyan transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 space-y-2"
            >
              {summaries.length > 0 ? (
                summaries.map((summary) => (
                  <button
                    key={summary.id}
                    onClick={() => onSummaryClick?.(summary.id)}
                    className="w-full text-left px-4 py-3 bg-white border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {summary.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {summary.date}
                    </p>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No meeting summaries yet.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}
