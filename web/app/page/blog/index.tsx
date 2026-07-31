import type { Route } from "./+types/index";
import { createTrpcClient } from "@/util";
import { useLoaderData } from "react-router";
import { Text } from "@/components/ui/Text";
import Markdown from "react-markdown";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const result = await trpc.blog.getBySlug.query({
    slug: params.slug,
  });

  if (!result) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return {
    meta: result.meta,
    content: result.content,
  };
};

export default function Page() {
  const { meta, content } = useLoaderData<typeof loader>();

  return (
    <div>
      <article>
        <Markdown>{content}</Markdown>
      </article>
    </div>
  );
}
