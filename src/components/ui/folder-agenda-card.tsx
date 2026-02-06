"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ============================================================================
// DESIGN TOKENS - Reusable style values for the folder card
// References CSS variables from globals.css for theme-awareness.
// ============================================================================

export const folderDesignTokens = {
  paper: {
    background: "var(--surface)",
    borderRadius: "8px",
    border: "1px solid var(--folder-paper-border)",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
    shadowHover: "0 8px 20px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -4px rgba(0, 0, 0, 0.08)",
  },
  front: {
    background: "linear-gradient(180deg, #FFF 0%, #D2D2D2 100%)",
    borderRadius: "14px",
    border: "2px solid var(--border-light)",
    shadow: "0 4px 4px 0 rgba(63, 140, 156, 0.19)",
    shadowHover: "0 20px 40px -8px rgba(63, 140, 156, 0.25), 0 8px 16px -4px rgba(63, 140, 156, 0.15)",
  },
  back: {
    background: "linear-gradient(180deg, #FFF 0%, var(--text-secondary) 100%)",
  },
  avatar: {
    size: 24,
    overlap: -8,
    border: "1px solid rgba(255, 255, 255, 0.5)",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
};

interface FolderAgendaCardProps {
  departmentLabel: string;
  agendaTitle?: string;
  agendaItems: string[];
  count: number;
  avatars: Array<{ id: string; name: string; avatar?: string }>;
  cadence?: string;
  href?: string;
  className?: string;
}

// Spring configurations for natural, physics-based motion
const springConfig = {
  front: { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 },
  paper: { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.8 },
  list: { type: "spring" as const, stiffness: 500, damping: 20, mass: 0.5 },
  container: { type: "spring" as const, stiffness: 400, damping: 30 },
};

// Animation variants
const frontPanelVariants: Variants = {
  closed: { 
    rotateX: 0,
    boxShadow: folderDesignTokens.front.shadow,
    transition: springConfig.front
  },
  open: { 
    rotateX: -18,
    boxShadow: folderDesignTokens.front.shadowHover,
    transition: springConfig.front
  }
};

const paperVariants: Variants = {
  closed: { 
    y: 0,
    boxShadow: folderDesignTokens.paper.shadow,
    transition: springConfig.paper
  },
  open: { 
    y: -115,
    boxShadow: folderDesignTokens.paper.shadowHover,
    transition: {
      ...springConfig.paper,
      delay: 0.05
    }
  }
};

const listContainerVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.1 }
  },
  open: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.04,
      delayChildren: 0.15,
      duration: 0.2
    } 
  }
};

const listItemVariants: Variants = {
  closed: { opacity: 0, x: -12, y: 4 },
  open: { 
    opacity: 1, 
    x: 0,
    y: 0,
    transition: springConfig.list
  }
};

const containerVariants: Variants = {
  idle: { 
    zIndex: 1,
    transition: springConfig.container 
  },
  hover: { 
    zIndex: 50,
    transition: springConfig.container 
  }
};

// Reduced motion variants
const reducedMotionFrontVariants: Variants = {
  closed: { opacity: 1 },
  open: { opacity: 1 }
};

const reducedMotionPaperVariants: Variants = {
  closed: { y: 0 },
  open: { y: -115, transition: { duration: 0.15 } }
};

const reducedMotionContainerVariants: Variants = {
  idle: { zIndex: 1 },
  hover: { zIndex: 50 }
};

// SVG Folder Back Shape with gradient fill and border
function FolderBackShape() {
  const pathData = "M0 26C0 16.059 8.059 8 18 8H170C178 8 184 10 188 16L198 32C202 38 208 42 216 42H354C363.941 42 372 50.059 372 60V179C372 188.941 363.941 197 354 197H18C8.059 197 0 188.941 0 179V26Z";
  
  return (
    <svg
      viewBox="0 0 372 197"
      fill="none"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="backFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFF' }} />
          <stop offset="100%" style={{ stopColor: '#6D9097' }} />
        </linearGradient>
        <linearGradient id="backBorder" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#E7F8FA' }} />
          <stop offset="43%" style={{ stopColor: '#ABE5F1' }} />
          <stop offset="100%" style={{ stopColor: '#E7F8FA' }} />
        </linearGradient>
      </defs>
      <path d={pathData} fill="url(#backFill)" />
      <path d={pathData} stroke="url(#backBorder)" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function FolderAgendaCard({
  departmentLabel,
  agendaTitle = "Agenda Items",
  agendaItems,
  count,
  avatars,
  cadence,
  href = "#",
  className,
}: FolderAgendaCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const scrollStartRef = useRef(0);
  
  const maxDisplayAvatars = 3;
  const displayAvatars = avatars.slice(0, maxDisplayAvatars);
  const remainingAvatars = avatars.length - maxDisplayAvatars;

  // Reset scroll to top when hovering
  useEffect(() => {
    if (isHovered && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isHovered]);

  const handleTap = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const activeFrontVariants = shouldReduceMotion ? reducedMotionFrontVariants : frontPanelVariants;
  const activePaperVariants = shouldReduceMotion ? reducedMotionPaperVariants : paperVariants;
  const activeContainerVariants = shouldReduceMotion ? reducedMotionContainerVariants : containerVariants;

  const cardContent = (
    <motion.div
      className={cn(
        "relative w-full max-w-[372px] h-[221px] cursor-pointer outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-folder-focus-ring",
        className
      )}
      initial="idle"
      whileHover="hover"
      whileFocus="hover"
      variants={activeContainerVariants}
      onTap={handleTap}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      role="article"
      aria-label={`${departmentLabel} folder with ${count} agenda items`}
      tabIndex={0}
    >
      <motion.div
        className="relative w-full h-full overflow-visible"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        whileHover="open"
        whileFocus="open"
      >
        {/* Folder Back Body */}
        <div className="absolute top-0 left-0 right-0 h-[197px] z-0">
          <FolderBackShape />
        </div>

        {/* Paper clip container - clips bottom but allows overflow on top */}
        <div 
          className="absolute left-0 right-0"
          style={{
            top: "-120px",
            bottom: "30px",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* Paper Panel - warm off-white with subtle styling */}
          <motion.div
            className="absolute left-[18px] right-[18px] overflow-hidden"
            variants={activePaperVariants}
            style={{ 
              top: "168px",
              transformOrigin: "bottom center",
              zIndex: 5,
              height: "200px",
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
              background: folderDesignTokens.paper.background,
              borderRadius: folderDesignTokens.paper.borderRadius,
              border: folderDesignTokens.paper.border,
              pointerEvents: "auto",
            }}
          >
          {/* Crease shadow at top of paper */}
          <div 
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 100%)"
            }}
          />
          
          <div className="px-[18px] pt-[16px] pb-[24px] h-full flex flex-col">
            <div className="mb-[12px] shrink-0 pb-[10px] border-b border-gray-200/80">
              <h4 className="text-[15px] font-medium text-folder-agenda-title leading-[19px] tracking-[-0.23px]">
                {agendaTitle}
              </h4>
            </div>
            
            <motion.div 
              className="flex-1 overflow-hidden"
              variants={listContainerVariants}
            >
              {/* Scrollable container with drag-to-scroll */}
              <div
                ref={scrollContainerRef}
                className="h-full overflow-y-auto scrollbar-thin pr-1 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={(e) => {
                  isDraggingRef.current = true;
                  startYRef.current = e.clientY;
                  scrollStartRef.current = scrollContainerRef.current?.scrollTop || 0;
                  e.currentTarget.style.cursor = 'grabbing';
                }}
                onMouseMove={(e) => {
                  if (!isDraggingRef.current || !scrollContainerRef.current) return;
                  const deltaY = startYRef.current - e.clientY;
                  scrollContainerRef.current.scrollTop = scrollStartRef.current + deltaY;
                }}
                onMouseUp={(e) => {
                  isDraggingRef.current = false;
                  e.currentTarget.style.cursor = 'grab';
                }}
                onMouseLeave={(e) => {
                  isDraggingRef.current = false;
                  e.currentTarget.style.cursor = 'grab';
                }}
              >
                {/* Large bottom padding allows last item to scroll nearly to top */}
                <ul className="space-y-[4px] pb-[120px]">
                  {agendaItems.map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-[8px] text-[14px] leading-[20px] tracking-[-0.15px]"
                      variants={listItemVariants}
                    >
                      <span className="text-folder-agenda-bullet shrink-0">•</span>
                      <span className="text-folder-agenda-text">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          </motion.div>
        </div>

        {/* Front Folder Panel */}
        <div 
          className="absolute top-[95px] left-0 right-0 h-[126px]"
          style={{ perspective: 800, zIndex: 10 }}
        >
          <motion.div
            className="w-full h-full relative overflow-hidden"
            variants={activeFrontVariants}
            style={{ 
              transformOrigin: "top center",
              background: folderDesignTokens.front.background,
              borderRadius: folderDesignTokens.front.borderRadius,
              border: folderDesignTokens.front.border,
            }}
          >
            {/* Top highlight line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />

            {/* Folder Content */}
            <div className="absolute top-[20px] left-[18px] right-[18px] bottom-[16px] flex flex-col justify-between pointer-events-none">
              <div>
                <h3 className="text-[19px] font-semibold text-gray-800 leading-[19px]">
                  {departmentLabel}
                </h3>
                {cadence && (
                  <p className="text-[12px] text-gray-500 leading-[16px] mt-1">
                    {cadence}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[14px] text-gray-600 font-medium leading-[20px]">
                  {count} {count === 1 ? "item" : "items"}
                </span>

                {/* Avatar Stack */}
                <div className="flex items-center">
                  <div className="flex items-center">
                    {displayAvatars.map((avatar, index) => (
                      <div
                        key={avatar.id}
                        className="relative rounded-full overflow-hidden"
                        style={{ 
                          zIndex: index + 1,
                          marginLeft: index > 0 ? `${folderDesignTokens.avatar.overlap}px` : "0",
                          width: `${folderDesignTokens.avatar.size}px`,
                          height: `${folderDesignTokens.avatar.size}px`,
                          border: folderDesignTokens.avatar.border,
                          boxShadow: folderDesignTokens.avatar.shadow,
                        }}
                      >
                        <Avatar className="w-full h-full">
                          <AvatarImage 
                            src={avatar.avatar} 
                            alt={avatar.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-slate-400 text-white text-[9px] font-semibold">
                            {avatar.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                    {remainingAvatars > 0 && (
                      <div 
                        className="relative rounded-full bg-text-secondary flex items-center justify-center"
                        style={{ 
                          marginLeft: `${folderDesignTokens.avatar.overlap}px`,
                          width: `${folderDesignTokens.avatar.size}px`,
                          height: `${folderDesignTokens.avatar.size}px`,
                          zIndex: maxDisplayAvatars + 1,
                          border: folderDesignTokens.avatar.border,
                        }}
                      >
                        <span className="text-[9px] font-semibold text-white">
                          +{remainingAvatars}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (href && href !== "#") {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
