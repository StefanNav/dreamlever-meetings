"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingSpotlightProps {
  id: string; // Unique ID for localStorage persistence
  title: string;
  description: string;
  targetRef: React.RefObject<HTMLElement | null>;
  children?: ReactNode;
  onDismiss?: () => void;
}

export function OnboardingSpotlight({
  id,
  title,
  description,
  targetRef,
  onDismiss,
}: OnboardingSpotlightProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Check if user has already seen this onboarding
    const hasSeenKey = `onboarding_seen_${id}`;
    const hasSeen = localStorage.getItem(hasSeenKey);

    if (!hasSeen) {
      // Small delay to ensure the target element is rendered
      const timer = setTimeout(() => {
        setIsVisible(true);
        updatePosition();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id]);

  useEffect(() => {
    if (isVisible && targetRef.current) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isVisible, targetRef]);

  const updatePosition = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 12,
        left: rect.left + window.scrollX,
      });
    }
  };

  const handleDismiss = () => {
    const hasSeenKey = `onboarding_seen_${id}`;
    localStorage.setItem(hasSeenKey, "true");
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleDismiss}
          />

          {/* Spotlight card */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-50 w-80 bg-white rounded-lg shadow-xl border border-border"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-border rotate-45" />

            <div className="relative p-4">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Content */}
              <h3 className="text-sm font-semibold text-foreground mb-2 pr-6">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {description}
              </p>

              {/* Action buttons */}
              <div className="flex justify-end">
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan rounded-lg hover:bg-cyan/90 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to check if onboarding has been seen
export function useHasSeenOnboarding(id: string): boolean {
  const [hasSeen, setHasSeen] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    const hasSeenKey = `onboarding_seen_${id}`;
    const seen = localStorage.getItem(hasSeenKey);
    setHasSeen(!!seen);
  }, [id]);

  return hasSeen;
}
