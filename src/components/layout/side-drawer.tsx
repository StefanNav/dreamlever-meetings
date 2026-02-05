"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsRight, ChevronsLeft, Home, Target, Calendar, Users, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationsPopover } from "./notifications-popover";

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
  avatar: null, // Would be an image URL
  initials: "OR",
};

interface SideDrawerProps {
  defaultOpen?: boolean;
}

export function SideDrawer({ defaultOpen = false }: SideDrawerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const pathname = usePathname();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    // Meetings link should be active for /meetings and /departments routes
    if (href === "/meetings") {
      return pathname.startsWith("/meetings") || pathname.startsWith("/departments");
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Collapsed Handle - Always visible when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-6 z-40 group"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-8 h-12 bg-white rounded-r-lg shadow-md hover:shadow-lg hover:bg-muted transition-all duration-200 group-hover:w-16 group-hover:translate-x-1"
              aria-label="Expand sidebar"
            >
              <ChevronsRight className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[220px] bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header with Logo and Close Button */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] flex items-center justify-center">
                <Image
                  src="/miles-logo.png"
                  alt="Miles"
                  width={16}
                  height={16}
                  className="brightness-0 invert"
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Divider */}
            <div className="border-b border-border mx-0" />

            {/* Main Navigation */}
            <nav className="flex-1 px-2 py-4">
              <ul className="space-y-1">
                {mainNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                        isActiveLink(item.href)
                          ? "bg-cyan-light text-cyan-dark"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom Section */}
            <div className="px-2 pb-4">
              {/* Notifications Popover */}
              <div className="mb-1">
                <NotificationsPopover onCloseDrawer={() => setIsOpen(false)} />
              </div>

              {/* Bottom Navigation Items */}
              <ul className="space-y-1 mb-4">
                {bottomNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                        isActiveLink(item.href)
                          ? "bg-cyan-light text-cyan-dark"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* User Profile */}
              <div className="flex items-center gap-3 px-4 py-2">
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
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
