import { useLoaderData } from "react-router";
import type { Route } from "./+types/index";
import { trpc } from "@/util";
import {
  speak,
  VocabularyCanvas,
  VocabularyEditor,
  type CanvasContent,
} from "@/components/vocabulary-edit";
import { Volume2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import { Badge } from "@/components/retroui/Badge";
import { cn } from "@/lib/utils";

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

  const { images, labels, words } = data.content as unknown as CanvasContent;

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-3xl font-bold text-start">{data.title}</h1>
      <div className="mt-8 flex justify-center">
        <VocabularyCanvas
          width={700}
          height={600}
          mode="view"
          images={images}
          labels={labels}
        />

        <Card className="w-full lg:w-64 shrink-0 ml-6">
          <CardHeader>
            <CardTitle>Word List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {words.map(({ number, word }) => (
                <li key={number} className="flex items-center gap-2">
                  <Badge
                    variant="default"
                    className={cn(
                      "w-6 h-6 flex items-center justify-center shrink-0 rounded-full p-0",
                      "bg-white text-gray-700 border"
                    )}
                  >
                    {number}
                  </Badge>
                  <Text className="flex-1 font-normal">{word}</Text>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!word}
                    onClick={() => speak(word)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 max-w-3xl">
        <CardHeader>
          <CardTitle className="text-sm">Description</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Text as="p" className="text-sm leading-relaxed">
            {data.description}
          </Text>
        </CardContent>
      </Card>
    </div>
  );
}
