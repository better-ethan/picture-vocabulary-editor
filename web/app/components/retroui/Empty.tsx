import * as React from "react";
import { Ghost } from "lucide-react";

import { Text } from "@/components/retroui/Text";
import { cn } from "@/lib/utils";

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex flex-col items-center justify-center p-4 md:p-8 border-2 rounded shadow-md transition-all hover:shadow-none bg-card text-center",
        className
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex flex-col items-center gap-3", className)}
      {...props}
    />
  );
}

function EmptyIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="empty-icon" className={cn(className)} {...props}>
      {children ?? <Ghost className="w-full h-full" />}
    </div>
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Text
      as="h3"
      data-slot="empty-title"
      className={cn("text-lg md:text-2xl font-bold", className)}
      {...props}
    />
  );
}

function EmptySeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-separator"
      role="separator"
      className={cn("w-full h-1 bg-primary", className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn("text-muted-foreground max-w-[320px]", className)}
      {...props}
    />
  );
}

export {
  EmptyContent,
  EmptyIcon,
  EmptyTitle,
  EmptySeparator,
  EmptyDescription,
};
