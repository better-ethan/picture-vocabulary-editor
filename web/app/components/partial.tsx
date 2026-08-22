import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "lucide-react";

export function ErrorIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-0.5",
        "rounded-full bg-destructive text-destructive-foreground"
      )}
    >
      <XIcon className={cn("size-4", className)} />
    </div>
  );
}

export function SuccessIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-0.5",
        "rounded-full bg-green-600 text-white"
      )}
    >
      <CheckIcon className={cn("size-4", className)} />
    </div>
  );
}
