import { Button } from "@/components/retroui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export const loader = async () => {};

export default function Page() {
  const { data: session } = authClient.useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (!result.error) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(result.error.message || "Failed to change password.");
      }
    } finally {
    }
  };

  const handleCancel = () => {};

  return (
    <div className="max-w-lg min-w-xs mx-auto px-4">
      <Card className="min-w-xs">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
            />
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
            />

            <Button
              onClick={handleSave}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
