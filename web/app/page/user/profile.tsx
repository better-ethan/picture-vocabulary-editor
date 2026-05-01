import { Button } from "@/components/retroui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { authClient } from "@/lib/auth-client";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const loader = async () => {};

export default function Page() {
  const { data: session } = authClient.useSession();

  const [editingNickname, setEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(session?.user.name || "");

  const handleSave = async () => {
    try {
      const result = await authClient.updateUser({ name: nickname });
      setEditingNickname(false);
      if (!result.error) {
        toast.success("Nickname updated successfully!");
      }
    } finally {
    }
  };

  const handleCancel = () => {
    setEditingNickname(false);
  };

  return (
    <div className="max-w-lg min-w-xs mx-auto px-4">
      <Card className="min-w-xs">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Email</span>
              <span className="text-gray-400">{session?.user.email}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="font-medium">Nickname</span>
              {editingNickname ? (
                <div className="flex items-center gap-2">
                  <Input
                    autoFocus
                    value={nickname}
                    className="h-7 w-36"
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSave();
                      } else if (e.key === "Escape") {
                        handleCancel();
                      }
                    }}
                  />
                  <Button size="icon" variant="ghost" onClick={handleSave}>
                    <CheckIcon
                      className="size-4 text-green-500"
                      strokeWidth={4}
                    />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancel}>
                    <XIcon className="size-4 text-red-500" strokeWidth={4} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{session?.user.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingNickname(true);
                      setNickname(session?.user.name || "");
                    }}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
