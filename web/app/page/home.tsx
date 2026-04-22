import { trpc } from "@/util";
import type { Route } from "./+types/home";
import { VocabularyEditor } from "@/components/vocabulary-edit";
import { toast } from "sonner";
import { useActionData } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Learning Language through Picture and Audio" },
    {
      name: "description",
      content: "Learning Language through Picture and Audio",
    },
  ];
}

export const loader = async () => {};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  let status = formData.get("status");
  if (!status) status = "draft";

  const result = await trpc.pictureLesson.create.mutate({
    title,
    slug,
    description,
    status: status as "draft" | "published",
    content,
  });
  return result;
};

export default function Home() {
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData && actionData.id) {
      toast.success("Successfully created a new picture lesson!");
    }
  }, [actionData]);

  return (
    <div className="pt-16 p-4 container mx-auto">
      <h1 className="text-3xl font-bold text-primary text-center">
        Learning Language through Picture and Audio
      </h1>
      <div className="mt-8 flex justify-center">
        <VocabularyEditor width={700} height={600} mode="edit" />
      </div>
    </div>
  );
}
