"use client";

import { type ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/context/sidebar-context";
import { Sidebar } from "./sidebar";

interface AppShellProps {
  children: ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const { isExpanded, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className="min-h-screen transition-[margin] duration-300 ease-in-out"
        style={{
          marginLeft: isMobile
            ? 0
            : isExpanded
            ? "var(--sidebar-width-expanded)"
            : "var(--sidebar-width-collapsed)",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultExpanded={true}>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
