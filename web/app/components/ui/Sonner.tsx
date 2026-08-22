"use client";

import { ErrorIcon, SuccessIcon } from "@/components/partial";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <SuccessIcon />,
        info: <InfoIcon className="size-8" />,
        warning: <TriangleAlertIcon className="size-8" />,
        error: <ErrorIcon />,
        loading: <Loader2Icon className="size-8 animate-spin" />,
      }}
      toastOptions={{
        // Fully unstyled so the neobrutalist recipe below owns every surface:
        // hard offset shadow, 2px border, square corners, press-down buttons.
        unstyled: true,
        classNames: {
          toast:
            "group/toast relative flex w-(--width) items-center gap-3 rounded border-2 border-border bg-popover p-4 font-sans text-popover-foreground shadow-sm",
          content: "flex min-w-0 flex-col gap-0.5",
          title: "font-head text-sm font-medium",
          description: "text-sm text-muted-foreground",
          icon: "shrink-0",
          actionButton:
            "ms-auto h-fit min-w-fit shrink-0 rounded border-2 border-border bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
          cancelButton:
            "ms-auto h-fit min-w-fit shrink-0 rounded border-2 border-border bg-muted px-2 py-1 text-xs font-medium text-foreground shadow-sm transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
          closeButton:
            "absolute -top-2 -start-2 rounded-full border-2 border-border bg-background p-0.5 transition-colors hover:bg-muted",
          success: "[&_[data-icon]]:text-chart-2",
          warning: "[&_[data-icon]]:text-chart-1",
          error: "[&_[data-icon]]:text-destructive text-destructive",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
