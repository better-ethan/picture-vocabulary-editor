import { Button } from "@/components/retroui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { Text } from "@/components/retroui/Text";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Form } from "react-router";
import { toast } from "sonner";

export default function Page() {
  const [email, setEmail] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsProcessing(true);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/user/reset-password`,
    });

    if (error) {
      toast.error(`Failed to send reset email: ${error.message}`);
      setIsProcessing(false);
    } else {
      setIsSuccess(true);
    }
  };
  return (
    <div className="flex h-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className={cn("flex flex-col items-center gap-4")}>
              <Text as="h4" className="text-green-600">
                Email sent!
              </Text>
              <Text className="text-muted-foreground">
                Check your inbox at{" "}
                <span className="text-blue-600 font-medium">{email}</span>.
              </Text>
              <Text className="text-muted-foreground">
                If you don't see it, please try again.
              </Text>
            </div>
          ) : (
            <Form
              method="post"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <Input
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? "Sending..." : "Send a Reset Email"}
              </Button>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
