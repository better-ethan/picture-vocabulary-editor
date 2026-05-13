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

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const result = await trpc.pictureLesson.authored.query({});

  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-4 container mx-auto max-w-4xl">
      <Text as={"h2"} className="mb-4">
        My Authored
      </Text>

      {data.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Empty>
            <EmptyContent>
              <EmptyTitle>No Picture Lessons Yet</EmptyTitle>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <Card className="max-w-60" key={index}>
              <CardContent className="flex items-center justify-center pb-0">
                <img className="w-50 h-auto" src={item.thumbnail} />
              </CardContent>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 justify-end">
                <Button size={"sm"} variant={"secondary"} asChild>
                  <Link to={`/picture-lesson/${item.id}/${item.slug}`}>
                    View
                  </Link>
                </Button>
                <Button size={"sm"} asChild>
                  <Link
                    to={`/admin/picture-lesson/${item.id}/${item.slug}/edit`}
                  >
                    Edit
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
