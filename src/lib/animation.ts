import type { Transition, Variants } from "framer-motion";

// ============================================================================
// Shared Animation Constants
// Centralized motion configs consumed by Framer Motion components.
// ============================================================================

// ── Transition presets ──

/** Standard spring for drawers and slide-in panels */
export const springDrawer: Transition = {
  type: "spring",
  damping: 30,
  stiffness: 300,
};

/** Quick fade for backdrops and overlays */
export const fadeFast: Transition = {
  duration: 0.2,
};

/** Quick scale/fade for dialogs and modals */
export const scaleDialog: Transition = {
  duration: 0.15,
};

/** Smooth expand/collapse for accordions and expandable sections */
export const expandCollapse: Transition = {
  duration: 0.2,
  ease: "easeInOut",
};

// ── Variant presets ──

/** Fade-in backdrop overlay */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Slide-in from right (drawers) */
export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

/** Slide-in from left (side panels) */
export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

/** Scale + fade dialog entrance */
export const dialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/** Height expand/collapse for accordion content */
export const expandVariants: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};
