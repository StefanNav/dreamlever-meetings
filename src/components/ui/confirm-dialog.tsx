"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scaleDialog } from "@/lib/animation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when dialog opens
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when dialog is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={scaleDialog}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={scaleDialog}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              {/* Icon */}
              {variant === "danger" && (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              )}

              {/* Title */}
              <h2
                id="confirm-dialog-title"
                className="text-lg font-semibold text-foreground mb-2"
              >
                {title}
              </h2>

              {/* Description */}
              <p
                id="confirm-dialog-description"
                className="text-sm text-muted-foreground mb-6"
              >
                {description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  ref={cancelButtonRef}
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  ref={confirmButtonRef}
                  variant={variant === "danger" ? "destructive" : "default"}
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
