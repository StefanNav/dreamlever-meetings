"use client";

import { useState, useMemo, useCallback } from "react";
import { Settings, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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

export default function NotificationsPage() {
  // State
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [typeFilter, setTypeFilter] = useState<NotificationFilterType>("all");
  const [statusFilter, setStatusFilter] =
    useState<NotificationStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    defaultNotificationPreferences
  );

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Type filter
      if (typeFilter !== "all" && notification.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === "unread" && notification.isRead) {
        return false;
      }
      if (statusFilter === "read" && !notification.isRead) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesPrimary = notification.primaryText
          .toLowerCase()
          .includes(query);
        const matchesContext = notification.contextText
          .toLowerCase()
          .includes(query);
        if (!matchesPrimary && !matchesContext) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, typeFilter, statusFilter, searchQuery]);

  // Counts
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handlers
  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
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
    setShowDeleteConfirm(false);
  }, [selectedIds]);

  const handleSavePreferences = useCallback(
    (newPrefs: NotificationPreferences) => {
      setPreferences(newPrefs);
      // In a real app, this would persist to a backend
    },
    []
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Notifications" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#2D4A50]">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
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
          <div className="flex items-center gap-3 mb-4 p-3 bg-[#FCFCFC] rounded-xl border border-[#E6E6E6]">
            <span className="text-sm text-[#6D9097]">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedAsRead}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Mark as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Notification List */}
        <NotificationList
          notifications={filteredNotifications}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      {/* Settings Modal */}
      <NotificationSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteSelected}
        title="Delete notifications"
        description={`Are you sure you want to delete ${selectedIds.size} notification${selectedIds.size === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
}
