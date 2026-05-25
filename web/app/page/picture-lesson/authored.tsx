import { Link, useLoaderData } from "react-router";
import { createTrpcClient } from "@/util";
import { EmptyContent, EmptyTitle, Empty } from "@/components/retroui/Empty";
import type { Route } from "./+types/list";
import { Text } from "@/components/retroui/Text";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const result = await trpc.pictureLesson.authored.query({});

  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="max-w-5xl w-full h-full flex flex-col">
      <div className="flex items-center justify-between w-full mb-4">
        <Text as={"h2"} className="mb-4 text-start">
          My Authored
        </Text>
        <span className="text-muted-foreground">
          {data.length} lesson{data.length > 1 ? "s" : ""}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Empty>
            <EmptyContent>
              <EmptyTitle>No Picture Lessons Yet</EmptyTitle>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mx-auto h-auto overflow-y-auto py-2",
            "justify-items-center w-full"
          )}
        >
          {data.map((item, index) => (
            <Card className="max-w-60" key={index}>
              <CardContent className="flex items-center justify-center pb-0">
                <img className="w-50 h-auto" src={item.thumbnail} />
              </CardContent>
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-normal">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 justify-end">
                <Button size={"sm"} asChild>
                  <Link
                    to={`/admin/picture-lesson/${item.id}/${item.slug}/edit`}
                  >
                    Edit
                  </Link>
                </Button>
                <Button size={"sm"} variant={"secondary"} asChild>
                  <Link
                    to={`/picture-lesson/${item.id}/${item.slug}`}
                    target="_blank"
                  >
                    View
                    <ArrowUpRightIcon className="size-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
