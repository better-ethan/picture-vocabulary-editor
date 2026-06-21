import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/index";
import { createTrpcClient } from "@/util";
import {
  playAudio,
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
import { Input } from "@/components/retroui/Input";

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

type Mode = "view" | "fillIn" | "dictation" | "wordBuilding";

export default function Page() {
  const data = useLoaderData<typeof loader>();

  const { images, labels, lines, words } =
    data.content as unknown as CanvasContent;

  const [rate, setRate] = useState(1);

  const [mode, setMode] = useState<Mode>("view");

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [userAnswerResults, setUserAnswerResults] = useState<boolean[]>([]);

  const [isCheckedAnswer, setIsCheckedAnswer] = useState(false);

  const handleFillIn = () => {
    setMode("fillIn");
    setUserAnswers(Array(words.length).fill(""));
    setUserAnswerResults(Array(words.length).fill(false));

    setIsCheckedAnswer(false);
  };

  const handleDictation = () => {};

  const handleWordBuilding = () => {};

  const handleCheckAnswer = () => {
    const results = words.map((word, index) => {
      const userAnswer = userAnswers[index] || "";
      return userAnswer.trim().toLowerCase() === word.word.trim().toLowerCase();
    });
    setUserAnswerResults(results);
    setIsCheckedAnswer(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-250 flex flex-col gap-4">
        {data.status === "draft" && (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center mt-3">
            Draft lesson is only visible to author
          </div>
        )}
        <div className="mt-8 flex flex-col lg:flex-row justify-start gap-3">
          <VocabularyCanvas
            width={700}
            height={600}
            mode="view"
            images={images}
            labels={labels}
            lines={lines}
          />

          <Card className="lg:w-64">
            <CardContent className="flex flex-col justify-between p-2 h-full">
              <div>
                <CardTitle className="text-lg lg:text-2xl">Word List</CardTitle>
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
                {mode === "fillIn" && (
                  <Text className="text-sm text-gray-500 my-2">
                    Fill in the blanks, then click "Check" to verify your
                    answers.
                  </Text>
                )}
                <ul className="flex flex-col gap-2 pr-2 overflow-y-auto max-h-40 lg:max-h-full">
                  {words.map(({ number, word, audio }, index) => (
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
                      {mode === "fillIn" && (
                        <Input
                          type="text"
                          value={userAnswers[index] || ""}
                          onChange={(e) => {
                            const newAnswers = [...userAnswers];
                            newAnswers[index] = e.target.value;
                            setUserAnswers(newAnswers);
                          }}
                          className={cn(
                            "flex-1 border rounded px-2 py-1",
                            userAnswerResults[index] === true &&
                              isCheckedAnswer &&
                              "border-green-500 bg-green-100",
                            userAnswerResults[index] === false &&
                              isCheckedAnswer &&
                              "border-red-600 bg-red-300"
                          )}
                        />
                      )}
                      {mode === "view" && (
                        <Text className="flex-1 font-normal">{word}</Text>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!word}
                        onClick={async () => {
                          await playAudio(audio, rate);
                        }}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              {mode === "fillIn" && (
                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMode("view");
                    }}
                  >
                    Exit
                  </Button>
                  <Button size="sm" onClick={handleCheckAnswer}>
                    Check
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-2 justify-end w-full px-2">
          <Button
            type="button"
            size="sm"
            variant={"secondary"}
            onClick={handleFillIn}
          >
            Fill in
          </Button>
          <Button type="button" size="sm" variant={"secondary"}>
            Dictation
          </Button>
          <Button type="button" size="sm" variant={"secondary"}>
            Word Building
          </Button>
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
