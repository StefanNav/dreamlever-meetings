"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ============================================================================
// DESIGN TOKENS - Reusable style values for the folder card
// ============================================================================

export const folderDesignTokens = {
  // Paper styling
  paper: {
    background: "#faf9f7", // Warm off-white
    borderRadius: "8px",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
    shadowHover: "0 8px 20px -4px rgba(0, 0, 0, 0.12), 0 4px 8px -4px rgba(0, 0, 0, 0.08)",
  },
  // Front folder styling
  front: {
    borderRadius: "14px",
    rimHighlight: "inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    shadow: "0 4px 12px -2px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.08)",
    shadowHover: "0 20px 40px -8px rgba(0, 0, 0, 0.2), 0 8px 16px -4px rgba(0, 0, 0, 0.12)",
  },
  // Back folder styling
  back: {
    darkenAmount: 0.06, // 6% darker than front
    shadow: "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
  },
  // Crease shadow between paper and front folder
  crease: {
    shadow: "0 -2px 4px -1px rgba(0, 0, 0, 0.08)",
  },
  // Avatar styling
  avatar: {
    size: 24,
    overlap: -8,
    pillBackground: "rgba(0, 0, 0, 0.15)",
    pillPadding: "2px 4px 2px 6px",
    pillBorderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
};

// Color configuration with desaturated variants and gradients
const colorVariants = {
  purple: {
    front: "#7161d1",        // Desaturated ~18%
    frontGradient: "linear-gradient(180deg, #7d6dd9 0%, #6555c4 100%)",
    back: "#655ab8",         // 6% darker
    backGradient: "linear-gradient(180deg, #7161d1 0%, #5a4faa 100%)",
  },
  blue: {
    front: "#4a8fd4",        // Desaturated ~15%
    frontGradient: "linear-gradient(180deg, #5599dc 0%, #4085c8 100%)",
    back: "#4280c0",         // 6% darker
    backGradient: "linear-gradient(180deg, #4a8fd4 0%, #3a75b0 100%)",
  },
  green: {
    front: "#2eb08a",        // Desaturated ~15%
    frontGradient: "linear-gradient(180deg, #38ba94 0%, #26a07c 100%)",
    back: "#289a78",         // 6% darker
    backGradient: "linear-gradient(180deg, #2eb08a 0%, #1f8a6a 100%)",
  },
  orange: {
    front: "#e5a033",        // Desaturated ~12%
    frontGradient: "linear-gradient(180deg, #eba83d 0%, #d89428 100%)",
    back: "#d1922b",         // 6% darker
    backGradient: "linear-gradient(180deg, #e5a033 0%, #c58520 100%)",
  },
  pink: {
    front: "#d85a94",        // Desaturated ~15%
    frontGradient: "linear-gradient(180deg, #e0659e 0%, #cc4f88 100%)",
    back: "#c84f86",         // 6% darker
    backGradient: "linear-gradient(180deg, #d85a94 0%, #b8447a 100%)",
  },
  yellow: {
    front: "#d4a024",        // Amber/gold
    frontGradient: "linear-gradient(180deg, #e0ab2e 0%, #c4941e 100%)",
    back: "#b8901c",         // 6% darker
    backGradient: "linear-gradient(180deg, #d4a024 0%, #a88218 100%)",
  },
} as const;

type ColorVariant = keyof typeof colorVariants;

interface FolderAgendaCardProps {
  departmentLabel: string;
  agendaTitle?: string;
  agendaItems: string[];
  count: number;
  avatars: Array<{ id: string; name: string; avatar?: string }>;
  href?: string;
  color?: ColorVariant;
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

// SVG Folder Back Shape - cleaner tab with flatter top and smoother transitions
function FolderBackShape({ gradient }: { gradient: string }) {
  return (
    <svg
      viewBox="0 0 372 197"
      fill="none"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`backGrad-${gradient.replace(/[^a-z0-9]/gi, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.08)' }} />
          <stop offset="100%" style={{ stopColor: 'rgba(0,0,0,0.04)' }} />
        </linearGradient>
      </defs>
      {/* Cleaner tab shape - flatter top, manufactured feel */}
      <path
        d="M0 18C0 8.059 8.059 0 18 0H92C98 0 103 2 106 7L116 24C120 30 126 34 134 34H354C363.941 34 372 42.059 372 52V179C372 188.941 363.941 197 354 197H18C8.059 197 0 188.941 0 179V18Z"
        fill="url(#backGradFill)"
        style={{ fill: gradient }}
      />
      {/* Gradient overlay for depth */}
      <path
        d="M0 18C0 8.059 8.059 0 18 0H92C98 0 103 2 106 7L116 24C120 30 126 34 134 34H354C363.941 34 372 42.059 372 52V179C372 188.941 363.941 197 354 197H18C8.059 197 0 188.941 0 179V18Z"
        fill={`url(#backGrad-${gradient.replace(/[^a-z0-9]/gi, '')})`}
      />
    </svg>
  );
}

export function FolderAgendaCard({
  departmentLabel,
  agendaTitle = "Agenda Items",
  agendaItems,
  count,
  avatars,
  href = "#",
  color = "purple",
  className,
}: FolderAgendaCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const scrollStartRef = useRef(0);
  
  const colorConfig = colorVariants[color];
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
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7161d1]",
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
        {/* Folder Back Body - darker with gradient */}
        <div 
          className="absolute top-0 left-0 right-0 h-[197px]"
          style={{
            filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))"
          }}
        >
          <FolderBackShape gradient={colorConfig.back} />
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
              <h4 className="text-[15px] font-medium text-[#7a7a7a] leading-[19px] tracking-[-0.23px]">
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
                      <span className="text-[#b0b0b0] shrink-0">•</span>
                      <span className="text-[#4a4a4a]">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          </motion.div>
        </div>

        {/* Front Folder Panel - gradient with rim highlight */}
        <div 
          className="absolute top-[95px] left-0 right-0 h-[126px]"
          style={{ perspective: 800, zIndex: 10 }}
        >
          <motion.div
            className="w-full h-full relative overflow-hidden"
            variants={activeFrontVariants}
            style={{ 
              transformOrigin: "top center",
              background: colorConfig.frontGradient,
              borderRadius: folderDesignTokens.front.borderRadius,
              border: folderDesignTokens.front.border,
            }}
          >
            {/* Top rim highlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.25) 80%, transparent 100%)",
                borderRadius: `${folderDesignTokens.front.borderRadius} ${folderDesignTokens.front.borderRadius} 0 0`
              }}
            />
            
            {/* Inner shadow for depth */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 -20px 30px -20px rgba(0,0,0,0.1)",
                borderRadius: folderDesignTokens.front.borderRadius,
              }}
            />

            {/* Folder Content */}
            <div className="absolute top-[20px] left-[18px] right-[18px] bottom-[16px] flex flex-col justify-between">
              <h3 className="text-[19px] font-semibold text-white leading-[19px] drop-shadow-sm">
                {departmentLabel}
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-[14px] text-white/85 leading-[20px]">
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
                          <AvatarFallback className="bg-[#5c6370] text-white text-[9px] font-semibold">
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
                        className="relative rounded-full bg-[#4a5260] flex items-center justify-center"
                        style={{ 
                          marginLeft: `${folderDesignTokens.avatar.overlap}px`,
                          width: `${folderDesignTokens.avatar.size}px`,
                          height: `${folderDesignTokens.avatar.size}px`,
                          zIndex: maxDisplayAvatars + 1,
                          border: folderDesignTokens.avatar.border,
                          boxShadow: folderDesignTokens.avatar.shadow,
                        }}
                      >
                        <span className="text-[9px] font-semibold text-white/90">
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
