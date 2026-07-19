import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  placeholder = "Enter text...",
  rows = 4,
  ...props
}: React.ComponentProps<"textarea"> & {
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      data-slot="textarea"
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "px-4 py-2 w-full border-2 rounded border-border shadow-md transition focus:outline-hidden focus:shadow-xs placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
