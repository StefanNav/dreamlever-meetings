"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navigateToSource } from "@/lib/source-locator";
import { 
  ChevronsRight, 
  Check, 
  Circle, 
  ChevronDown, 
  Calendar,
  FileText,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActionItem, Participant } from "@/lib/department-data";
import { cn } from "@/lib/utils";

interface ActionItemDrawerProps {
  item: ActionItem | null;
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
}

export function ActionItemDrawer({ 
  item, 
  isOpen, 
  onClose, 
  participants 
}: ActionItemDrawerProps) {
  const router = useRouter();
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close assignee dropdown when clicking outside
  useEffect(() => {
    if (!isAssigneeDropdownOpen) return;
    const handleClick = () => setIsAssigneeDropdownOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isAssigneeDropdownOpen]);

  if (!item) return null;

  const assigneeInitials = item.assignee
    ? item.assignee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";

  // Determine origin display based on source type and available data
  const getOriginDisplay = () => {
    if (!item.agendaItemId && item.transcriptChunkId) {
      return { 
        type: "transcript" as const, 
        itemLabel: "Created in meeting transcript",
        canNavigate: true
      };
    }
    if (item.agendaItemId && !item.agendaItemTitle) {
      return { 
        type: "deleted" as const, 
        itemLabel: "Source item no longer available",
        canNavigate: true
      };
    }
    if (item.agendaItemTitle) {
      return { 
        type: "agenda" as const, 
        itemLabel: item.agendaItemTitle,
        canNavigate: true
      };
    }
    return { 
      type: "unknown" as const, 
      itemLabel: "Unknown source",
      canNavigate: false
    };
  };

  const originDisplay = getOriginDisplay();

  // Handle "Open source" navigation
  const handleOpenSource = () => {
    if (!originDisplay.canNavigate) return;

    // Close the drawer first
    onClose();

    // Navigate to the source using the utility
    navigateToSource(
      {
        meetingSeriesId: item.meetingSeriesId,
        meetingInstanceId: item.meetingInstanceId,
        agendaItemId: originDisplay.type === "agenda" ? item.agendaItemId : undefined,
        transcriptChunkId: item.transcriptChunkId,
      },
      router
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[530px] bg-white shadow-2xl z-50 flex flex-col rounded-l-[14px]"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Close drawer"
              >
                <ChevronsRight className="w-[18px] h-[18px] text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Action Item</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Title */}
              <h2 className="text-xl font-medium text-foreground mb-6">
                {item.title}
              </h2>

              {/* Task Controls Section */}
              <div className="space-y-4 mb-8">
                {/* Status */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[120px]">Status</span>
                  <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        item.status === "incomplete"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"
                      )}
                    >
                      <Circle className="w-4 h-4" />
                      Incomplete
                    </button>
                    <button
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        item.status === "complete"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"
                      )}
                    >
                      <Check className="w-4 h-4" />
                      Complete
                    </button>
                  </div>
                </div>

                {/* Assignee */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[120px]">Assignee</span>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      {item.assignee ? (
                        <>
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={item.assignee.avatar} alt={item.assignee.name} />
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">
                              {assigneeInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-foreground">{item.assignee.name}</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {/* Assignee Dropdown */}
                    {isAssigneeDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        <div className="p-2">
                          <p className="text-xs text-muted-foreground px-2 py-1">Select assignee</p>
                          {participants.map((participant) => {
                            const initials = participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("");
                            return (
                              <button
                                key={participant.id}
                                className={cn(
                                  "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted/50",
                                  item.assignee?.id === participant.id && "bg-muted/30"
                                )}
                              >
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={participant.avatar} alt={participant.name} />
                                  <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{participant.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[120px]">Due date</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {item.dueDate || "No due date"}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex items-start gap-4">
                  <span className="text-sm text-muted-foreground w-[120px] pt-1.5">Notes</span>
                  <div className="flex-1">
                    <div className="p-3 bg-muted/30 border border-border rounded-lg min-h-[80px]">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {item.notes || (
                          <span className="text-muted-foreground italic">No notes added</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Created metadata */}
                {(item.createdByName || item.createdAt) && (
                  <div className="flex items-center gap-4 pt-2 border-t border-border mt-4">
                    <span className="text-sm text-muted-foreground w-[120px]">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {item.createdByName && `by ${item.createdByName}`}
                      {item.createdByName && item.createdAt && " · "}
                      {item.createdAt}
                    </span>
                  </div>
                )}
              </div>

              {/* Origin Section */}
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Created in</span>
                </div>
                
                <div className="space-y-1.5 mb-4">
                  {/* Meeting series name */}
                  <p className="text-sm text-foreground font-medium">
                    {item.meetingSeriesName}
                  </p>
                  
                  {/* Meeting instance date */}
                  <p className="text-sm text-muted-foreground">
                    {item.meetingInstanceDate}
                  </p>
                  
                  {/* Agenda item title or fallback */}
                  <p className="text-sm text-muted-foreground">
                    {originDisplay.type === "transcript" && (
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {originDisplay.itemLabel}
                      </span>
                    )}
                    {originDisplay.type === "deleted" && (
                      <span className="text-amber-600 italic">{originDisplay.itemLabel}</span>
                    )}
                    {originDisplay.type === "agenda" && (
                      <span>Agenda: {originDisplay.itemLabel}</span>
                    )}
                    {originDisplay.type === "unknown" && (
                      <span className="italic">{originDisplay.itemLabel}</span>
                    )}
                  </p>
                </div>

                {/* Open source button */}
                <button
                  onClick={handleOpenSource}
                  disabled={!originDisplay.canNavigate}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    originDisplay.canNavigate
                      ? "bg-cyan text-white hover:bg-cyan/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open source
                </button>
              </div>
            </div>

            {/* Comment Input */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 overflow-hidden shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-700">U</span>
                </div>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2.5 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-all"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
