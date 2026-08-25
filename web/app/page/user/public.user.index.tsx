import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { createTrpcClient } from "@/util";
import { EmptyContent, EmptyTitle, Empty } from "@/components/ui/empty";
import type { Route } from "./+types/public.user.index";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon, HandIcon, UserRoundPenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { PictureVocabCard } from "@/components/picture-vocab-card";
import type { PictureVocab } from "@/types";

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
    <div className="p-4 mx-auto max-w-5xl gap-6 flex flex-col ">
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
              <EmptyTitle>She/He has not any picture vocab yet</EmptyTitle>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <span>
              {lessons.length} vocab{lessons.length > 1 ? "s" : ""}
            </span>
          </div>
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
            )}
          >
            {lessons.map((item, index) => (
              <PictureVocabCard key={index} lesson={item as PictureVocab} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
