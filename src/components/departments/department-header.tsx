"use client";

import { useState } from "react";
import { Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DepartmentHeaderProps {
  title: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
  onShare?: () => void;
}

export function DepartmentHeader({
  title,
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
  onShare,
}: DepartmentHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleFavoriteClick = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    onFavoriteToggle?.(newValue);
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <button
          onClick={handleFavoriteClick}
          className="p-1 rounded-md hover:bg-muted transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-foreground"
            )}
          />
        </button>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-2 rounded-full"
        onClick={onShare}
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
    </div>
  );
}
