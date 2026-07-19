import { Button } from "@/components/retroui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/reset-password";
import { toast } from "sonner";
import { Input as PasswordInput } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Field } from "@/components/retroui/Field";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const token = searchParams.get("token");
  if (!token) {
    throw new Response("Invalid token", { status: 400 });
  } else {
    return { token };
  }
};

export default function Page() {
  const { token } = useLoaderData<typeof loader>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      toast.error(`Failed to reset password: ${error.message}`);
    } else {
      toast.success(
        "Password reset successful! Please sign in with your new password."
      );
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-100">
        <CardHeader>
          <CardTitle>Set a New Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <Field>
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </Field>
            <Field>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter confirm password"
              />
            </Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
