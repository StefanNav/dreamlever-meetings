"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsRight, Paperclip, Link2, MoreHorizontal, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FutureItem } from "@/lib/department-data";

interface FutureItemDrawerProps {
  item: FutureItem | null;
  meetingName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FutureItemDrawer({ item, meetingName = "Operations", isOpen, onClose }: FutureItemDrawerProps) {
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

  if (!item) return null;

  const initials = item.createdBy.name
    .split(" ")
    .map((n) => n[0])
    .join("");

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
            <div className="flex items-center justify-between px-4 py-4">
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Close drawer"
              >
                <ChevronsRight className="w-[18px] h-[18px] text-muted-foreground" />
              </button>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-md hover:bg-muted transition-colors">
                  <Paperclip className="w-[18px] h-[18px] text-muted-foreground" />
                </button>
                <button className="p-2 rounded-md hover:bg-muted transition-colors">
                  <Link2 className="w-[18px] h-[18px] text-muted-foreground" />
                </button>
                <button className="p-2 rounded-md hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-[18px] h-[18px] text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6">
              {/* Title */}
              <h2 className="text-2xl font-medium text-foreground mb-6">
                {item.title}
              </h2>

              {/* Fields */}
              <div className="space-y-4 mb-8">
                {/* Created by */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[152px]">Created by</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={item.createdBy.avatar} alt={item.createdBy.name} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{item.createdBy.name}</span>
                  </div>
                </div>

                {/* Time allocated */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[152px]">Time allocated</span>
                  <span className="text-sm text-foreground">{item.timeAllocated}</span>
                </div>

                {/* Meeting */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[152px]">Meeting</span>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded-full border border-border">
                      {meetingName}
                    </span>
                    <button className="flex items-center gap-1 px-3 py-0.5 text-sm text-muted-foreground bg-white border border-[#cff9fe] rounded-lg">
                      <span>Future items</span>
                      <ChevronDown className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description of Item */}
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">
                  Description of Item
                </label>
                <div className="p-2 bg-[#f5feff] border border-[#f5feff] rounded-lg min-h-[56px]">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">
                  Notes
                </label>
                <div className="p-2 bg-[#f5feff] border border-[#f5feff] rounded-lg min-h-[56px]">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {item.notes || ""}
                  </p>
                </div>
              </div>

              {/* Action Items */}
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">
                  Action Items
                </label>
                {item.actionItems && item.actionItems.length > 0 ? (
                  <ul className="space-y-2">
                    {item.actionItems.map((actionItem, index) => (
                      <li key={index} className="text-sm text-foreground">
                        {actionItem}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Add item...
                  </button>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="px-6 py-4 bg-[#f5feff] rounded-bl-[14px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">U</span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Comment..."
                  className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#ecfdff] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-all"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
