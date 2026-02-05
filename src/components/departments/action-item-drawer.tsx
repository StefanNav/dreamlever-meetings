"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, parse, isBefore, startOfDay } from "date-fns";
import { navigateToSource } from "@/lib/source-locator";
import { 
  ChevronsRight, 
  Check, 
  Circle, 
  ChevronDown, 
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Loader2,
  X,
  AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ActionItem, ActionItemStatus, Participant } from "@/lib/department-data";
import { cn } from "@/lib/utils";

interface ActionItemDrawerProps {
  item: ActionItem | null;
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onUpdateActionItem?: (id: string, updates: Partial<ActionItem>) => Promise<void>;
  onDeleteActionItem?: (id: string) => Promise<void>;
}

// Status options for dropdown
const STATUS_OPTIONS: { value: ActionItemStatus; label: string; icon: React.ReactNode; colors: string }[] = [
  { 
    value: "incomplete", 
    label: "Incomplete", 
    icon: <Circle className="w-4 h-4" />,
    colors: "bg-amber-50 text-amber-700 border-amber-200"
  },
  { 
    value: "in_progress", 
    label: "In progress", 
    icon: <Loader2 className="w-4 h-4" />,
    colors: "bg-blue-50 text-blue-700 border-blue-200"
  },
  { 
    value: "complete", 
    label: "Complete", 
    icon: <Check className="w-4 h-4" />,
    colors: "bg-green-50 text-green-700 border-green-200"
  },
];

export function ActionItemDrawer({ 
  item, 
  isOpen, 
  onClose, 
  participants,
  onUpdateActionItem,
  onDeleteActionItem,
}: ActionItemDrawerProps) {
  const router = useRouter();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Local state for optimistic updates
  const [localStatus, setLocalStatus] = useState<ActionItemStatus>("incomplete");
  const [localAssignee, setLocalAssignee] = useState<ActionItem["assignee"]>(null);
  const [localDueDate, setLocalDueDate] = useState<string | undefined>(undefined);
  const [localNotes, setLocalNotes] = useState<string>("");
  
  // Refs for focus management
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize local state when item changes
  useEffect(() => {
    if (item) {
      setLocalStatus(item.status);
      setLocalAssignee(item.assignee);
      setLocalDueDate(item.dueDate);
      setLocalNotes(item.notes || "");
    }
  }, [item]);

  // Focus status button when drawer opens
  useEffect(() => {
    if (isOpen && statusButtonRef.current) {
      setTimeout(() => statusButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

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
        // Don't close drawer if a dialog is open
        if (isDeleteDialogOpen) return;
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isDeleteDialogOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!isAssigneeDropdownOpen && !isOverflowMenuOpen && !isStatusDropdownOpen) return;
    const handleClick = () => {
      setIsAssigneeDropdownOpen(false);
      setIsOverflowMenuOpen(false);
      setIsStatusDropdownOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isAssigneeDropdownOpen, isOverflowMenuOpen, isStatusDropdownOpen]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Handle status change
  const handleStatusChange = useCallback(async (newStatus: ActionItemStatus) => {
    if (!item || newStatus === localStatus) return;
    
    setLocalStatus(newStatus);
    setIsStatusDropdownOpen(false);
    
    try {
      await onUpdateActionItem?.(item.id, { status: newStatus });
    } catch {
      // Rollback on error
      setLocalStatus(item.status);
      console.error("Failed to update status");
    }
  }, [item, localStatus, onUpdateActionItem]);

  // Handle assignee change
  const handleAssigneeChange = useCallback(async (newAssignee: ActionItem["assignee"]) => {
    if (!item) return;
    
    const previousAssignee = localAssignee;
    setLocalAssignee(newAssignee);
    setIsAssigneeDropdownOpen(false);
    
    try {
      await onUpdateActionItem?.(item.id, { assignee: newAssignee });
    } catch {
      // Rollback on error
      setLocalAssignee(previousAssignee);
      console.error("Failed to update assignee");
    }
  }, [item, localAssignee, onUpdateActionItem]);

  // Handle due date change
  const handleDueDateChange = useCallback(async (date: Date | undefined) => {
    if (!item) return;
    
    const previousDueDate = localDueDate;
    const newDueDate = date ? format(date, "MMM d, yyyy") : undefined;
    setLocalDueDate(newDueDate);
    setIsDatePickerOpen(false);
    
    try {
      await onUpdateActionItem?.(item.id, { dueDate: newDueDate });
    } catch {
      // Rollback on error
      setLocalDueDate(previousDueDate);
      console.error("Failed to update due date");
    }
  }, [item, localDueDate, onUpdateActionItem]);

  // Handle notes change with debounce
  const handleNotesChange = useCallback((newNotes: string) => {
    setLocalNotes(newNotes);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce save
    saveTimeoutRef.current = setTimeout(async () => {
      if (!item) return;
      
      try {
        await onUpdateActionItem?.(item.id, { notes: newNotes });
      } catch {
        console.error("Failed to save notes");
      }
    }, 500);
  }, [item, onUpdateActionItem]);

  // Handle notes blur (immediate save)
  const handleNotesBlur = useCallback(async () => {
    if (!item) return;
    
    // Clear debounce timeout and save immediately
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (localNotes !== (item.notes || "")) {
      try {
        await onUpdateActionItem?.(item.id, { notes: localNotes });
      } catch {
        console.error("Failed to save notes");
      }
    }
  }, [item, localNotes, onUpdateActionItem]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!item) return;
    
    setIsDeleting(true);
    try {
      await onDeleteActionItem?.(item.id);
      setIsDeleteDialogOpen(false);
      onClose();
    } catch {
      console.error("Failed to delete action item");
    } finally {
      setIsDeleting(false);
    }
  }, [item, onDeleteActionItem, onClose]);

  // Auto-expand textarea
  const autoExpandTextarea = useCallback(() => {
    if (notesTextareaRef.current) {
      notesTextareaRef.current.style.height = "auto";
      notesTextareaRef.current.style.height = `${notesTextareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    autoExpandTextarea();
  }, [localNotes, autoExpandTextarea]);

  // Parse due date for calendar
  const parseDueDate = useCallback((dateStr: string | undefined): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      return parse(dateStr, "MMM d, yyyy", new Date());
    } catch {
      return undefined;
    }
  }, []);

  // Check if due date is in the past
  const isDueDatePast = useCallback((dateStr: string | undefined): boolean => {
    if (!dateStr) return false;
    const parsed = parseDueDate(dateStr);
    if (!parsed) return false;
    return isBefore(parsed, startOfDay(new Date()));
  }, [parseDueDate]);

  if (!item) return null;

  const assigneeInitials = localAssignee
    ? localAssignee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";

  const isComplete = localStatus === "complete";
  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === localStatus) || STATUS_OPTIONS[0];

  // Handle "Open source" navigation
  const handleOpenSource = () => {
    // Close the drawer first
    onClose();

    // Navigate to the source using the utility
    navigateToSource(
      {
        meetingSeriesId: item.meetingSeriesId,
        meetingInstanceId: item.meetingInstanceId,
        agendaItemId: item.agendaItemId,
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
                {/* Overflow Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOverflowMenuOpen(!isOverflowMenuOpen);
                    }}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    aria-label="More options"
                    aria-haspopup="true"
                    aria-expanded={isOverflowMenuOpen}
                  >
                    <MoreHorizontal className="w-[18px] h-[18px] text-muted-foreground" />
                  </button>
                  
                  {isOverflowMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOverflowMenuOpen(false);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete action item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Title */}
              <h2 className={cn(
                "text-xl font-medium mb-6 transition-opacity",
                isComplete ? "text-foreground/60" : "text-foreground"
              )}>
                {item.title}
              </h2>

              {/* Task Controls Section */}
              <div className={cn(
                "space-y-4 mb-8 transition-opacity",
                isComplete ? "opacity-80" : "opacity-100"
              )}>
                {/* Status - Dropdown */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[120px]">Status</span>
                  <div className="relative">
                    <button
                      ref={statusButtonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsStatusDropdownOpen(!isStatusDropdownOpen);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                        currentStatusOption.colors
                      )}
                      aria-haspopup="listbox"
                      aria-expanded={isStatusDropdownOpen}
                    >
                      {currentStatusOption.icon}
                      {currentStatusOption.label}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>

                    {/* Status Dropdown */}
                    {isStatusDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-44 bg-white border border-border rounded-lg shadow-lg z-20"
                        role="listbox"
                      >
                        <div className="p-1">
                          {STATUS_OPTIONS.map((option) => {
                            const isSelected = localStatus === option.value;
                            return (
                              <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={cn(
                                  "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted/50 transition-colors",
                                  isSelected && "bg-muted/30"
                                )}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <span className={cn(
                                  "flex items-center justify-center w-5 h-5 rounded-full",
                                  option.value === "complete" && "text-green-600",
                                  option.value === "in_progress" && "text-blue-600",
                                  option.value === "incomplete" && "text-amber-600"
                                )}>
                                  {option.icon}
                                </span>
                                <span>{option.label}</span>
                                {isSelected && <Check className="w-4 h-4 ml-auto text-cyan" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
                      aria-haspopup="listbox"
                      aria-expanded={isAssigneeDropdownOpen}
                    >
                      {localAssignee ? (
                        <>
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={localAssignee.avatar} alt={localAssignee.name} />
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">
                              {assigneeInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-foreground">{localAssignee.name}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssigneeChange(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                e.preventDefault();
                                handleAssigneeChange(null);
                              }
                            }}
                            className="ml-1 p-0.5 rounded-full hover:bg-muted cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label="Clear assignee"
                          >
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {/* Assignee Dropdown */}
                    {isAssigneeDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-56 bg-white border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
                        role="listbox"
                      >
                        <div className="p-2">
                          <p className="text-xs text-muted-foreground px-2 py-1">Select assignee</p>
                          {/* Unassigned option */}
                          <button
                            onClick={() => handleAssigneeChange(null)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted/50",
                              !localAssignee && "bg-muted/30"
                            )}
                            role="option"
                            aria-selected={!localAssignee}
                          >
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                              <Circle className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <span className="text-muted-foreground">Unassigned</span>
                          </button>
                          {participants.map((participant) => {
                            const initials = participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("");
                            const isSelected = localAssignee?.id === participant.id;
                            return (
                              <button
                                key={participant.id}
                                onClick={() => handleAssigneeChange({
                                  id: participant.id,
                                  name: participant.name,
                                  avatar: participant.avatar,
                                })}
                                className={cn(
                                  "w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted/50",
                                  isSelected && "bg-muted/30"
                                )}
                                role="option"
                                aria-selected={isSelected}
                              >
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={participant.avatar} alt={participant.name} />
                                  <AvatarFallback className="bg-purple-100 text-purple-700 text-[10px]">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{participant.name}</span>
                                {isSelected && <Check className="w-4 h-4 ml-auto text-cyan" />}
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
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className={cn(
                          "text-sm",
                          localDueDate ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {localDueDate || "No due date"}
                        </span>
                        {localDueDate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDueDateChange(undefined);
                            }}
                            className="ml-1 p-0.5 rounded-full hover:bg-muted"
                            aria-label="Clear due date"
                          >
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={parseDueDate(localDueDate)}
                        onSelect={handleDueDateChange}
                        initialFocus
                      />
                      {localDueDate && (
                        <div className="px-3 pb-3">
                          <button
                            onClick={() => handleDueDateChange(undefined)}
                            className="w-full text-sm text-muted-foreground hover:text-foreground py-2 border-t border-border"
                          >
                            Clear date
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  {/* Past due date hint */}
                  {localDueDate && isDueDatePast(localDueDate) && localStatus !== "complete" && (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Past due
                    </span>
                  )}
                </div>

                {/* Notes */}
                <div className="flex items-start gap-4">
                  <span className="text-sm text-muted-foreground w-[120px] pt-1.5">Notes</span>
                  <div className="flex-1">
                    <textarea
                      ref={notesTextareaRef}
                      value={localNotes}
                      onChange={(e) => {
                        handleNotesChange(e.target.value);
                        autoExpandTextarea();
                      }}
                      onBlur={handleNotesBlur}
                      placeholder="Add notes..."
                      className={cn(
                        "w-full p-3 bg-muted/30 border border-border rounded-lg min-h-[80px] resize-none text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-all",
                        "placeholder:text-muted-foreground/60"
                      )}
                    />
                  </div>
                </div>

                {/* Created metadata */}
                {(item.createdByName || item.createdAt) && (
                  <div className="flex items-center gap-4 pt-2 border-t border-border mt-4">
                    <span className="text-sm text-muted-foreground w-[120px]">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {item.createdByName && `by ${item.createdByName}`}
                      {item.createdByName && item.createdAt && " on "}
                      {item.createdAt}
                    </span>
                  </div>
                )}
              </div>

              {/* Open source button */}
              <button
                onClick={handleOpenSource}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-cyan text-white hover:bg-cyan/90"
              >
                <ExternalLink className="w-4 h-4" />
                Open source
              </button>
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

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            title="Delete this action item?"
            description="This removes the action item but doesn't affect the meeting notes."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            variant="danger"
            isLoading={isDeleting}
          />
        </>
      )}
    </AnimatePresence>
  );
}
