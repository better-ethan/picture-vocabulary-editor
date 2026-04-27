import { trpc } from "@/util";
import { VocabularyEditor } from "@/components/vocabulary-edit";
import { toast } from "sonner";
import { useActionData, useLoaderData } from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/edit";
import { reuploadPixabayImages } from "@/util/image";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const id = params.id;
  const slug = params.slug;
  if (!id) {
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

export const action = async ({ params, request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  let status = formData.get("status");
  if (!status) status = "draft";

  const updatedContent = await reuploadPixabayImages(JSON.parse(content));

  const result = await trpc.pictureLesson.toggle.mutate({
    id: parseInt(params.id!),
    title,
    slug,
    description,
    status: status as "draft" | "published",
    content: JSON.stringify(updatedContent),
  });
  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData && actionData.id) {
      toast.success("Successfully update this picture lesson!");
    }
  }, [actionData]);

  return (
    <div className="pt-16 p-4 container mx-auto">
      <div className="mt-8 flex justify-center">
        <VocabularyEditor
          width={700}
          height={600}
          mode="edit"
          data={{
            title: data.title,
            slug: data.slug,
            status: data.status as "draft" | "published",
            description: data.description as string,
            content: data.content!,
          }}
        />
      </div>
    </div>
  );
}
