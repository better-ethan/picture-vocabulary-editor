import { Link, useLoaderData, useParams } from "react-router";
import type { Route } from "./+types/index";
import { createTrpcClient } from "@/util";
import {
  playAudio,
  speak,
  VocabularyCanvas,
  VocabularyEditor,
  WordAudio,
  type CanvasContent,
} from "@/components/vocabulary-edit";
import {
  BlocksIcon,
  CalendarIcon,
  ComponentIcon,
  DatabaseSearchIcon,
  TagIcon,
  User2Icon,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const id = params.id;
  const slug = params.slug;
  if (!id || !slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const trpc = createTrpcClient(request);

  const result = await trpc.pictureVocab.getByIdAndSlug.query({
    id,
    slug,
  });

  if (!result) {
    throw new Response("Not Found", { status: 404 });
  }

  const currentUser = await trpc.user.getCurrentUser.query();

  if (result.status === "draft" && currentUser?.id !== result.userId) {
    throw new Response("Not Found", { status: 404 });
  }

  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

  const { images, labels, lines, words } =
    data.content as unknown as CanvasContent;

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const params = useParams();

  return (
    <div className="w-full bg-white overflow-y-auto">
      <VocabularyCanvas
        mode="view"
        images={images}
        labels={labels}
        lines={lines}
        words={words}
      />
      <div className="flex items-center justify-center gap-2 mt-2">
        <img src="/images/logo.webp" className="h-5 w-auto" />
        <Text>
          View on{" "}
          <Link
            to={`${origin}/picture-vocab/${params.id}/${params.slug}`}
            className="text-blue-600"
            target="_blank"
          >
            PixVocab
          </Link>
        </Text>
      </div>
    </div>
  );
}
