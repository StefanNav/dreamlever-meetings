"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useIsMobile } from "@/hooks/use-media-query";

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";

interface SidebarContextValue {
  /** Whether the sidebar is expanded (desktop) or open (mobile) */
  isExpanded: boolean;
  /** Whether we're on a mobile viewport */
  isMobile: boolean;
  /** Toggle the sidebar expanded/collapsed state */
  toggleSidebar: () => void;
  /** Set the sidebar state directly */
  setExpanded: (expanded: boolean) => void;
  /** Close the sidebar (used for mobile after navigation) */
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
  /** Default expanded state for desktop (default: true) */
  defaultExpanded?: boolean;
}

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [mounted, setMounted] = useState(false);

  // Load persisted preference on mount (desktop only)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored !== null) {
        setIsExpanded(stored === "true");
      }
    }
  }, []);

  // On mobile, sidebar should start closed
  useEffect(() => {
    if (mounted && isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile, mounted]);

  // Persist preference to localStorage (desktop only)
  const persistExpanded = useCallback((expanded: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(expanded));
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (!isMobile) {
        persistExpanded(next);
      }
      return next;
    });
  }, [isMobile, persistExpanded]);

  const setExpanded = useCallback(
    (expanded: boolean) => {
      setIsExpanded(expanded);
      if (!isMobile) {
        persistExpanded(expanded);
      }
    },
    [isMobile, persistExpanded]
  );

  const closeSidebar = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobile,
        toggleSidebar,
        setExpanded,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
