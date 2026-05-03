import { Button } from "@/components/retroui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Text } from "@/components/retroui/Text";
import { Form, Link } from "react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/admin/user/profile",
      },
      {
        onRequest: (ctx) => {
          toast.info("Sign in in progress...");
        },
        onSuccess: () => {
          toast.success("Sign in successful!");
        },
        onError: (ctx) => {
          if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
            toast.error(`Please verify your email address before signing in.`);
          } else {
            toast.error(`Sign in failed: ${ctx.error.message}`);
          }
        },
      }
    );
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <Text>
            Don't have an account?{" "}
            <Link to="/signup" className="ml-2 text-blue-600 hover:underline">
              Create one
            </Link>
          </Text>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form
            method="POST"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password:</Label>
              <PasswordInput
                type="password"
                id="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
              />
            </div>
            <Button type="submit">Sign In</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
