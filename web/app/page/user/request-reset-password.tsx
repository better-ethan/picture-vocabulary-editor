import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Field } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Form } from "react-router";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import type { Route } from "./+types/request-reset-password";
import { buildPageTitle, type MatchItem } from "@/util";

export const meta: Route.MetaFunction = ({ matches }: Route.MetaArgs) => {
  const pageTitle = buildPageTitle(
    "Request reset password",
    matches as MatchItem[]
  );
  return [{ title: pageTitle }];
};

export default function Page() {
  const [email, setEmail] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const recaptchaToken = await recaptchaRef.current?.executeAsync();

    if (!recaptchaToken) return;

    setIsProcessing(true);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/user/reset-password`,
      fetchOptions: {
        headers: {
          "x-captcha-response": recaptchaToken,
        },
      },
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
      <Card className="w-full max-w-100 shadow-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className={cn("flex flex-col items-center gap-4")}>
              <Text as="h4" className="text-green-600">
                Email sent ✅
              </Text>
              <Text className="text-muted-foreground w-full text-start">
                Check your inbox at{" "}
                <span className="text-blue-600 font-medium">{email}</span>.
              </Text>
              <Text className="text-muted-foreground w-full text-start">
                If you don't see it, please try again.
              </Text>
              <Button
                variant="outline"
                onClick={() => {
                  setIsProcessing(false);
                  setIsSuccess(false);
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <Form
              method="post"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <Field>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="shadow-sm"
                />
              </Field>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY!}
                size="invisible"
              />
              <Button
                type="submit"
                className="w-full shadow-sm"
                disabled={isProcessing}
              >
                {isProcessing ? "Sending..." : "Send a Reset Email"}
              </Button>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
