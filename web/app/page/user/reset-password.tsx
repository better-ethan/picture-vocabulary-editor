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
import { Form, useLoaderData } from "react-router";
import type { Route } from "./+types/reset-password";
import { toast } from "sonner";

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Set a New Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <Input
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
            <Input
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter confirm password"
            />
            <Button type="submit" className="w-full">
              Save
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
