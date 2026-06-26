import React from "react";
import { cn } from "@/lib/utils";

function Input({
  className = "",
  type = "text",
  placeholder = "Enter text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(
        "px-4 py-2 w-full rounded border-2 shadow-md transition focus:shadow-xs",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "placeholder:text-muted-foreground placeholder:text-sm",
        props["aria-invalid"] &&
          "border-destructive text-destructive shadow-xs shadow-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
