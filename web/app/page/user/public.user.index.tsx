import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { createTrpcClient } from "@/util";
import { EmptyContent, EmptyTitle, Empty } from "@/components/ui/Empty";
import type { Route } from "./+types/public.user.index";
import { Text } from "@/components/ui/Text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon, HandIcon, UserRoundPenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const currentUser = await trpc.user.getUserById.query({
    id: params.id,
  });

  if (!currentUser) {
    throw new Response("Not Found", { status: 404 });
  }

  const result = await trpc.pictureLesson.list.query({
    userId: params.id,
    status: "published",
  });

  return {
    currentUser,
    lessons: result,
  };
};

export default function Page() {
  const { currentUser, lessons } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-5xl w-full flex flex-col gap-6 overflow-y-auto px-2">
      <div className="flex flex-col gap-2 bg-white shadow-sm p-4 rounded-2xl">
        <Text as={"h2"} className="">
          {currentUser.name.trim() || currentUser.email.trim()}
        </Text>
        <div className="flex items-center gap-2 text-muted-foreground">
          <HandIcon className="size-5" />
          {currentUser.description || "She/He has not any description yet."}
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Empty>
            <EmptyContent>
              <EmptyTitle>She/He has not any picture lessons yet</EmptyTitle>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div>
          <div className="flex justify-end">
            <span>
              {lessons.length} lesson{lessons.length > 1 ? "s" : ""}
            </span>
          </div>
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-2",
              "justify-items-center w-full"
            )}
          >
            {lessons.map((item, index) => (
              <Link key={index} to={`/picture-lesson/${item.id}/${item.slug}`}>
                <Card className="max-w-60 shadow-sm">
                  <CardContent className="flex items-center justify-center pb-0">
                    <img className="w-full h-auto" src={item.thumbnail} />
                  </CardContent>
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-normal">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-end">
                    <Text className="text-muted-foreground">
                      {item.username}
                    </Text>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
