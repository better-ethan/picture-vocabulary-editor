import { createTrpcClient } from "@/util";
import { redirect } from "react-router";
import type { Route } from "./+types/delete";

export const action = async ({ params, request }: Route.ActionArgs) => {
  const trpc = createTrpcClient(request);

  await trpc.pictureLesson.remove.mutate({
    id: parseInt(params.id),
  });
  return redirect("/admin/picture-lesson/authored?deleted=true");
};
