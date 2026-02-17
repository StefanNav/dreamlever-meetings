"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Settings, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useSidebar } from "@/context/sidebar-context";
import { cn } from "@/lib/utils";
import {
  NotificationFilters,
  NotificationList,
  NotificationSettingsModal,
} from "@/components/notifications";
import {
  mockNotifications,
  defaultNotificationPreferences,
} from "@/lib/notifications-data";
import type {
  Notification,
  NotificationFilterType,
  NotificationStatusFilter,
  NotificationPreferences,
} from "@/types/notifications";

interface NotificationsDrawerProps {
  isCollapsed?: boolean;
}

export function NotificationsDrawer({
  isCollapsed = false,
}: NotificationsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isExpanded, isMobile } = useSidebar();

  // Notification state
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [typeFilter, setTypeFilter] = useState<NotificationFilterType>("all");
  const [statusFilter, setStatusFilter] =
    useState<NotificationStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    defaultNotificationPreferences
  );

  const hasUnread = notifications.some((n) => !n.isRead);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Track mount for portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (typeFilter !== "all" && notification.type !== typeFilter) return false;
      if (statusFilter === "unread" && notification.isRead) return false;
      if (statusFilter === "read" && !notification.isRead) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !notification.primaryText.toLowerCase().includes(query) &&
          !notification.contextText.toLowerCase().includes(query)
        )
          return false;
      }
      return true;
    });
  }, [notifications, typeFilter, statusFilter, searchQuery]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Handlers
  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [filteredNotifications]
  );

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleMarkSelectedAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.has(n.id) ? { ...n, isRead: true } : n))
    );
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleDelete = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleNavigate = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSavePreferences = useCallback(
    (newPrefs: NotificationPreferences) => {
      setPreferences(newPrefs);
    },
    []
  );

  // Calculate the left offset based on sidebar state
  const drawerLeft = isMobile
    ? 0
    : isExpanded
      ? "var(--sidebar-width-expanded)"
      : "var(--sidebar-width-collapsed)";

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  // Bell button trigger
  const bellButton = (
    <button
      onClick={toggleDrawer}
      className={cn(
        "relative flex items-center rounded-lg text-sm font-medium transition-colors",
        isOpen
          ? "bg-cyan-light text-cyan-dark"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        isCollapsed
          ? "justify-center w-9 h-9 p-0"
          : "gap-3 px-3 py-2 w-full"
      )}
      aria-label="Notifications"
    >
      <div className="relative">
        <Bell className="w-4 h-4" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
        )}
      </div>
      {!isCollapsed && "Notifications"}
    </button>
  );

  return (
    <>
      {/* Trigger Button */}
      {isCollapsed ? (
        <Tooltip content="Notifications" position="right">
          {bellButton}
        </Tooltip>
      ) : (
        bellButton
      )}

      {/* Drawer - rendered via portal to escape sidebar bounds */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/20 z-[30]"
                  onClick={() => setIsOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Drawer Panel */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 300,
                  }}
                  className="fixed top-0 bottom-0 w-[440px] bg-white shadow-xl z-[31] flex flex-col border-r border-border"
                  style={{ left: drawerLeft }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Notifications
                      </h2>
                      {unreadCount > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSettings(true)}
                        className="gap-1.5"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 p-0"
                        aria-label="Close notifications"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="px-6 py-3 border-b border-border shrink-0">
                    <NotificationFilters
                      typeFilter={typeFilter}
                      statusFilter={statusFilter}
                      searchQuery={searchQuery}
                      onTypeChange={setTypeFilter}
                      onStatusChange={setStatusFilter}
                      onSearchChange={setSearchQuery}
                    />
                  </div>

                  {/* Bulk Actions */}
                  {selectedIds.size > 0 && (
                    <div className="flex items-center gap-3 px-6 py-2 border-b border-border bg-muted/30 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {selectedIds.size} selected
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkSelectedAsRead}
                          className="h-7 gap-1 text-xs"
                        >
                          <Check className="w-3 h-3" />
                          Read
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteSelected}
                          className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Notification List - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-6 py-3">
                    <NotificationList
                      notifications={filteredNotifications}
                      selectedIds={selectedIds}
                      onSelect={handleSelect}
                      onSelectAll={handleSelectAll}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                      onNavigate={handleNavigate}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>,
          document.body
        )}

      {/* Settings Modal */}
      <NotificationSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />
    </>
  );
}
