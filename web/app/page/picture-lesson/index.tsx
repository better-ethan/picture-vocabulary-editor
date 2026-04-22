import { useLoaderData } from "react-router";
import type { Route } from "./+types/index";
import { trpc } from "@/util";
import { VocabularyEditor } from "@/components/vocabulary-edit";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const id = params.id;
  const slug = params.slug;
  if (!id || !slug) {
    throw new Response("Not Found", { status: 404 });
  }
  const result = await trpc.pictureLesson.getByIdAndSlug.query({
    id: parseInt(id),
    slug,
  });

  if (!result) {
    throw new Response("Not Found", { status: 404 });
  }

  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-3xl font-bold text-start">{data.title}</h1>
      <div className="mt-8 flex justify-center">
        <VocabularyEditor
          mode="view"
          width={700}
          height={600}
          data={{
            title: data.title,
            description: data.description as string,
            content: data.content!,
          }}
        />
      </div>
    </div>
  );
}
