import { createTrpcClient } from "@/util";
import {
  VocabularyEditor,
  type CanvasContent,
} from "@/components/vocabulary-edit";
import { toast } from "sonner";
import { useActionData, useNavigate } from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/create";
import { Text } from "@/components/retroui/Text";
import { reuploadPixabayImages } from "@/util/image";

export const loader = async () => {};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const content = formData.get("content") as string;
  let status = formData.get("status");
  if (!status) status = "draft";

  // download and re-upload images to our R2, then replace the src in content
  const updatedContent = await reuploadPixabayImages(JSON.parse(content));

  const trpc = createTrpcClient(request);
  const result = await trpc.pictureLesson.create.mutate({
    title,
    slug,
    description,
    status: status as "draft" | "published",
    thumbnail,
    content: JSON.stringify(updatedContent),
  });

  return result;
};

export default function Page() {
  const actionData = useActionData<typeof action>();

  const navigate = useNavigate();

  useEffect(() => {
    if (actionData && actionData.id) {
      navigate("/admin/picture-lesson/authored", { state: { created: true } });
    }
  }, [actionData]);

  return (
    <div className="w-full h-full overflow-y-auto">
      <VocabularyEditor mode="edit" />
    </div>
  );
}
