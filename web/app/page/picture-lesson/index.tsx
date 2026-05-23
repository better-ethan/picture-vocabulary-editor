import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/index";
import { createTrpcClient } from "@/util";
import {
  speak,
  VocabularyCanvas,
  VocabularyEditor,
  type CanvasContent,
} from "@/components/vocabulary-edit";
import { User2Icon, Volume2 } from "lucide-react";
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
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/retroui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/retroui/Select";
import { Field } from "@/components/ui/field";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const id = params.id;
  const slug = params.slug;
  if (!id || !slug) {
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

  const [rate, setRate] = useState(1);

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-full max-w-250 flex flex-col gap-4">
        {data.status === "draft" && (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center">
            Draft lesson is only visible to author
          </div>
        )}
        <div className="mt-8 flex justify-start">
          <VocabularyCanvas
            width={700}
            height={600}
            mode="view"
            images={images}
            labels={labels}
            lines={lines}
          />

          <Card className="w-full lg:w-64 shrink-0 ml-6">
            <CardContent>
              <CardTitle>Word List</CardTitle>
              <Field className="flex flex-row justify-between items-center mb-4">
                <Label htmlFor="rate">Rate</Label>
                <Select
                  value={rate.toString()}
                  onValueChange={(value) => setRate(parseFloat(value))}
                >
                  <SelectTrigger
                    id="rate"
                    className="min-w-12 h-8 p-2 py-1 shadow-none"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-12">
                    <SelectItem value="0.5">🐢 0.5x</SelectItem>
                    <SelectItem value="0.75">🚶 0.75x</SelectItem>
                    <SelectItem value="1">🚴 1x</SelectItem>
                    <SelectItem value="1.25">🏃 1.25x</SelectItem>
                    <SelectItem value="1.5">🚗 1.5x</SelectItem>
                    <SelectItem value="1.75">✈️ 1.75x</SelectItem>
                    <SelectItem value="2">🚀 2x</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
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
                      onClick={() => speak(word, rate)}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-start">{data.title}</h1>
          <Link
            to={`/user/${data.userId}/${data.username}`}
            className="flex items-center gap-2 hover:underline hover:text-blue-600"
          >
            <User2Icon className="size-5" />
            <Text>{data.username}</Text>
          </Link>
        </div>
        <DescriptionSection description={data.description || ""} />
      </div>
    </div>
  );
}

function DescriptionSection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setClamped(element.scrollHeight > element.clientHeight);
    }
  }, [description]);

  return (
    <div className="bg-[#EEEEEE] p-4 min-h-25 rounded-lg">
      <p ref={textRef} className={cn("", !expanded && "line-clamp-1")}>
        {description}
      </p>
      {(clamped || expanded) && (
        <Button
          type="button"
          size={"sm"}
          variant={"secondary"}
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2"
        >
          {expanded ? "Show Less" : "More"}
        </Button>
      )}
    </div>
  );
}
