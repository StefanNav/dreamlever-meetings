"use client";

interface PurposeSectionProps {
  purpose?: string;
  placeholder?: string;
}

export function PurposeSection({ 
  purpose, 
  placeholder = "Add a purpose for this meeting series..." 
}: PurposeSectionProps) {
  const isEmpty = !purpose || purpose.trim() === "";

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Purpose of Meeting</h3>
      <div className="p-4 bg-white border border-border rounded-lg">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground/60 leading-relaxed italic">
            {placeholder}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {purpose}
          </p>
        )}
      </div>
    </div>
  );
}
