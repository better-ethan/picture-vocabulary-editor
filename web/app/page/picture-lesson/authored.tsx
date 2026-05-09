import { Link, useLoaderData } from "react-router";
import { createTrpcClient } from "@/util";
import { EmptyContent, EmptyTitle, Empty } from "@/components/retroui/Empty";
import type { Route } from "./+types/list";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const result = await trpc.pictureLesson.authored.query({});

  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-4 container mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-2">Picture Lessons</h1>
      <p className="text-muted-foreground mb-10">
        Choose a lesson to start learning
      </p>

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
            <Link
              key={index}
              to={`/admin/picture-lesson/${item.id}/${item.slug}/preview`}
              className="group block rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary transition-all duration-200 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-lg">
                  →
                </span>
              </div>
              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
