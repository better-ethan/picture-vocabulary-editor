import { createTrpcClient } from "@/util";
import { VocabularyEditor } from "@/components/vocabulary-edit";
import { toast } from "sonner";
import { useActionData, useLoaderData, useNavigate } from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/edit";
import { reuploadPixabayImages } from "@/util/image";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const id = params.id;
  const slug = params.slug;
  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

  const trpc = createTrpcClient(request);

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
  const thumbnail = formData.get("thumbnail") as string;
  const content = formData.get("content") as string;
  let status = formData.get("status");
  if (!status) status = "draft";

  const updatedContent = await reuploadPixabayImages(JSON.parse(content));

  const trpc = createTrpcClient(request);

  const result = await trpc.pictureLesson.toggle.mutate({
    id: parseInt(params.id!),
    title,
    slug,
    description,
    thumbnail,
    status: status as "draft" | "published",
    content: JSON.stringify(updatedContent),
  });
  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigate = useNavigate();
  useEffect(() => {
    if (actionData && actionData.id) {
      navigate("/admin/picture-lesson/authored", { state: { updated: true } });
    }
  }, [actionData]);

  return (
    <div className="w-full h-full overflow-y-auto">
      <VocabularyEditor
        width={700}
        height={600}
        mode="edit"
        operation="edit"
        data={{
          title: data.title,
          slug: data.slug,
          status: data.status as "draft" | "published",
          description: data.description as string,
          thumbnail: data.thumbnail,
          content: data.content!,
        }}
      />
    </div>
  );
}
