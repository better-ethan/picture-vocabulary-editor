import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/Field";
import { Label } from "@/components/ui/Label";
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
    <div className="flex justify-center items-start h-full px-4">
      <Card className="w-full max-w-100">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <Field>
              <Label htmlFor="current-password">Current Password</Label>
              <PasswordInput
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
              />
            </Field>
            <Field>
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </Field>
            <Field>
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
              />
            </Field>

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
