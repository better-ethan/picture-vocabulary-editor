import { Link, useLoaderData } from "react-router";
import { createTrpcClient } from "@/util";
import { EmptyContent, EmptyTitle, Empty } from "@/components/ui/Empty";
import type { Route } from "./+types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { PictureLessonCard } from "@/components/picture-lesson-card";
import type { PictureLesson } from "@/types";

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
          <Empty className="shadow-sm">
            <EmptyContent>
              <EmptyTitle>No Picture Lessons Yet</EmptyTitle>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {lessons.map((item, index) => (
            <PictureLessonCard key={index} lesson={item as PictureLesson} />
          ))}
        </div>
      )}
    </div>
  );
}
