"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronsRight,
  Home,
  Target,
  Calendar,
  Users,
  Settings,
  PanelLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/sidebar-context";
import { NotificationsDrawer } from "./notifications-drawer";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  { label: "Objectives", href: "/objectives", icon: <Target className="w-4 h-4" /> },
  { label: "Meetings", href: "/meetings", icon: <Calendar className="w-4 h-4" /> },
  { label: "People", href: "/people", icon: <Users className="w-4 h-4" /> },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: <Settings className="w-4 h-4" /> },
];

// Mock user data - in real app this would come from auth context
const currentUser = {
  name: "Olivia Rhye",
  email: "olivia@untitledui.com",
  avatar: null,
  initials: "OR",
};

// Logo that transitions to open icon on hover when sidebar is collapsed
function LogoToggle({ isCollapsed }: { isCollapsed: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleSidebar } = useSidebar();

  // Reset hover state when collapsed state changes
  useEffect(() => {
    setIsHovered(false);
  }, [isCollapsed]);

  const handleClick = () => {
    setIsHovered(false); // Reset hover before toggling
    toggleSidebar();
  };

  // When collapsed, the logo is clickable and shows open icon on hover
  if (isCollapsed) {
    return (
      <Tooltip content="Open sidebar" position="right">
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative flex items-center justify-center shrink-0 cursor-pointer"
          aria-label="Open sidebar"
        >
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="icon"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <PanelLeft className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gradient-start to-brand-gradient-end flex items-center justify-center"
              >
                <Image
                  src="/miles-logo.png"
                  alt="Miles"
                  width={16}
                  height={16}
                  className="brightness-0 invert"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </Tooltip>
    );
  }

  // When expanded, show logo and close button side by side with smooth animation
  return (
    <div className="flex items-center justify-between w-full">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gradient-start to-brand-gradient-end flex items-center justify-center shrink-0">
        <Image
          src="/miles-logo.png"
          alt="Miles"
          width={16}
          height={16}
          className="brightness-0 invert"
        />
      </div>
      <Tooltip content="Close sidebar" position="bottom">
        <motion.button
          onClick={handleClick}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Close sidebar"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <PanelLeft className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </Tooltip>
    </div>
  );
}

function NavLink({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}) {
  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-lg text-sm font-medium transition-colors",
        isCollapsed 
          ? "justify-center w-9 h-9 p-0" 
          : "gap-3 px-3 py-2",
        isActive
          ? "bg-cyan-light text-cyan-dark"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      onClick={onClick}
    >
      <span className="shrink-0">{item.icon}</span>
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );

  // Show tooltip only when collapsed
  if (isCollapsed) {
    return (
      <Tooltip content={item.label} position="right">
        {linkContent}
      </Tooltip>
    );
  }

  return linkContent;
}

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  const { isMobile, closeSidebar } = useSidebar();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/meetings") {
      return pathname.startsWith("/meetings") || pathname.startsWith("/departments");
    }
    return pathname.startsWith(href);
  };

  const handleNavClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Logo and Toggle Button */}
      <div
        className={cn(
          "flex items-center py-4",
          isCollapsed ? "justify-center px-1.5" : "px-3"
        )}
      >
        <LogoToggle isCollapsed={isCollapsed} />
      </div>

      {/* Divider */}
      <div className="border-b border-border mx-0" />

      {/* Main Navigation */}
      <nav className={cn("flex-1 py-4", isCollapsed ? "px-1.5" : "px-2")}>
        <ul className={cn("space-y-1", isCollapsed && "flex flex-col items-center")}>
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                isActive={isActiveLink(item.href)}
                isCollapsed={isCollapsed}
                onClick={handleNavClick}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className={cn("pb-4", isCollapsed ? "px-1.5" : "px-2")}>
        {/* Notifications Drawer */}
        <div className={cn("mb-1", isCollapsed && "flex justify-center")}>
          <NotificationsDrawer isCollapsed={isCollapsed} />
        </div>

        {/* Bottom Navigation Items */}
        <ul className={cn("space-y-1 mb-4", isCollapsed && "flex flex-col items-center")}>
          {bottomNavItems.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                isActive={isActiveLink(item.href)}
                isCollapsed={isCollapsed}
                onClick={handleNavClick}
              />
            </li>
          ))}
        </ul>

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center py-2" : "gap-3 px-3 py-2"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shrink-0">
            {currentUser.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <span className="text-xs font-semibold text-white">
                {currentUser.initials}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">
                {currentUser.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {currentUser.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar() {
  const { isExpanded } = useSidebar();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 bg-white border-r border-border z-40 transition-[width] duration-300 ease-in-out"
      style={{
        width: isExpanded
          ? "var(--sidebar-width-expanded)"
          : "var(--sidebar-width-collapsed)",
      }}
    >
      <SidebarContent isCollapsed={!isExpanded} />
    </aside>
  );
}

function MobileSidebar() {
  const { isExpanded, closeSidebar } = useSidebar();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        closeSidebar();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isExpanded, closeSidebar]);

  return (
    <>
      {/* Mobile Toggle Button - Always visible when closed */}
      <AnimatePresence>
        {!isExpanded && (
          <MobileToggleButton />
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 bg-white shadow-xl z-50"
            style={{ width: "var(--sidebar-width-expanded)" }}
          >
            <SidebarContent isCollapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileToggleButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-6 z-40 group"
    >
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-8 h-12 bg-white rounded-r-lg shadow-md hover:shadow-lg hover:bg-muted transition-all duration-200 group-hover:w-16 group-hover:translate-x-1"
        aria-label="Open menu"
      >
        <ChevronsRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
}

export function Sidebar() {
  const { isMobile } = useSidebar();

  // Render different sidebar based on viewport
  if (isMobile) {
    return <MobileSidebar />;
  }

  return <DesktopSidebar />;
}
