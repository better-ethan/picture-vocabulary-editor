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
import { MainLogo } from "@/components/partial";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const id = params.id;
  const slug = params.slug;
  if (!id || !slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const trpc = createTrpcClient(request);

  const pictureVocab = await trpc.pictureVocab.getByIdAndSlug.query({
    id,
    slug,
  });

  if (!pictureVocab) {
    throw new Response("Not Found", { status: 404 });
  }

  const currentUser = await trpc.user.getCurrentUser.query();

  if (
    pictureVocab.status === "draft" &&
    currentUser?.id !== pictureVocab.userId
  ) {
    throw new Response("Not Found", { status: 404 });
  }

  const subscriptionStatus = await trpc.stripe.getSubscriptionStatus.query();

  return { pictureVocab, subscriptionStatus };
};

export default function Page() {
  const { pictureVocab, subscriptionStatus } = useLoaderData<typeof loader>();

  const { images, labels, lines, words } =
    pictureVocab.content as unknown as CanvasContent;

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const params = useParams();

  const isPro = subscriptionStatus && subscriptionStatus.status === "active";

  return (
    <div className="w-full bg-white overflow-y-auto">
      {isPro ? (
        <VocabularyCanvas
          mode="view"
          images={images}
          labels={labels}
          lines={lines}
          words={words}
        />
      ) : (
        <div>
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Text className="text-lg font-semibold text-gray-800">
              This service is unavailable now
            </Text>
            <Text className="text-muted-foreground">
              Upgrade to Pro to view this content
            </Text>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center gap-2 mt-2">
        <Text>View on </Text>
        <Link
          to={`${origin}/picture-vocab/${params.id}/${params.slug}`}
          className="text-blue-600"
          target="_blank"
        >
          <MainLogo className="h-5 w-auto" />
        </Link>
      </div>
    </div>
  );
}
