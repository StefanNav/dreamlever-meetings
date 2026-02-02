"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileItem {
  id: string;
  name: string;
  type: "pdf" | "xlsx" | "doc" | "ppt" | "other";
  size: string;
}

interface FilesSectionProps {
  files: FileItem[];
  onFileClick?: (fileId: string) => void;
}

function getFileTypeConfig(type: FileItem["type"]) {
  switch (type) {
    case "pdf":
      return {
        label: "PDF",
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        borderColor: "border-red-200",
      };
    case "xlsx":
      return {
        label: "XLSX",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-200",
      };
    case "doc":
      return {
        label: "DOC",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
      };
    case "ppt":
      return {
        label: "PPT",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
        borderColor: "border-orange-200",
      };
    default:
      return {
        label: "FILE",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        borderColor: "border-gray-200",
      };
  }
}

export function FilesSection({ files, onFileClick }: FilesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">Files</h3>
      {files.length === 0 ? (
        <div className="p-4 bg-white border border-border rounded-lg">
          <p className="text-sm text-muted-foreground/60 italic">
            Attach files that are relevant across meetings (docs, specs, decks).
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
        {files.map((file) => {
          const config = getFileTypeConfig(file.type);
          return (
            <button
              key={file.id}
              onClick={() => onFileClick?.(file.id)}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-lg hover:bg-muted/50 hover:border-muted-foreground/20 transition-colors min-w-[200px]"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center",
                    config.bgColor
                  )}
                >
                  <FileText className={cn("w-4 h-4", config.textColor)} />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded",
                    config.bgColor,
                    config.textColor
                  )}
                >
                  {config.label}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">{file.size}</p>
              </div>
            </button>
          );
        })}
        </div>
      )}
    </div>
  );
}
