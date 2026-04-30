import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { authClient } from "@/lib/auth-client";

export const loader = async () => {};

export default function Page() {
  const { data: session } = authClient.useSession();

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
            <div className="flex justify-between">
              <span className="font-medium">Nickname</span>
              <span className="text-gray-400">{session?.user.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
