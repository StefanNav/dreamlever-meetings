"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook for responsive breakpoint detection
 * Handles SSR safely with initial undefined state
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener("change", handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  // Return false during SSR to avoid hydration mismatch
  if (!mounted) {
    return false;
  }

  return matches;
}

/**
 * Convenience hook for detecting mobile viewport
 * Uses Tailwind's md breakpoint (768px)
 */
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

/**
 * Convenience hook for detecting desktop viewport
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
