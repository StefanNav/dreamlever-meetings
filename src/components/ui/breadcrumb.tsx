"use client";

import Link from "next/link";
import { ChevronsLeft, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onCollapse?: () => void;
}

export function Breadcrumb({ items, onCollapse }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Collapse button */}
      <button
        onClick={onCollapse}
        className="p-1.5 rounded-md hover:bg-muted transition-colors"
        aria-label="Collapse sidebar"
      >
        <ChevronsLeft className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Breadcrumb items */}
      <nav className="flex items-center gap-1" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-sm text-cyan hover:text-cyan-dark transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-foreground">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
