import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { authClient } from "@/lib/auth-client";
import {
  CheckIcon,
  MailIcon,
  PencilIcon,
  UserRoundIcon,
  UserRoundPenIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Route } from "./+types/profile";
import { createTrpcClient } from "@/util";
import { redirect, useFetcher, useLoaderData } from "react-router";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/Field";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const currentUser = await trpc.user.getCurrentUser.query();

  if (!currentUser) {
    throw redirect("/login");
  }

  return { currentUser };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const trpc = createTrpcClient(request);

  const formData = await request.formData();
  const name = formData.get("name") as string | null;
  const description = formData.get("description") as string | null;

  const result = await trpc.user.updateProfile.mutate({
    ...(name !== null ? { name } : {}),
    ...(description !== null ? { description } : {}),
  });

  return result;
};

export default function Page() {
  const { currentUser } = useLoaderData<typeof loader>();

  const [editingNickname, setEditingNickname] = useState(false);

  const [editingDecription, setEditingDescription] = useState(false);

  const handleCancel = () => {
    setEditingNickname(false);
    setEditingDescription(false);
  };

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      toast.success("Profile updated successfully!");
      setEditingNickname(false);
      setEditingDescription(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="flex justify-center items-start h-dvh w-full p-2">
      <Card className="w-full max-w-lg sm:min-w-96 shadow-sm">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>
                  <MailIcon className="size-5" /> Email
                </FieldLabel>
                <p className="text-gray-400">{currentUser?.email}</p>
              </Field>
              <Field>
                <FieldLabel>
                  <UserRoundIcon className="size-5" /> Nickname
                </FieldLabel>
                {editingNickname ? (
                  <fetcher.Form
                    className="w-full flex flex-col gap-2"
                    method="post"
                  >
                    <Input
                      name="name"
                      autoFocus
                      defaultValue={currentUser?.name || ""}
                      className="w-full shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                    />
                    <div className="flex justify-end gap-3">
                      <Button size="icon" variant="ghost" type="submit">
                        <CheckIcon
                          className="size-4 text-green-500"
                          strokeWidth={4}
                        />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={handleCancel}
                      >
                        <XIcon
                          className="size-4 text-red-500"
                          strokeWidth={4}
                        />
                      </Button>
                    </div>
                  </fetcher.Form>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">
                      {currentUser?.name || "Not Set"}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingNickname(true);
                      }}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  </div>
                )}
              </Field>
              <Field>
                <FieldLabel>
                  <UserRoundPenIcon className="size-5" /> Description
                </FieldLabel>
                {editingDecription ? (
                  <fetcher.Form
                    className="w-full flex flex-col gap-2"
                    method="post"
                  >
                    <Textarea
                      name="description"
                      autoFocus
                      defaultValue={currentUser?.description || ""}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                      className="w-full resize-none shadow-sm"
                    />
                    <div className="flex justify-end gap-3">
                      <Button type="submit" size="icon" variant="ghost">
                        <CheckIcon
                          className="size-4 text-green-500"
                          strokeWidth={4}
                        />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={handleCancel}
                      >
                        <XIcon
                          className="size-4 text-red-500"
                          strokeWidth={4}
                        />
                      </Button>
                    </div>
                  </fetcher.Form>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex-1 wrap-break-word">
                      {currentUser?.description || "Not Set"}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingDescription(true);
                      }}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  </div>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
}
