import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { authClient } from "@/lib/auth-client";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Route } from "./+types/profile";
import { createTrpcClient } from "@/util";
import { redirect, useLoaderData } from "react-router";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/Field";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const currentUser = await trpc.user.getCurrentUser.query();

  if (!currentUser) {
    throw redirect("/login");
  }

  return { currentUser };
};

export default function Page() {
  const { currentUser } = useLoaderData<typeof loader>();
  const { data: session } = authClient.useSession();

  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(currentUser?.name || "");

  const handleSave = async () => {
    try {
      const result = await authClient.updateUser({ name: nickname });
      setEditingNickname(false);
      if (!result.error) {
        toast.success("Profile updated successfully!");
      }
    } finally {
    }
  };

  const [editingDecription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(
    currentUser?.description || ""
  );

  const handleDescriptionSave = async () => {
    try {
      const result = await authClient.updateUser({ description });
      setEditingDescription(false);
      if (!result.error) {
        toast.success("Profile updated successfully!");
      }
    } finally {
    }
  };

  const handleCancel = () => {
    setEditingNickname(false);
    setEditingDescription(false);
  };

  return (
    <div className="flex justify-center items-start h-dvh w-full p-2">
      <Card className="w-full max-w-lg sm:min-w-96 shadow-sm">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field className="">
                <FieldLabel>Email</FieldLabel>
                <p className="text-gray-400">{currentUser?.email}</p>
              </Field>
              <Field>
                <FieldLabel>Nickname</FieldLabel>
                {editingNickname ? (
                  <div className="w-full flex flex-col gap-2">
                    <Input
                      autoFocus
                      value={nickname}
                      className="w-full shadow-sm"
                      onChange={(e) => setNickname(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSave();
                        } else if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                    />
                    <div className="flex justify-end gap-3">
                      <Button size="icon" variant="ghost" onClick={handleSave}>
                        <CheckIcon
                          className="size-4 text-green-500"
                          strokeWidth={4}
                        />
                      </Button>
                      <Button
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
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{nickname}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingNickname(true);
                        setNickname(nickname || "");
                      }}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                  </div>
                )}
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                {editingDecription ? (
                  <div className="w-full flex flex-col gap-2">
                    <Textarea
                      autoFocus
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleDescriptionSave();
                        } else if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                      className="w-full resize-none shadow-sm"
                    />
                    <div className="flex justify-end gap-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleDescriptionSave}
                      >
                        <CheckIcon
                          className="size-4 text-green-500"
                          strokeWidth={4}
                        />
                      </Button>
                      <Button
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
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex-1 wrap-break-word">
                      {description || "Not Set"}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingDescription(true);
                        setDescription(currentUser?.description || "");
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
