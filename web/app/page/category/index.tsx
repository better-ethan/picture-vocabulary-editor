import { Link, useLoaderData } from "react-router";
import { createTrpcClient } from "@/util";
import { EmptyContent, EmptyTitle, Empty } from "@/components/retroui/Empty";
import type { Route } from "./+types/index";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const slug = params.slug;

  if (slug === "all") {
    const lessons = await trpc.pictureLesson.list.query({
      status: "published",
    });

    return {
      currentCategory: { name: "All Lessons" },
      lessons,
    };
  }

  const currentCategory = await trpc.category.getBySlug.query({
    slug,
  });

  if (!currentCategory) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const lessons = await trpc.pictureLesson.list.query({
    status: "published",
    categoryId: currentCategory.id,
  });

  return {
    currentCategory: { name: currentCategory.name },
    lessons,
  };
};

export default function Page() {
  const { currentCategory, lessons } = useLoaderData<typeof loader>();

  return (
    <div className="p-4 container mx-auto max-w-4xl">
      <Text as="h3">{currentCategory.name}</Text>
      <p className="text-muted-foreground mt-4 mb-6">
        Choose a lesson to start learning
      </p>

      {lessons.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Empty>
            <EmptyContent>
              <EmptyTitle>No Picture Lessons Yet</EmptyTitle>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {lessons.map((item, index) => (
            <Link key={index} to={`/picture-lesson/${item.id}/${item.slug}`}>
              <Card className="max-w-60">
                <CardContent className="flex items-center justify-center pb-0">
                  <img className="w-50 h-auto" src={item.thumbnail} />
                </CardContent>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 pt-2">
                  <Text className="text-muted-foreground">{item.username}</Text>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
