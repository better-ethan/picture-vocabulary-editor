import { Input } from "@/components/retroui/Input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

function PasswordInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const classList = className?.split(" ") ?? [];
  const isInvalid = classList?.includes("is-invalid");

  return (
    <div
      data-slot="password-input"
      data-testid="password-input"
      className={`password-input relative ${isInvalid ? "is-invalid" : ""}`}
    >
      <Input
        type={showPassword ? "text" : "password"}
        name="password"
        className={cn(className, "pr-12")}
        {...props}
      />
      <div
        className={
          "absolute inset-y-0 right-4 flex cursor-pointer items-center pr-3 text-gray-400"
        }
      >
        {showPassword ? (
          <EyeIcon className="h-4 w-4" onClick={togglePasswordVisibility} />
        ) : (
          <EyeOffIcon className="h-4 w-4" onClick={togglePasswordVisibility} />
        )}
      </div>
    </div>
  );
}

export { PasswordInput };
